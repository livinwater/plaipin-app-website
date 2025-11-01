import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Search } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SearchMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  documents?: Array<{
    summary?: string;
    highlights?: Array<{
      text: string;
      score?: number;
    }>;
    score?: number;
    resource_id?: string;
  }>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<SearchMessage[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: "👋 Hi! I can help you search through your AgentMail encounters. Ask me questions like:\n\n• Who passed me recently?\n• Show encounters at coffee shops\n• Who's interested in hiking?\n• Where did I see device #742?",
    }
  ]);

  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      return apiRequest("POST", "/api/agentmail/search", {
        query: searchQuery,
        maxResults: 10,
      });
    },
    onSuccess: (data: any, searchQuery: string) => {
      console.log('🔍 Search response received:', data);
      console.log('📝 Answer:', data.answer);
      console.log('📄 Documents:', data.documents?.length || 0);

      // Add user message
      const userMessage: SearchMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: searchQuery,
      };

      // Add assistant response
      const assistantMessage: SearchMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: data.answer || "I couldn't find any relevant information.",
        documents: data.documents || [],
      };

      console.log('💬 Assistant message:', assistantMessage);

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setQuery("");
    },
    onError: (error) => {
      const errorMessage: SearchMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: "Sorry, I encountered an error searching your emails. Please make sure your Hyperspell API key is configured correctly.",
      };
      setMessages(prev => [...prev, errorMessage]);
    },
  });

  const handleSearch = () => {
    if (query.trim()) {
      searchMutation.mutate(query.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#E8E4F3] to-[#F5EFE7]">
      {/* Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm p-6">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-search-title">
              Search Encounters
            </h1>
            <p className="text-sm text-muted-foreground">
              Ask natural language questions about your AgentMail data
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card 
              className={`max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card'
              }`}
              data-testid={`message-${message.type}`}
            >
              <CardContent className="p-4">
                <div className="whitespace-pre-wrap">{message.content}</div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Loading indicator */}
        {searchMutation.isPending && (
          <div className="flex justify-start">
            <Card className="max-w-[80%] bg-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">🤔</div>
                  <span className="text-muted-foreground">Searching through your encounters...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="border-t border-border bg-background/80 backdrop-blur-sm p-6">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input 
            placeholder="Ask me anything... e.g., 'Who passed me at coffee shops?'" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={searchMutation.isPending}
            className="flex-1"
            data-testid="input-search-query"
          />
          <Button 
            onClick={handleSearch}
            disabled={searchMutation.isPending || !query.trim()}
            data-testid="button-send-query"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground text-center max-w-4xl mx-auto">
          Powered by Hyperspell semantic search • {messages.length - 1} {messages.length - 1 === 1 ? 'query' : 'queries'} asked
        </div>
      </div>
    </div>
  );
}
