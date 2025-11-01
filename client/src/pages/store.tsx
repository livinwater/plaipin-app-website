import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

const storeItems = [
  { id: 1, name: "Rainbow Ball", price: 150, category: "Toys", color: "bg-gradient-to-br from-red-400 to-purple-400" },
  { id: 2, name: "Cozy Bed", price: 300, category: "Furniture", color: "bg-gradient-to-br from-blue-400 to-cyan-400" },
  { id: 3, name: "Party Hat", price: 100, category: "Accessories", color: "bg-gradient-to-br from-yellow-400 to-orange-400" },
  { id: 4, name: "Training Guide", price: 200, category: "Books", color: "bg-gradient-to-br from-green-400 to-emerald-400" },
  { id: 5, name: "Friendship Bracelet", price: 120, category: "Accessories", color: "bg-gradient-to-br from-pink-400 to-rose-400" },
  { id: 6, name: "Energy Drink", price: 80, category: "Consumables", color: "bg-gradient-to-br from-purple-400 to-indigo-400" },
];

export default function Store() {
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
        {storeItems.map((item) => (
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
              <Button className="w-full" data-testid={`button-buy-${item.id}`}>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
