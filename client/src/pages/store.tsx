import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";

export default function Store() {
  const { toast } = useToast();

  const items = useQuery(api.items.getAll) ?? [];

  const companion = useQuery(api.companions.getDefault);
  const purchaseMutation = useMutation(api.inventory.addItem);

  const handlePurchase = async (itemId: Id<"items">) => {
    if (!companion) return;
    await purchaseMutation({ companionId: companion._id, itemId });
    toast({
      title: "Purchase successful!",
      description: "Item added to your inventory",
    });
  };

  if (items === undefined) {
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
          <Card key={item._id} className="hover-elevate" data-testid={`card-item-${item._id}`}>
            <CardHeader>
              <div className={`w-full h-40 rounded-lg ${item.color} mb-4`}></div>
              <div className="flex justify-between items-start gap-2">
                <CardTitle data-testid={`text-item-name-${item._id}`}>{item.name}</CardTitle>
                <Badge variant="secondary" className="rounded-full" data-testid={`badge-category-${item._id}`}>
                  {item.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary" data-testid={`text-item-price-${item._id}`}>
                {item.price} coins
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                data-testid={`button-buy-${item._id}`}
                onClick={() => handlePurchase(item._id)}
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
