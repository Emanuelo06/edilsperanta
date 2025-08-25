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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner - Dedeman/eMAG Style */}
      <section className="bg-primary text-white py-8 mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                EdilSperanța
              </h1>
              <p className="text-xl lg:text-2xl mb-6 opacity-90">
                Totul pentru casa și construcții, livrat rapid în toată România
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link href="/products" className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold text-lg transition-colors">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Vezi catalogul
                </Link>
                <Link href="/offers" className="inline-flex items-center justify-center h-11 px-8 rounded-md border border-white/20 bg-white/10 text-white hover:bg-white/20 font-semibold text-lg transition-colors">
                  Oferte speciale
                </Link>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Livrare gratuită</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Garanție extinsă</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 lg:h-96">
              <Image
                src="/window.svg"
                alt="Construction tools"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Categories Section - eMAG Style Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Categorii populare</h2>
            <Link href="/categories" className="inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-primary transition-colors">
              Vezi toate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      {cat.image ? (
                        <div className="relative w-16 h-16 mx-auto mb-4">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain group-hover:scale-110 transition-transform"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <span className="text-2xl text-gray-400">🏠</span>
                        </div>
                      )}
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        {cat.name}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Featured Products Section - Dedeman Style */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Produse recomandate</h2>
              <p className="text-gray-600 mt-2">Cele mai populare produse din această lună</p>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md text-primary transition-colors">
              Vezi toate <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <Link key={prod.id} href={`/products/${prod.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        {prod.images && prod.images[0] ? (
                          <Image
                            src={prod.images[0]}
                            alt={prod.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-6xl text-gray-400">🔧</span>
                          </div>
                        )}
                        {/* Discount badge */}
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                          -15%
                        </Badge>
                        {/* Rating */}
                        <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">4.8</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {prod.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 line-through">
                              {(prod.price * 1.15).toLocaleString("ro-RO", {
                                style: "currency",
                                currency: "RON"
                              })}
                            </span>
                            <span className="text-lg font-bold text-primary">
                              {prod.price.toLocaleString("ro-RO", {
                                style: "currency",
                                currency: "RON"
                              })}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            Adaugă
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Benefits Section - eMAG Style */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 my-12">
          <h2 className="text-2xl font-bold text-center mb-8">De ce să alegi EdilSperanța?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Livrare rapidă</h3>
              <p className="text-gray-600 text-sm">Livrare gratuită pentru comenzi peste 500 RON</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Garanție extinsă</h3>
              <p className="text-gray-600 text-sm">Garanție de până la 5 ani pentru toate produsele</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Support dedicat</h3>
              <p className="text-gray-600 text-sm">Echipă de specialiști disponibilă 24/7</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
