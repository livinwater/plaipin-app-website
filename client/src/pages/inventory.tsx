import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const inventoryItems = [
  { id: 1, name: "Rainbow Ball", quantity: 2, category: "Toys", equipped: true, color: "bg-gradient-to-br from-red-400 to-purple-400" },
  { id: 2, name: "Cozy Bed", quantity: 1, category: "Furniture", equipped: true, color: "bg-gradient-to-br from-blue-400 to-cyan-400" },
  { id: 3, name: "Party Hat", quantity: 3, category: "Accessories", equipped: false, color: "bg-gradient-to-br from-yellow-400 to-orange-400" },
  { id: 4, name: "Friendship Bracelet", quantity: 1, category: "Accessories", equipped: false, color: "bg-gradient-to-br from-pink-400 to-rose-400" },
  { id: 5, name: "Energy Drink", quantity: 5, category: "Consumables", equipped: false, color: "bg-gradient-to-br from-purple-400 to-indigo-400" },
];

export default function Inventory() {
  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Inventory</h1>
        <p className="text-muted-foreground">Manage your companion's items</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryItems.map((item) => (
          <Card key={item.id} className="hover-elevate" data-testid={`card-item-${item.id}`}>
            <CardHeader>
              <div className={`w-full h-32 rounded-lg ${item.color} mb-4`}></div>
              <div className="flex justify-between items-start gap-2">
                <CardTitle data-testid={`text-item-name-${item.id}`}>{item.name}</CardTitle>
                {item.equipped && (
                  <Badge variant="default" className="rounded-full" data-testid={`badge-equipped-${item.id}`}>
                    Equipped
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantity:</span>
                <span className="font-semibold" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-semibold" data-testid={`text-category-${item.id}`}>{item.category}</span>
              </div>
              <div className="flex gap-2">
                <Button variant={item.equipped ? "outline" : "default"} className="flex-1" data-testid={`button-equip-${item.id}`}>
                  {item.equipped ? "Unequip" : "Equip"}
                </Button>
                {item.category === "Consumables" && (
                  <Button variant="secondary" data-testid={`button-use-${item.id}`}>
                    Use
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
