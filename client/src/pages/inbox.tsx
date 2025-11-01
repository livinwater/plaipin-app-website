import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  text: string;
  receivedAt: string;
}

interface Conversation {
  from: string;
  lastSubject: string;
  lastReceivedAt: string;
  unreadCount: number;
}

export default function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/agentmail/conversations"],
  });

  const { data: messages = [] } = useQuery<EmailMessage[]>({
    queryKey: ["/api/agentmail/messages", selectedEmail],
    enabled: !!selectedEmail,
  });

  const sendReplyMutation = useMutation({
    mutationFn: async (reply: { to: string; subject: string; text: string }) => {
      return apiRequest("POST", "/api/agentmail/send", reply);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agentmail/messages", selectedEmail] });
      queryClient.invalidateQueries({ queryKey: ["/api/agentmail/conversations"] });
      setReplyText("");
    },
  });

  const handleSendReply = () => {
    if (replyText.trim() && selectedEmail) {
      const selectedConversation = conversations.find(c => c.from === selectedEmail);
      if (selectedConversation) {
        sendReplyMutation.mutate({
          to: selectedEmail,
          subject: `Re: ${selectedConversation.lastSubject}`,
          text: replyText,
        });
      }
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-border p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4" data-testid="text-inbox-title">Inbox</h2>
        {conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet</p>
        ) : (
          conversations.map((conversation) => (
            <Card 
              key={conversation.from}
              className={`cursor-pointer hover-elevate ${selectedEmail === conversation.from ? 'bg-sidebar-accent' : ''}`}
              onClick={() => setSelectedEmail(conversation.from)}
              data-testid={`card-conversation-${conversation.from}`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold" data-testid={`text-conversation-from-${conversation.from}`}>
                    {conversation.from}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.lastReceivedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{conversation.lastSubject}</p>
                {conversation.unreadCount > 0 && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex-1 flex flex-col">
        {selectedEmail ? (
          <>
            <div className="border-b border-border p-6">
              <h2 className="text-xl font-bold" data-testid="text-active-conversation">{selectedEmail}</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <Card key={message.id} data-testid={`message-${message.id}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold">{message.from}</div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.receivedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">{message.subject}</div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="border-t border-border p-6">
              <div className="flex gap-2">
                <Input 
                  placeholder="Type your reply..." 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  data-testid="input-reply"
                />
                <Button 
                  onClick={handleSendReply}
                  disabled={sendReplyMutation.isPending || !replyText.trim()}
                  data-testid="button-send-reply"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
