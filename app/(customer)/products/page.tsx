"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { fetchProducts, searchProducts } from "@/redux/slices/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart,
  SlidersHorizontal,
  X,
  ChevronDown,
  Package
} from "lucide-react";
import { Product } from "@/services/productService";

interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "name" | "price-asc" | "price-desc" | "rating" | "newest";
}

export default function ProductCatalogPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, isLoading, error } = useSelector((state: RootState) => state.products);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    minPrice: 0,
    maxPrice: 10000,
    sortBy: "newest"
  });

  // Load products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchProducts(searchTerm));
      } else {
        dispatch(fetchProducts());
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, dispatch]);

  // Apply filters locally
  useEffect(() => {
    let filtered = [...products];

    // Filter only active products
    filtered = filtered.filter(product => product.status === 'active' && product.stock > 0);

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.minPrice && product.price <= filters.maxPrice
    );

    // Sort
    switch (filters.sortBy) {
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        // Already sorted by creation date from backend
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const categories = ["Electronice", "Telefoane", "Audio", "Accesorii", "Casa", "Gradina"];

  const handleAddToCart = (product: Product) => {
    if (!product.id) return;
    
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images?.[0] || '/file.svg',
      quantity: 1
    }));
  };

  const handleProductClick = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Produse</h1>
            <p className="mt-2 text-sm text-gray-600">
              Descoperă gama noastră completă de produse
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Caută produse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12 px-6"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filtre
              {showFilters ? <X className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorie
                  </label>
                  <Select value={filters.category} onValueChange={(value) => 
                    setFilters(prev => ({ ...prev, category: value === "all" ? "" : value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="Toate categoriile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toate categoriile</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț minim
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preț maxim
                  </label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sortează după
                  </label>
                  <Select value={filters.sortBy} onValueChange={(value: FilterState['sortBy']) => 
                    setFilters(prev => ({ ...prev, sortBy: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Cele mai noi</SelectItem>
                      <SelectItem value="name">Nume A-Z</SelectItem>
                      <SelectItem value="price-asc">Preț crescător</SelectItem>
                      <SelectItem value="price-desc">Preț descrescător</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            {isLoading ? "Se încarcă..." : `${filteredProducts.length} produse găsite`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eroare la încărcarea produselor</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => dispatch(fetchProducts())}>
              Încearcă din nou
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <>
            {filteredProducts.length > 0 ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <CardContent className="p-0">
                      {viewMode === "grid" ? (
                        <div onClick={() => product.id && handleProductClick(product.id)}>
                          {/* Product Image */}
                          <div className="relative h-64 bg-gray-100 rounded-t-lg overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Package className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Wishlist Button */}
                            <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Heart className="h-4 w-4 text-gray-600" />
                            </button>

                            {/* Stock Badge */}
                            {product.stock < 10 && (
                              <Badge className="absolute top-3 left-3 bg-orange-100 text-orange-800">
                                Ultimele {product.stock}
                              </Badge>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="p-6">
                            <div className="mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {product.name}
                            </h3>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < Math.floor(product.rating) 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`} 
                                  />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">
                                  ({product.rating})
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold text-gray-900">
                                  {product.price.toLocaleString('ro-RO')} Lei
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <div className="px-6 pb-6">
                            <Button 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product);
                              }}
                              disabled={product.stock === 0}
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {product.stock === 0 ? 'Stoc epuizat' : 'Adaugă în coș'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // List View
                        <div 
                          className="flex p-6"
                          onClick={() => product.id && handleProductClick(product.id)}
                        >
                          <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden mr-6">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <Badge variant="secondary" className="text-xs mb-2">
                                  {product.category}
                                </Badge>
                                
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  {product.name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {product.description}
                                </p>

                                <div className="flex items-center mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${
                                        i < Math.floor(product.rating) 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                  <span className="ml-2 text-sm text-gray-600">
                                    ({product.rating})
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 mb-4">
                                  {product.price.toLocaleString('ro-RO')} Lei
                                </div>

                                <Button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                  }}
                                  disabled={product.stock === 0}
                                >
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  {product.stock === 0 ? 'Stoc epuizat' : 'Adaugă în coș'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nu am găsit produse
                </h3>
                <p className="text-gray-600 mb-4">
                  Încearcă să modifici filtrele sau termenii de căutare.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      category: "",
                      minPrice: 0,
                      maxPrice: 10000,
                      sortBy: "newest"
                    });
                  }}
                >
                  Resetează filtrele
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
