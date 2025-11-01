import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { InventoryItem, Item } from "@shared/schema";

type InventoryItemWithItem = InventoryItem & { item: Item };

export default function Inventory() {
  const { data: inventory = [], isLoading } = useQuery<InventoryItemWithItem[]>({
    queryKey: ["/api/inventory"],
  });

  const equipMutation = useMutation({
    mutationFn: async ({ id, equipped }: { id: string; equipped: boolean }) => {
      return apiRequest("PATCH", `/api/inventory/${id}/equip`, { equipped });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl">
        <div className="text-muted-foreground">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Inventory</h1>
        <p className="text-muted-foreground">Manage your companion's items</p>
      </div>

      {inventory.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No items in inventory. Visit the store to purchase items!
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((invItem) => (
            <Card key={invItem.id} className="hover-elevate" data-testid={`card-item-${invItem.id}`}>
              <CardHeader>
                <div className={`w-full h-32 rounded-lg ${invItem.item.color} mb-4`}></div>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle data-testid={`text-item-name-${invItem.id}`}>{invItem.item.name}</CardTitle>
                  {invItem.equipped === 1 && (
                    <Badge variant="default" className="rounded-full" data-testid={`badge-equipped-${invItem.id}`}>
                      Equipped
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-semibold" data-testid={`text-quantity-${invItem.id}`}>{invItem.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <span className="font-semibold" data-testid={`text-category-${invItem.id}`}>{invItem.item.category}</span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant={invItem.equipped === 1 ? "outline" : "default"} 
                    className="flex-1" 
                    data-testid={`button-equip-${invItem.id}`}
                    onClick={() => equipMutation.mutate({ id: invItem.id, equipped: invItem.equipped === 0 })}
                    disabled={equipMutation.isPending}
                  >
                    {invItem.equipped === 1 ? "Unequip" : "Equip"}
                  </Button>
                  {invItem.item.category === "Consumables" && (
                    <Button variant="secondary" data-testid={`button-use-${invItem.id}`}>
                      Use
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
