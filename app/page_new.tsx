"use client";
import { useAuthListener } from "@/hooks/useAuthListener";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Truck, Shield, Phone } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export default function Home() {
  useAuthListener();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const catSnap = await getDocs(query(collection(db, "categories"), where("isActive", "==", true), limit(6)));
        const prodSnap = await getDocs(query(collection(db, "products"), where("featured", "==", true), limit(8)));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch {
        setError("Eroare la încărcare. Încearcă din nou.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
      <div className="text-center max-w-sm">
        <p className="text-red-600 text-sm mb-2">{error}</p>
        <Button onClick={() => window.location.reload()} size="sm" className="text-xs">
          Reîncarcă
        </Button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Banner - 250px First */}
      <section className="bg-primary text-white py-4 mb-4">
        <div className="mx-auto px-2">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold leading-tight">
              EdilSperanța
            </h1>
            <p className="text-xs opacity-90 leading-tight px-1">
              Casa și construcții
            </p>
            <div className="pt-2">
              <Link href="/products" className="inline-flex items-center justify-center h-8 px-4 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-xs transition-colors">
                <ArrowRight className="w-3 h-3 mr-1" />
                Catalog
              </Link>
            </div>
            {/* Trust indicators - Ultra compact */}
            <div className="flex justify-center gap-3 text-xs pt-2 opacity-90">
              <div className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span className="text-xs">Livrare</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span className="text-xs">Garanție</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto px-2 space-y-4">
        {/* Categories Section - 250px optimized */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Categorii</h2>
            <Link href="/categories" className="inline-flex items-center gap-1 text-primary text-xs">
              Vezi <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {categories.slice(0, 4).map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-20">
                  <CardContent className="p-2 text-center h-full flex flex-col justify-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-full mx-auto mb-1 flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary/20 rounded"></div>
                    </div>
                    <p className="text-xs font-medium truncate px-1">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {categories.length === 0 && Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-20">
                <CardContent className="p-2 text-center h-full flex flex-col justify-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-1"></div>
                  <p className="text-xs text-gray-500">Categorie</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Products - 250px optimized */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold">Produse populare</h2>
            <Link href="/products" className="inline-flex items-center gap-1 text-primary text-xs">
              Vezi <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {products.slice(0, 3).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-2">
                    <div className="flex gap-2">
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold line-clamp-2 leading-tight mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-xs text-gray-500">(127)</span>
                        </div>
                        <p className="text-sm font-bold text-primary">
                          {product.price.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {products.length === 0 && Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-2">
                  <div className="flex gap-2">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-2 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section - 250px optimized */}
        <section className="py-4">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-3">
              <h3 className="text-sm font-bold mb-2">De ce EdilSperanța?</h3>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Truck className="w-3 h-3 text-primary" />
                  </div>
                  <span>Livrare gratuită peste 500 RON</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-primary" />
                  </div>
                  <span>Garanție extinsă pe toate produsele</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-3 h-3 text-primary" />
                  </div>
                  <span>Support tehnic specializat 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
