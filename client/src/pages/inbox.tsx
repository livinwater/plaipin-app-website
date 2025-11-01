import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface EmailMetadata {
  userId?: string;
  deviceId?: string;
  deviceName?: string;
  latitude?: number;
  longitude?: number;
  topics?: string;
  locationName?: string;
}

interface EmailMessage {
  id: string;
  from: string;
  subject: string;
  text: string;
  receivedAt: string;
  metadata?: EmailMetadata;
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
    queryFn: async () => {
      // If selectedEmail is set, filter by that sender, otherwise get ALL messages
      const url = selectedEmail
        ? `/api/agentmail/messages?from=${encodeURIComponent(selectedEmail)}`
        : '/api/agentmail/messages';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
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
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold" data-testid="text-active-conversation">
            {selectedEmail || 'All Messages'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          ) : (
            messages.map((message) => (
                <Card key={message.id} data-testid={`message-${message.id}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold">{message.from}</div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.receivedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">{message.subject}</div>
                    <p className="text-sm whitespace-pre-wrap mb-3">{message.text}</p>
                    
                    {message.metadata && Object.keys(message.metadata).length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">Device Info:</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {message.metadata.deviceName && (
                            <div>
                              <span className="text-muted-foreground">Device:</span>{" "}
                              <span className="font-medium">{message.metadata.deviceName}</span>
                            </div>
                          )}
                          {message.metadata.deviceId && (
                            <div>
                              <span className="text-muted-foreground">ID:</span>{" "}
                              <span className="font-medium">{message.metadata.deviceId}</span>
                            </div>
                          )}
                          {message.metadata.userId && (
                            <div>
                              <span className="text-muted-foreground">User:</span>{" "}
                              <span className="font-medium">{message.metadata.userId}</span>
                            </div>
                          )}
                          {message.metadata.locationName && (
                            <div>
                              <span className="text-muted-foreground">Location:</span>{" "}
                              <span className="font-medium">{message.metadata.locationName}</span>
                            </div>
                          )}
                          {message.metadata.latitude && message.metadata.longitude && (
                            <div>
                              <span className="text-muted-foreground">Coords:</span>{" "}
                              <span className="font-medium">
                                {message.metadata.latitude.toFixed(4)}, {message.metadata.longitude.toFixed(4)}
                              </span>
                            </div>
                          )}
                          {message.metadata.topics && (
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Topics:</span>{" "}
                              <span className="font-medium">{message.metadata.topics}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {selectedEmail && (
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
          )}
      </div>
    </div>
  );
}
