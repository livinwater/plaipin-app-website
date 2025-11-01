import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const journalEntries = [
  {
    id: 1,
    date: "November 1, 2025",
    mood: "Happy",
    title: "A wonderful day at the park",
    preview: "Today Buddy and I went to the park. We met Luna and had so much fun playing together...",
  },
  {
    id: 2,
    date: "October 31, 2025",
    mood: "Excited",
    title: "Halloween adventures",
    preview: "What a fun Halloween! Buddy dressed up and we went trick-or-treating with friends...",
  },
  {
    id: 3,
    date: "October 30, 2025",
    mood: "Calm",
    title: "Quiet evening at home",
    preview: "A peaceful day spent at home. Buddy learned a new trick and we practiced together...",
  },
];

export default function Journal() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Journal</h1>
          <p className="text-muted-foreground">Capture your memories with Buddy</p>
        </div>
        <Button data-testid="button-new-entry">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      <div className="space-y-6">
        {journalEntries.map((entry) => (
          <Card key={entry.id} className="hover-elevate cursor-pointer" data-testid={`card-entry-${entry.id}`}>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <CardTitle className="mb-2" data-testid={`text-entry-title-${entry.id}`}>{entry.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{entry.date}</p>
                </div>
                <span className="text-2xl" data-testid={`text-entry-mood-${entry.id}`}>{entry.mood}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground" data-testid={`text-entry-preview-${entry.id}`}>
                {entry.preview}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
