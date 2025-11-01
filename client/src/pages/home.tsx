import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import BuddyModel from "@/components/BuddyModel";
import { useState, useEffect } from "react";

const whimsicalThoughts = [
  "Thinking about coffee...",
  "Wonder if clouds taste like cotton candy?",
  "Should I learn to juggle?",
  "Maybe I'll write a poem today...",
  "Dreaming of adventures in space!",
  "I bet I could befriend a dragon...",
  "Planning my next masterpiece!",
  "Hmm... what if cookies could talk?",
  "Contemplating the mysteries of friendship...",
  "Feeling grateful for sunny days!",
];

export default function Home() {
  const [socialStatus, setSocialStatus] = useState<"open" | "dnd" | "invisible">("open");
  const [currentThought, setCurrentThought] = useState(whimsicalThoughts[0]);
  
  const companion = useQuery(api.companions.getDefault);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomThought = whimsicalThoughts[Math.floor(Math.random() * whimsicalThoughts.length)];
      setCurrentThought(randomThought);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (companion === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 bg-gradient-to-b from-[#E8E4F3] to-[#F5EFE7]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-full p-8 bg-gradient-to-b from-[#E8E4F3] to-[#F5EFE7]">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-64 h-64 flex items-center justify-center">
            <BuddyModel />
          </div>
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold" data-testid="text-companion-name">{companion.name}</h1>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-base" data-testid="badge-mood">
              {companion.mood}
            </Badge>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10" data-testid="card-thoughts">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl">💭</div>
              <div className="flex-1">
                <p className="text-lg italic text-muted-foreground transition-all duration-500">
                  {currentThought}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3" data-testid="activity-item-1">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Learned a new trick!</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="activity-item-2">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Made a new friend nearby</p>
                <p className="text-sm text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3" data-testid="activity-item-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <p className="font-medium">Completed daily challenges</p>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setSocialStatus("open")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover-elevate transition-colors ${
                socialStatus === "open" ? "bg-primary/10" : ""
              }`}
              data-testid="button-status-open"
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                socialStatus === "open" ? "border-primary" : "border-muted-foreground"
              }`}>
                {socialStatus === "open" && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className={socialStatus === "open" ? "font-medium" : ""}>Open to Connect</span>
            </button>
            
            <button
              onClick={() => setSocialStatus("dnd")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover-elevate transition-colors ${
                socialStatus === "dnd" ? "bg-primary/10" : ""
              }`}
              data-testid="button-status-dnd"
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                socialStatus === "dnd" ? "border-primary" : "border-muted-foreground"
              }`}>
                {socialStatus === "dnd" && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className={socialStatus === "dnd" ? "font-medium" : ""}>Do Not Disturb</span>
            </button>
            
            <button
              onClick={() => setSocialStatus("invisible")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg hover-elevate transition-colors ${
                socialStatus === "invisible" ? "bg-primary/10" : ""
              }`}
              data-testid="button-status-invisible"
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                socialStatus === "invisible" ? "border-primary" : "border-muted-foreground"
              }`}>
                {socialStatus === "invisible" && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className={socialStatus === "invisible" ? "font-medium" : ""}>Invisible Mode</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
