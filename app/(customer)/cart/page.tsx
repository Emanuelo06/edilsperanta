"use client";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RootState, AppDispatch } from "@/redux/store";
import { updateQuantity, removeFromCart } from "@/redux/slices/cartSlice";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft, 
  Truck, 
  Shield,
  CheckCircle
} from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  const handleQuantityUpdate = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItem(id);
    try {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const subtotal = total;
  const shipping = subtotal > 200 ? 0 : 25;
  const finalTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Coșul tău este gol</h1>
            <p className="text-gray-600 mb-8">
              Adaugă produse în coș pentru a continua cumpărăturile.
            </p>
            <Link href="/products">
              <Button size="lg">
                Descoperă produsele
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuă cumpărăturile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Coșul de cumpărături</h1>
          <p className="text-gray-600 mt-2">{items.length} {items.length === 1 ? 'produs' : 'produse'} în coș</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-medium text-gray-900 truncate">
                            {item.name}
                          </h3>
                          <div className="mt-1 flex items-center space-x-2">
                            <span className="text-2xl font-bold text-blue-600">
                              {item.price.toLocaleString('ro-RO')} Lei
                            </span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            disabled={updatingItem === item.id || item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <div className="w-16 text-center">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value) || 1;
                                if (newQuantity !== item.quantity) {
                                  handleQuantityUpdate(item.id, newQuantity);
                                }
                              }}
                              className="text-center"
                              min="1"
                              disabled={updatingItem === item.id}
                            />
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            disabled={updatingItem === item.id}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {(item.price * item.quantity).toLocaleString('ro-RO')} Lei
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 text-sm mt-1 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Elimină
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Sumar comandă</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cost Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.length} {items.length === 1 ? 'produs' : 'produse'})</span>
                    <span className="font-medium">{subtotal.toLocaleString('ro-RO')} Lei</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Livrare</span>
                    <span className="font-medium">
                      {shipping > 0 ? `${shipping.toLocaleString('ro-RO')} Lei` : (
                        <span className="text-green-600 font-semibold">Gratuit</span>
                      )}
                    </span>
                  </div>

                  {shipping === 0 && (
                    <div className="flex items-center text-xs text-green-600 bg-green-50 p-2 rounded">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Livrare gratuită pentru comenzi peste 200 Lei
                    </div>
                  )}

                  {shipping > 0 && subtotal > 150 && (
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      Adaugă încă {(200 - subtotal).toLocaleString('ro-RO')} Lei pentru livrare gratuită
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{finalTotal.toLocaleString('ro-RO')} Lei</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Finalizează comanda
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Continuă cumpărăturile
                  </Button>
                </Link>

                {/* Features */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="h-4 w-4 mr-3 text-blue-600" />
                    Livrare în 2-5 zile lucrătoare
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-3 text-green-600" />
                    Plată securizată
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 mr-3 text-orange-600" />
                    Retur gratuit în 30 de zile
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">S-ar putea să îți placă</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Placeholder for recommended products - would integrate with backend */}
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Produs recomandat {i}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    Produs recomandat {i}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Descriere produs</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">199 Lei</span>
                    <Button size="sm">Adaugă în coș</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
