import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, TrendingUp } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Companion } from "@shared/schema";
import buddyImage from "@assets/generated_images/Pink_bunny_AI_companion_e8d83ce8.png";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { toast } = useToast();

  const { data: companion, isLoading } = useQuery<Companion>({
    queryKey: ["/api/companion"],
  });

  const interactMutation = useMutation({
    mutationFn: async (action: string) => {
      return apiRequest("POST", "/api/companion/interact", { action });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
    },
  });

  const handleInteraction = (action: string, label: string) => {
    interactMutation.mutate(action);
    toast({
      title: `${label}!`,
      description: `You just interacted with ${companion?.name || 'Buddy'}`,
    });
  };

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
          <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-8">
            <img 
              src={buddyImage} 
              alt="Buddy - Your AI Companion" 
              className="w-full h-full object-contain"
              data-testid="img-buddy"
            />
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

        <div className="grid grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-6" 
            data-testid="button-feed"
            onClick={() => handleInteraction("feed", "Fed")}
            disabled={interactMutation.isPending}
          >
            <Heart className="w-6 h-6 text-primary" />
            <span>Feed</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-6" 
            data-testid="button-play"
            onClick={() => handleInteraction("play", "Played")}
            disabled={interactMutation.isPending}
          >
            <Sparkles className="w-6 h-6 text-primary" />
            <span>Play</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-6" 
            data-testid="button-train"
            onClick={() => handleInteraction("train", "Trained")}
            disabled={interactMutation.isPending}
          >
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
