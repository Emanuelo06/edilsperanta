import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Heart, Star, Truck } from "lucide-react";
import { Product } from "@/types/Product";

export default function ProductCard({ product }: { product: Product }) {
  const discountPrice = product.price * 1.15;
  const hasDiscount = true; // You can make this dynamic based on product data
  const rating = 4.8; // Mock rating, make dynamic

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Image container */}
        <Link href={`/products/${product.id}`} className="block relative">
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <Image
              src={product.images?.[0] || "/file.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 25vw"
              priority
            />
            
            {/* Discount badge */}
            {hasDiscount && (
              <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white font-semibold">
                -15%
              </Badge>
            )}
            
            {/* Rating */}
            <div className="absolute top-2 right-2 bg-white/95 rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{rating}</span>
            </div>

            {/* Quick actions on hover */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0 shadow-lg">
                <Heart className="w-4 h-4" />
                <span className="sr-only">Adaugă la favorite</span>
              </Button>
            </div>
          </div>
        </Link>

        {/* Product info */}
        <div className="p-4">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Shipping info */}
          <div className="flex items-center gap-1 text-green-600 mb-2">
            <Truck className="w-3 h-3" />
            <span className="text-xs">Livrare gratuită</span>
          </div>

          {/* Price section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-xs text-gray-500 line-through">
                  {discountPrice.toLocaleString("ro-RO", {
                    style: "currency",
                    currency: "RON",
                    minimumFractionDigits: 0,
                  })}
                </span>
              )}
              <span className="text-lg font-bold text-primary">
                {product.price.toLocaleString("ro-RO", {
                  style: "currency",
                  currency: "RON",
                  minimumFractionDigits: 0,
                })}
              </span>
              <span className="text-xs text-gray-500">TVA inclus</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs font-medium border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Detalii
            </Button>
            <Button 
              size="sm" 
              className="flex-1 text-xs font-medium bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
            >
              <ShoppingCart className="w-3 h-3" />
              Adaugă în coș
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
