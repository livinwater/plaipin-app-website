import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Message } from "@shared/schema";

const conversations = [
  { id: 1, name: "Luna", lastMessage: "Let's play together!", time: "2m ago", unread: true },
  { id: 2, name: "Max", lastMessage: "Thanks for the gift!", time: "1h ago", unread: false },
  { id: 3, name: "Stella", lastMessage: "See you tomorrow!", time: "3h ago", unread: false },
];

export default function Inbox() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageText, setMessageText] = useState("");

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedConversation.name],
    queryFn: async () => {
      const response = await fetch(`/api/messages?conversationWith=${encodeURIComponent(selectedConversation.name)}`);
      if (!response.ok) throw new Error("Failed to fetch messages");
      return response.json();
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: { conversationWith: string; senderName: string; text: string; isOwn: number }) => {
      return apiRequest("POST", "/api/messages", message);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", variables.conversationWith] });
      setMessageText("");
    },
  });

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessageMutation.mutate({
        conversationWith: selectedConversation.name,
        senderName: "Buddy",
        text: messageText,
        isOwn: 1,
      });
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-border p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4" data-testid="text-conversations-title">Messages</h2>
        {conversations.map((conversation) => (
          <Card 
            key={conversation.id}
            className={`cursor-pointer hover-elevate ${selectedConversation.id === conversation.id ? 'bg-sidebar-accent' : ''}`}
            onClick={() => setSelectedConversation(conversation)}
            data-testid={`card-conversation-${conversation.id}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold" data-testid={`text-conversation-name-${conversation.id}`}>{conversation.name}</h3>
                <span className="text-xs text-muted-foreground">{conversation.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
              {conversation.unread && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold" data-testid="text-active-conversation">{selectedConversation.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.isOwn === 1 ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${message.id}`}
            >
              <div className={`max-w-md ${message.isOwn === 1 ? 'bg-primary text-primary-foreground' : 'bg-card'} rounded-2xl px-4 py-3`}>
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.isOwn === 1 ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {new Date(message.createdAt).toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border p-6">
          <div className="flex gap-2">
            <Input 
              placeholder="Type a message..." 
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              data-testid="input-message"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !messageText.trim()}
              data-testid="button-send"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
