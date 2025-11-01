import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const connections = [
  { id: 1, name: "Luna", relationship: "Best Friend", strength: 95, color: "bg-purple-400" },
  { id: 2, name: "Max", relationship: "Friend", strength: 78, color: "bg-blue-400" },
  { id: 3, name: "Stella", relationship: "Playmate", strength: 85, color: "bg-pink-400" },
  { id: 4, name: "Oscar", relationship: "Acquaintance", strength: 45, color: "bg-green-400" },
  { id: 5, name: "Ruby", relationship: "Friend", strength: 70, color: "bg-red-400" },
];

export default function SocialGraph() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Social Graph</h1>
        <p className="text-muted-foreground">Your companion's network of friends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {connections.map((connection) => (
          <Card key={connection.id} className="hover-elevate" data-testid={`card-connection-${connection.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-full ${connection.color} flex items-center justify-center text-2xl text-white font-bold`}>
                  {connection.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1" data-testid={`text-name-${connection.id}`}>
                    {connection.name}
                  </h3>
                  <Badge variant="secondary" className="rounded-full" data-testid={`badge-relationship-${connection.id}`}>
                    {connection.relationship}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Connection Strength</span>
                  <span className="font-semibold" data-testid={`text-strength-${connection.id}`}>{connection.strength}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${connection.strength}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-primary" data-testid="text-total-connections">5</div>
            <p className="text-lg font-medium">Total Connections</p>
            <p className="text-muted-foreground">Buddy has made 5 friends in the network</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
