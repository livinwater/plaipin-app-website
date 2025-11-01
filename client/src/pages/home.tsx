import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, TrendingUp } from "lucide-react";
import buddyImage from "@assets/generated_images/Pink_bunny_AI_companion_e8d83ce8.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-full p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-8">
            <img 
              src={buddyImage} 
              alt="Buddy - Your AI Companion" 
              className="w-full h-full object-contain"
              data-testid="img-buddy"
            />
          </div>
          
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold" data-testid="text-companion-name">Buddy</h1>
            <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-base" data-testid="badge-mood">
              Happy
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card data-testid="card-stat-energy">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Energy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-stat-happiness">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Happiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-stat-level">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6" data-testid="button-feed">
            <Heart className="w-6 h-6 text-primary" />
            <span>Feed</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6" data-testid="button-play">
            <Sparkles className="w-6 h-6 text-primary" />
            <span>Play</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-6" data-testid="button-train">
            <TrendingUp className="w-6 h-6 text-primary" />
            <span>Train</span>
          </Button>
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
      </div>
    </div>
  );
}
