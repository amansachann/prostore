"use client";
import { Cart, CartItem } from "@/types";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";

function AddToCart({ item, cart }: { item: CartItem; cart?: Cart }) {
  const router = useRouter();
  const { toast } = useToast();
  const handleAddToCart = async () => {
    const res = await addItemToCart(item);

    if (!res.success) {
      toast({
        variant: "destructive",
        description: res.message,
      });
      return;
    }
    // Handle success add to cart
    toast({
      description: res.message,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="Go to Cart"
          onClick={() => router.push("/cart")}
        >
          Go to Cart
        </ToastAction>
      ),
    });
  };

  // Handle remove from cart
  async function handleRemoveFromCart() {
    const res = await removeItemFromCart(item.productId);
    toast({
      variant: res.success ? "default" : "destructive",
      description: res.message,
    });
    return;
  }

  // Check if item is in cart
  const existItem =
    cart && cart.items.find((x) => (x.productId = item.productId));
  return existItem ? (
    <>
      <div>
        <Button
          type="button"
          variant={"outline"}
          onClick={handleRemoveFromCart}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="px-2">{existItem.qty}</span>
        <Button type="button" variant={"outline"} onClick={handleAddToCart}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </>
  ) : (
    <>
      <Button className="w-full" type="button" onClick={handleAddToCart}>
        <Plus /> Add to Cart
      </Button>
    </>
  );
}

export default AddToCart;
