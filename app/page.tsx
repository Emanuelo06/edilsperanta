"use client";
import { useAuthListener } from "@/hooks/useAuthListener";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Truck, Shield, Phone, Package, Plus, Hammer, Wrench, Zap, HomeIcon, Paintbrush, Drill } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image?: string;
  icon: string;
  color: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export default function Home() {
  useAuthListener();
  const [loading] = useState(false);

  // Sample data to make the page work immediately with enhanced categories
  const sampleCategories: Category[] = [
    { id: "1", name: "Materiale Construcții", icon: "Hammer", color: "bg-orange-500", image: "/placeholder.jpg" },
    { id: "2", name: "Unelte Electrice", icon: "Drill", color: "bg-blue-500", image: "/placeholder.jpg" },
    { id: "3", name: "Grădină & Exterior", icon: "Wrench", color: "bg-green-500", image: "/placeholder.jpg" },
    { id: "4", name: "Instalații", icon: "Zap", color: "bg-yellow-500", image: "/placeholder.jpg" },
    { id: "5", name: "Decorațiuni", icon: "Paintbrush", color: "bg-purple-500", image: "/placeholder.jpg" },
    { id: "6", name: "Mobilier", icon: "HomeIcon", color: "bg-red-500", image: "/placeholder.jpg" }
  ];

  const sampleProducts: Product[] = [
    { id: "1", name: "Bormasină BOSCH GSB 21-2 RCE Professional", price: 849, images: ["/placeholder.jpg"] },
    { id: "2", name: "Set chei tubulare GEDORE 19-piece", price: 299, images: ["/placeholder.jpg"] },
    { id: "3", name: "Fierăstrău circular MAKITA HS7601", price: 1299, images: ["/placeholder.jpg"] },
    { id: "4", name: "Ciocan demolator HILTI TE 60-ATC", price: 2199, images: ["/placeholder.jpg"] },
    { id: "5", name: "Șurubelnița impact MILWAUKEE M18", price: 599, images: ["/placeholder.jpg"] },
    { id: "6", name: "Polizor unghiular DEWALT DWE4157", price: 429, images: ["/placeholder.jpg"] }
  ];

  const [categories] = useState<Category[]>(sampleCategories);
  const [products] = useState<Product[]>(sampleProducts);

  // Function to render category icons
  const getCategoryIcon = (iconName: string, className: string) => {
    const icons = {
      Hammer: <Hammer className={className} />,
      Drill: <Drill className={className} />,
      Wrench: <Wrench className={className} />,
      Zap: <Zap className={className} />,
      Paintbrush: <Paintbrush className={className} />,
      HomeIcon: <HomeIcon className={className} />
    };
    return icons[iconName as keyof typeof icons] || <Package className={className} />;
  };

  // Optional: Keep Firebase loading for future when you have real data
  // useEffect(() => {
  //   async function fetchData() {
  //     setLoading(true);
  //     try {
  //       const catSnap = await getDocs(query(collection(db, "categories"), where("isActive", "==", true), limit(6)));
  //       const prodSnap = await getDocs(query(collection(db, "products"), where("featured", "==", true), limit(8)));
  //       if (catSnap.docs.length > 0) setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
  //       if (prodSnap.docs.length > 0) setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
  //     } catch (error) {
  //       console.log("Firebase data not available, using sample data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   fetchData();
  // }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Banner - Fully Responsive */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 sm:py-6 lg:py-12 mb-4 sm:mb-6 lg:mb-8 shadow-2xl">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="text-center space-y-2 sm:space-y-4 lg:space-y-6">
            <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold leading-tight bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent">
              EdilSperanța
            </h1>
            <p className="text-xs sm:text-sm lg:text-lg xl:text-xl opacity-95 leading-tight px-1 max-w-2xl mx-auto text-blue-50">
              <span className="hidden sm:inline">Casa și construcții - Totul pentru proiectele tale</span>
              <span className="sm:hidden">Casa și construcții</span>
            </p>
            <div className="pt-2 sm:pt-4">
              <Link href="/products" className="inline-flex items-center justify-center h-8 sm:h-10 lg:h-12 px-4 sm:px-6 lg:px-8 rounded-md bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-800 font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Vezi catalogul complet</span>
                <span className="sm:hidden">Catalog</span>
              </Link>
            </div>
            {/* Trust indicators - Responsive */}
            <div className="flex justify-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm lg:text-base pt-2 sm:pt-4 text-blue-100">
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition-colors">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-300" />
                <span>Livrare</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition-colors">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-300" />
                <span>Garanție</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 sm:gap-2 bg-white/20 px-2 py-1 rounded-lg hover:bg-white/30 transition-colors">
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-pink-300" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Categories Section - Enhanced Design */}
        <section className="bg-gradient-to-br from-white to-blue-50 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-blue-100">
          <div className="flex items-start justify-between mb-3 xs:mb-4 sm:mb-8 lg:mb-10">
            <div>
              <h2 className="text-sm xs:text-base sm:text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1 xs:mb-2">
                Categorii populare
              </h2>
              <p className="text-xs xs:text-sm sm:text-base lg:text-lg text-gray-600 hidden xs:block">
                Descoperă gama noastră completă de produse
              </p>
            </div>
            <Link href="/categories" className="inline-flex items-center gap-1 xs:gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-xs xs:text-sm sm:text-base lg:text-lg transition-all duration-300 font-bold px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md xs:rounded-lg shadow-lg transform hover:scale-105">
              <span className="hidden sm:inline">Vezi toate</span>
              <span className="sm:hidden">Vezi</span>
              <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 xs:gap-2 sm:gap-4 lg:gap-5 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 cursor-pointer h-20 xs:h-24 sm:h-32 lg:h-36 xl:h-40 group border border-gray-100 shadow-sm bg-white">
                  <CardContent className="p-1.5 xs:p-3 sm:p-5 lg:p-6 text-center h-full flex flex-col justify-center items-center relative overflow-hidden">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 ${category.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-200`}></div>
                    
                    {/* Icon container with better proportions for mobile */}
                    <div className={`w-6 h-6 xs:w-8 xs:h-8 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 ${category.color} rounded-lg xs:rounded-xl mx-auto mb-1 xs:mb-2 sm:mb-4 flex items-center justify-center group-hover:scale-105 transition-all duration-200 shadow-md relative z-10`}>
                      {getCategoryIcon(category.icon, "w-3 h-3 xs:w-4 xs:h-4 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-white")}
                    </div>
                    
                    {/* Category name optimized for 250px */}
                    <p className="text-xs xs:text-xs sm:text-base lg:text-lg xl:text-xl font-medium xs:font-semibold text-gray-800 group-hover:text-gray-900 transition-colors leading-tight text-center relative z-10 px-0.5">
                      <span className="block xs:hidden">
                        {category.name === "Materiale Construcții" ? "Materiale" : 
                         category.name === "Unelte Electrice" ? "Unelte" :
                         category.name === "Grădină & Exterior" ? "Grădină" :
                         category.name}
                      </span>
                      <span className="hidden xs:inline">
                        {category.name}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products - Fully Responsive */}
        <section className="bg-gradient-to-br from-white to-purple-50 p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg border border-purple-100">
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Produse populare</h2>
            <Link href="/products" className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs sm:text-sm lg:text-base transition-all duration-300 font-bold px-3 py-2 rounded-lg shadow-lg transform hover:scale-105">
              <span className="hidden sm:inline">Vezi toate</span>
              <span className="sm:hidden">Vezi</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {products.slice(0, 6).map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-2 sm:p-3 lg:p-4">
                    <div className="bg-gray-100 rounded-lg mb-2 sm:mb-3 aspect-square relative overflow-hidden group-hover:bg-gray-200 transition-colors">
                      <div className="absolute inset-2 sm:inset-3 lg:inset-4 bg-gray-300 rounded flex items-center justify-center">
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-xs sm:text-sm lg:text-base font-semibold mb-1 sm:mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-1 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs sm:text-sm text-gray-500">(127)</span>
                    </div>
                    <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1">
                      <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-primary">
                        {product.price.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}
                      </p>
                      <Button size="sm" className="w-full xs:w-auto text-xs sm:text-sm px-2 py-1 h-7 sm:h-8 lg:h-9">
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Adaugă</span>
                        <span className="sm:hidden">+</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Benefits Section - Fully Responsive */}
        <section className="py-2 sm:py-4 lg:py-6">
          <Card className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 shadow-xl">
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold mb-2 sm:mb-4 lg:mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">De ce EdilSperanța?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm lg:text-base">
                <div className="flex items-center gap-2 sm:gap-3 bg-white/50 p-2 rounded-lg hover:bg-white/70 transition-colors">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Livrare gratuită peste 500 RON</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/50 p-2 rounded-lg hover:bg-white/70 transition-colors">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Garanție extinsă pe toate produsele</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 bg-white/50 p-2 rounded-lg hover:bg-white/70 transition-colors">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-700">Support tehnic specializat 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Special Offers Section - Fully Responsive */}
        <section>
          <div className="flex items-center justify-between mb-3 sm:mb-4 lg:mb-6">
            <h2 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold">🔥 Oferte speciale</h2>
            <Link href="/offers" className="inline-flex items-center gap-1 sm:gap-2 text-red-600 text-xs sm:text-sm lg:text-base hover:text-red-700 transition-colors">
              <span className="hidden sm:inline">Vezi toate</span>
              <span className="sm:hidden">Vezi</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-3 sm:p-4 lg:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <span className="bg-red-500 text-white text-xs sm:text-sm px-2 py-0.5 sm:py-1 rounded font-bold">-25%</span>
                      <span className="text-xs sm:text-sm text-red-600 font-semibold">Ofertă limitată</span>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                      Bormasină BOSCH Professional
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">637 RON</span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">849 RON</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-100 rounded flex-shrink-0 group-hover:bg-gray-200 transition-colors"></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="p-3 sm:p-4 lg:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <span className="bg-blue-500 text-white text-xs sm:text-sm px-2 py-0.5 sm:py-1 rounded font-bold">-30%</span>
                      <span className="text-xs sm:text-sm text-blue-600 font-semibold">Weekend Deal</span>
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      Set scule MAKITA 18V
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">1.299 RON</span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through">1.856 RON</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gray-100 rounded flex-shrink-0 group-hover:bg-gray-200 transition-colors"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Brands Section - Fully Responsive */}
        <section>
          <h2 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6">Mărci de încredere</h2>
          <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
            {["BOSCH", "MAKITA", "DEWALT", "MILWAUKEE", "HIKOKI", "FESTOOL"].map((brand, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-2 sm:p-3 lg:p-4 text-center h-12 sm:h-14 lg:h-16 xl:h-20 flex items-center justify-center">
                  <span className="text-xs sm:text-sm lg:text-base font-bold text-gray-600 group-hover:text-primary transition-colors">
                    {brand}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Section - Fully Responsive */}
        <section className="py-4 sm:py-6 lg:py-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
            <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
              <h3 className="text-sm sm:text-lg lg:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 lg:mb-4">
                Rămâi la curent cu ofertele
              </h3>
              <p className="text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 lg:mb-6 opacity-90">
                Primește oferte exclusive și noutăți direct în inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Adresa ta de email"
                  className="flex-1 px-3 py-2 sm:py-3 lg:py-4 rounded text-gray-900 text-xs sm:text-sm lg:text-base placeholder-gray-500"
                />
                <Button className="bg-white text-primary hover:bg-gray-100 px-4 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base font-semibold">
                  Abonează-te
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
