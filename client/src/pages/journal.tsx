import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { JournalEntry } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Journal() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");

  const { data: entries = [], isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal"],
  });

  const createEntryMutation = useMutation({
    mutationFn: async (entry: { title: string; content: string; mood: string }) => {
      return apiRequest("POST", "/api/journal", entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      setIsDialogOpen(false);
      setTitle("");
      setContent("");
      setMood("");
      toast({
        title: "Entry created!",
        description: "Your journal entry has been saved",
      });
    },
  });

  const handleSubmit = () => {
    if (title && content && mood) {
      createEntryMutation.mutate({ title, content, mood });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl">
        <div className="text-muted-foreground">Loading journal...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Journal</h1>
          <p className="text-muted-foreground">Capture your memories with Buddy</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-entry">
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Journal Entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title..."
                  data-testid="input-entry-title"
                />
              </div>
              <div>
                <Label htmlFor="mood">Mood</Label>
                <Input 
                  id="mood" 
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="Happy, Excited, Calm..."
                  data-testid="input-entry-mood"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content" 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write about your day..."
                  rows={5}
                  data-testid="input-entry-content"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleSubmit}
                disabled={createEntryMutation.isPending || !title || !content || !mood}
                data-testid="button-save-entry"
              >
                Save Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {entries.map((entry) => (
          <Card key={entry.id} className="hover-elevate cursor-pointer" data-testid={`card-entry-${entry.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="mb-2" data-testid={`text-entry-title-${entry.id}`}>{entry.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <span className="text-2xl" data-testid={`text-entry-mood-${entry.id}`}>{entry.mood}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" data-testid={`text-entry-preview-${entry.id}`}>
                {entry.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
