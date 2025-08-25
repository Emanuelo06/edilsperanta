import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/Product";

export default function CartItem({ product, quantity }: { product: Product; quantity: number }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <div className="relative w-20 h-20 bg-gray-100 rounded">
        <Image
          src={product.images?.[0] || "/file.svg"}
          alt={product.name}
          fill
          className="object-contain"
          sizes="80px"
        />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-base mb-1">{product.name}</div>
        <div className="text-primary font-bold">{product.price.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">-</Button>
        <span className="w-8 text-center">{quantity}</span>
        <Button variant="outline">+</Button>
      </div>
    </div>
  );
}
