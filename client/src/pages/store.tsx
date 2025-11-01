import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Item } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Store() {
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/store/items"],
  });

  const purchaseMutation = useMutation({
    mutationFn: async (itemId: string) => {
      return apiRequest("POST", "/api/inventory/purchase", { itemId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "Purchase successful!",
        description: "Item added to your inventory",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl">
        <div className="text-muted-foreground">Loading store...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">Store</h1>
          <p className="text-muted-foreground">Get items for your companion</p>
        </div>
        <Button variant="outline" data-testid="button-cart">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="hover-elevate" data-testid={`card-item-${item.id}`}>
            <CardHeader>
              <div className={`w-full h-40 rounded-lg ${item.color} mb-4`}></div>
              <div className="flex justify-between items-start gap-2">
                <CardTitle data-testid={`text-item-name-${item.id}`}>{item.name}</CardTitle>
                <Badge variant="secondary" className="rounded-full" data-testid={`badge-category-${item.id}`}>
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary" data-testid={`text-item-price-${item.id}`}>
                {item.price} coins
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                data-testid={`button-buy-${item.id}`}
                onClick={() => purchaseMutation.mutate(item.id)}
                disabled={purchaseMutation.isPending}
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
