"use client";

import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  TrendingUp,
  AlertCircle,
  Save,
  X,
  Image as ImageIcon
} from "lucide-react";
import { RootState, AppDispatch } from "@/redux/store";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  searchProducts,
  setFilters 
} from "@/redux/slices/productSlice";
import { Product } from "@/services/productService";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, isLoading, error, filters } = useSelector((state: RootState) => state.products);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Form states
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    sku: "",
    images: [],
    status: "active",
    rating: 0,
    sales: 0,
    tags: [],
    specifications: {}
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const categories = ["Electronice", "Telefoane", "Audio", "Accesorii", "Casa", "Gradina"];

  // Load products on mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchProducts(searchQuery));
      } else {
        dispatch(fetchProducts(filters));
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, dispatch, filters]);

  // Handle category filter
  useEffect(() => {
    const categoryFilter = selectedCategory === "all" ? undefined : selectedCategory;
    dispatch(setFilters({ ...filters, category: categoryFilter }));
    dispatch(fetchProducts({ ...filters, category: categoryFilter }));
  }, [selectedCategory, dispatch, filters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "inactive": return "bg-gray-100 text-gray-800 border-gray-200";
      case "out_of_stock": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "text-red-600", icon: AlertCircle };
    if (stock < 10) return { color: "text-yellow-600", icon: AlertCircle };
    return { color: "text-green-600", icon: Package };
  };

  // Handle View Product
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  // Handle Edit Product
  const handleEditProduct = (product: Product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      sku: product.sku,
      images: product.images,
      status: product.status,
      rating: product.rating,
      sales: product.sales,
      tags: product.tags,
      specifications: product.specifications || {}
    });
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  // Handle Create Product
  const handleCreateProduct = () => {
    setProductForm({
      name: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      sku: "",
      images: [],
      status: "active",
      rating: 0,
      sales: 0,
      tags: [],
      specifications: {}
    });
    setImageFiles([]);
    setCreateModalOpen(true);
  };

  // Handle Save (Create/Edit)
  const handleSave = async () => {
    try {
      setSubmitLoading(true);
      
      if (selectedProduct) {
        // Edit existing product
        await dispatch(updateProduct({
          id: selectedProduct.id!,
          updates: productForm,
          images: imageFiles.length > 0 ? imageFiles : undefined
        })).unwrap();
        setEditModalOpen(false);
      } else {
        // Create new product
        await dispatch(createProduct({
          product: productForm,
          images: imageFiles
        })).unwrap();
        setCreateModalOpen(false);
      }
      
      setSelectedProduct(null);
      setImageFiles([]);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (selectedProduct?.id) {
      try {
        await dispatch(deleteProduct(selectedProduct.id)).unwrap();
        setDeleteModalOpen(false);
        setSelectedProduct(null);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  return (
    <AdminLayout section="products">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestionare Produse
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {products.length} produse găsite
            </p>
          </div>
          
          <Button 
            onClick={handleCreateProduct}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Produs Nou
          </Button>
        </div>

        {/* Error Alert */}
        {/* Error Alert */}
        {error && (
          <div className="border border-red-200 bg-red-50 rounded-md p-4 flex items-center gap-3">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        {/* Search and Filters */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Caută produse..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrează categoria" />
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

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const stockInfo = getStockStatus(product.stock);
              const StockIcon = stockInfo.icon;
              
              return (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Product Image */}
                    <div className="relative mb-4">
                      {product.images && product.images.length > 0 ? (
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative">
                          <Image 
                            src={product.images[0]} 
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(product.status)}`}>
                        {product.status === 'active' ? 'Activ' : 
                         product.status === 'inactive' ? 'Inactiv' : 'Epuizat'}
                      </Badge>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3 mb-4">
                      <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">
                        {product.name}
                      </h3>
                      
                      <p className="text-xs text-gray-600">
                        SKU: {product.sku}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-blue-600">
                          {product.price.toLocaleString('ro-RO')} Lei
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <StockIcon className={`h-3 w-3 ${stockInfo.color}`} />
                          <span className={`text-xs font-medium ${stockInfo.color}`}>
                            Stoc: {product.stock}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs text-gray-600">{product.sales} vânzări</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewProduct(product)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Vezi
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProduct(product)}
                        className="flex-1"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Editează
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* View Product Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalii Produs</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-4">
              {/* Images */}
              {selectedProduct.images && selectedProduct.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.images.map((image, index) => (
                    <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image 
                        src={image} 
                        alt={`${selectedProduct.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nume produs</Label>
                  <p className="text-sm text-gray-900">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label>SKU</Label>
                  <p className="text-sm text-gray-900">{selectedProduct.sku}</p>
                </div>
                <div>
                  <Label>Categorie</Label>
                  <p className="text-sm text-gray-900">{selectedProduct.category}</p>
                </div>
                <div>
                  <Label>Preț</Label>
                  <p className="text-sm text-gray-900">{selectedProduct.price.toLocaleString('ro-RO')} Lei</p>
                </div>
                <div>
                  <Label>Stoc</Label>
                  <p className="text-sm text-gray-900">{selectedProduct.stock} bucăți</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedProduct.status)}>
                    {selectedProduct.status === 'active' ? 'Activ' : 
                     selectedProduct.status === 'inactive' ? 'Inactiv' : 'Epuizat'}
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label>Descriere</Label>
                <p className="text-sm text-gray-900 mt-1">{selectedProduct.description}</p>
              </div>
              
              {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProduct.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Product Modal */}
      <Dialog open={createModalOpen || editModalOpen} onOpenChange={(open) => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        if (!open) {
          setSelectedProduct(null);
          setImageFiles([]);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Editează Produs' : 'Adaugă Produs Nou'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nume produs *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nume produs"
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={productForm.sku}
                  onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder="SKU"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categorie *</Label>
                <Select 
                  value={productForm.category} 
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={productForm.status} 
                  onValueChange={(value: 'active' | 'inactive' | 'out_of_stock') => setProductForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activ</SelectItem>
                    <SelectItem value="inactive">Inactiv</SelectItem>
                    <SelectItem value="out_of_stock">Epuizat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preț (Lei) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stoc *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descriere</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrierea produsului"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (separate prin virgulă)</Label>
              <Input
                id="tags"
                value={productForm.tags.join(', ')}
                onChange={(e) => setProductForm(prev => ({ 
                  ...prev, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div>
              <Label htmlFor="images">Imagini</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-2 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700"
              />
              {imageFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {imageFiles.length} fișiere selectate
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCreateModalOpen(false);
                  setEditModalOpen(false);
                  setSelectedProduct(null);
                  setImageFiles([]);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Anulează
              </Button>
              <Button 
                onClick={handleSave}
                disabled={submitLoading || !productForm.name || !productForm.sku || !productForm.category}
              >
                <Save className="h-4 w-4 mr-2" />
                {submitLoading ? 'Se salvează...' : 'Salvează'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmă ștergerea</DialogTitle>
          </DialogHeader>
          
          <p className="text-sm text-gray-600">
            Ești sigur că dorești să ștergi produsul <strong>{selectedProduct?.name}</strong>? 
            Această acțiune nu poate fi anulată.
          </p>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedProduct(null);
              }}
            >
              Anulează
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Șterge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
