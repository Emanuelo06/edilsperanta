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
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-white to-blue-50 border-l-4 border-l-blue-500">
      <CardContent className="p-0">
        {/* Image container */}
        <Link href={`/products/${product.id}`} className="block relative">
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
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
              <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg">
                -15%
              </Badge>
            )}
            
            {/* Rating */}
            <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-white text-white" />
              <span className="text-xs font-bold">{rating}</span>
            </div>

            {/* Quick actions on hover */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button size="sm" className="rounded-full w-10 h-10 p-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0">
                <Heart className="w-4 h-4" />
                <span className="sr-only">Adaugă la favorite</span>
              </Button>
            </div>
          </div>
        </Link>

        {/* Product info */}
        <div className="p-4 bg-gradient-to-br from-white to-slate-50">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Shipping info */}
          <div className="flex items-center gap-1 text-white bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-2 py-1 mb-2 w-fit">
            <Truck className="w-3 h-3" />
            <span className="text-xs font-medium">Livrare gratuită</span>
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
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
              className="flex-1 text-xs font-medium border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
            >
              Detalii
            </Button>
            <Button 
              size="sm" 
              className="flex-1 text-xs font-medium bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white flex items-center gap-1 shadow-lg"
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
