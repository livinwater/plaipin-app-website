import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";

const nearbyCompanions = [
  { id: 1, name: "Luna", distance: "0.2 mi", mood: "Playful", color: "bg-purple-400" },
  { id: 2, name: "Max", distance: "0.5 mi", mood: "Happy", color: "bg-blue-400" },
  { id: 3, name: "Stella", distance: "0.8 mi", mood: "Excited", color: "bg-pink-400" },
  { id: 4, name: "Oscar", distance: "1.2 mi", mood: "Calm", color: "bg-green-400" },
];

export default function Nearby() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Nearby Companions</h1>
        <p className="text-muted-foreground">Discover AI companions near you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nearbyCompanions.map((companion) => (
          <Card key={companion.id} className="hover-elevate" data-testid={`card-companion-${companion.id}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full ${companion.color} flex items-center justify-center`}>
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold" data-testid={`text-name-${companion.id}`}>{companion.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      <span data-testid={`text-distance-${companion.id}`}>{companion.distance}</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="rounded-full" data-testid={`badge-mood-${companion.id}`}>
                  {companion.mood}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" data-testid={`button-connect-${companion.id}`}>
                  Connect
                </Button>
                <Button variant="outline" data-testid={`button-view-${companion.id}`}>
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
