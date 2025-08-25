"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Heart, 
  ArrowLeft, 
  Truck, 
  Shield,
  Tag,
  Gift
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: number;
  category: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Bormasina cu percutie BOSCH Professional GSB 21-2 RCE, 1300W, 4000rpm",
      price: 899,
      originalPrice: 1099,
      image: "/file.svg",
      quantity: 1,
      inStock: 5,
      category: "Unelte electrice"
    },
    {
      id: "2", 
      name: "Set cheie tubulare 108 piese GEDORE, otel crom-vanadiu",
      price: 459,
      originalPrice: 549,
      image: "/file.svg",
      quantity: 2,
      inStock: 12,
      category: "Unelte manuale"
    },
    {
      id: "3",
      name: "Vopsea lavabila DULUX Diamond Matt, alba, 10L",
      price: 234,
      image: "/file.svg", 
      quantity: 3,
      inStock: 25,
      category: "Vopsele si lacuri"
    }
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.min(newQuantity, item.inStock) } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo("SAVE10");
      setPromoCode("");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + ((item.originalPrice || item.price) * item.quantity), 0);
  const savings = originalTotal - subtotal;
  const promoDiscount = appliedPromo ? subtotal * 0.1 : 0;
  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal - promoDiscount + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-2 sm:py-8">
        <div className="max-w-4xl mx-auto px-2 sm:px-4">
          <div className="text-center py-8 sm:py-16">
            <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">
              <span className="hidden xs:inline">Coșul tău este gol</span>
              <span className="xs:hidden">Coș gol</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-8 px-2">
              <span className="hidden xs:inline">Adaugă produse în coș pentru a continua cumpărăturile</span>
              <span className="xs:hidden">Adaugă produse pentru a cumpăra</span>
            </p>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 sm:size-lg text-sm sm:text-base">
              <Link href="/products">
                <span className="hidden xs:inline">Explorează produsele</span>
                <span className="xs:hidden">Produse</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-1 sm:gap-2 text-primary hover:text-primary/80 mb-2 sm:mb-4 transition-colors text-sm">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Continuă cumpărăturile</span>
            <span className="xs:hidden">Înapoi</span>
          </Link>
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <span className="hidden sm:inline">Coșul de cumpărături</span>
              <span className="sm:hidden">Coșul meu</span>
            </h1>
            <Badge variant="secondary" className="text-xs sm:text-sm w-fit">
              {cartItems.length} {cartItems.length === 1 ? 'produs' : 'produse'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col">
                    {/* Product Image - Mobile First */}
                    <div className="relative w-full h-32 xs:h-40 sm:h-48 bg-gray-100 sm:hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 sm:p-4"
                      />
                      {item.originalPrice && (
                        <Badge className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-xs">
                          -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>

                    {/* Desktop/Tablet Layout */}
                    <div className="hidden sm:flex sm:flex-row">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-48 h-48 bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-4"
                        />
                        {item.originalPrice && (
                          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">
                              <h3 className="font-semibold text-lg mb-1 line-clamp-2">{item.name}</h3>
                            </Link>
                            <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                            <p className="text-sm text-green-600">✓ În stoc: {item.inStock} bucăți</p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                              <Heart className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-500 hover:text-red-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Price and Quantity */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                          <div className="flex flex-col">
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {item.originalPrice.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                              </span>
                            )}
                            <span className="text-xl font-bold text-primary">
                              {item.price.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                            </span>
                            <span className="text-xs text-gray-500">TVA inclus</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min={1}
                              max={item.inStock}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.inStock}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="sm:hidden p-3">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-2">
                          <Link href={`/products/${item.id}`} className="hover:text-primary transition-colors">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-2 leading-tight">{item.name}</h3>
                          </Link>
                          <p className="text-xs text-gray-600 mb-1">{item.category}</p>
                          <p className="text-xs text-green-600">✓ Stoc: {item.inStock}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500 p-1 h-6 w-6">
                            <Heart className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-gray-500 hover:text-red-500 p-1 h-6 w-6"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Price and Quantity Mobile */}
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex flex-col">
                          {item.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              {item.originalPrice.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                            </span>
                          )}
                          <span className="text-sm font-bold text-primary">
                            {item.price.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                          </span>
                        </div>

                        {/* Quantity Controls Mobile */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.inStock}
                            className="w-6 h-6 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-3 sm:space-y-6">
            {/* Promo Code */}
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <h3 className="font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Cod promotional</span>
                  <span className="xs:hidden">Cod</span>
                </h3>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 pt-0">
                <div className="flex gap-1 sm:gap-2">
                  <Input
                    placeholder="Cod"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 h-8 sm:h-10 text-xs sm:text-sm"
                  />
                  <Button onClick={applyPromoCode} variant="outline" className="h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm">
                    Aplică
                  </Button>
                </div>
                {appliedPromo && (
                  <div className="flex items-center gap-1 sm:gap-2 text-green-600 text-xs sm:text-sm">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Cod {appliedPromo}: -10%</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Sumar comandă</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} produse)</span>
                    <span>{subtotal.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Economii</span>
                      <span>-{savings.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}</span>
                    </div>
                  )}

                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Reducere cod promotional</span>
                      <span>-{promoDiscount.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      Transport
                    </span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "GRATUIT" : shipping.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-xs text-gray-500">
                      💡 Transport gratuit pentru comenzi peste 500 RON
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {total.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                  </span>
                </div>

                <div className="space-y-3 pt-4">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-semibold">
                    <Link href="/checkout">
                      Finalizează comanda
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Link href="/products" className="flex items-center gap-2">
                      Continuă cumpărăturile
                    </Link>
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="pt-4 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span>Plată securizată SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3 h-3 text-blue-500" />
                    <span>Livrare în 1-3 zile lucru</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
