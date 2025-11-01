import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Companion } from "@shared/schema";
import BuddyModel from "@/components/BuddyModel";
import { useState } from "react";

export default function Home() {
  const [socialStatus, setSocialStatus] = useState<"open" | "dnd" | "invisible">("open");
  
  const { data: companion, isLoading } = useQuery<Companion>({
    queryKey: ["/api/companion"],
  });

  if (isLoading || !companion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-full p-8">
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

        <div className="grid grid-cols-3 gap-4">
          <Card data-testid="card-stat-energy">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Energy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companion.energy}%</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-stat-happiness">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Happiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companion.happiness}%</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-stat-level">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companion.level}</div>
            </CardContent>
          </Card>
        </div>

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
