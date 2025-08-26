import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Edit, Trash2 } from "lucide-react";

interface AdminProduct {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string;
  image?: string;
}

const products: AdminProduct[] = [
  { 
    id: "1", 
    name: "Bormasină BOSCH GSB 21-2 RCE", 
    price: "849 RON", 
    stock: 12, 
    category: "Unelte Electrice",
    image: "/file.svg"
  },
  { 
    id: "2", 
    name: "Set chei GEDORE 19-piece", 
    price: "299 RON", 
    stock: 8, 
    category: "Materiale Construcții",
    image: "/file.svg"
  },
  { 
    id: "3", 
    name: "Fierăstrău MAKITA HS7601", 
    price: "1299 RON", 
    stock: 5, 
    category: "Unelte Electrice",
    image: "/file.svg"
  },
  { 
    id: "4", 
    name: "Ciocan demolator HILTI TE 60-ATC", 
    price: "2199 RON", 
    stock: 2, 
    category: "Materiale Construcții",
    image: "/file.svg"
  },
  { 
    id: "5", 
    name: "Șurubelnița MILWAUKEE M18", 
    price: "599 RON", 
    stock: 15, 
    category: "Unelte Electrice",
    image: "/file.svg"
  },
  { 
    id: "6", 
    name: "Polizor DEWALT DWE4157", 
    price: "429 RON", 
    stock: 10, 
    category: "Unelte Electrice",
    image: "/file.svg"
  },
];

interface AdminProductCardProps {
  product: AdminProduct;
}

function AdminProductCard({ product }: AdminProductCardProps) {
  const isLowStock = product.stock < 5;
  
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
      <CardContent className="p-0">
        {/* Image container */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={product.image || "/file.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 250px) 100vw, (max-width: 640px) 50vw, 25vw"
            priority
          />
          
          {/* Stock badge */}
          <Badge 
            className={`absolute top-2 left-2 font-semibold ${
              isLowStock 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            Stoc: {product.stock}
          </Badge>
          
          {/* Product ID */}
          <div className="absolute top-2 right-2 bg-white/95 rounded-full px-2 py-1 shadow-sm">
            <span className="text-xs font-mono">#{product.id}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 xs:p-3 sm:p-4 space-y-2">
          {/* Category */}
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          
          {/* Title */}
          <h3 className="font-semibold text-sm xs:text-base leading-tight line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <span className="text-lg xs:text-xl font-bold text-primary">
              {product.price}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-1 xs:gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-1 xs:gap-2 bg-primary text-white py-1.5 xs:py-2 px-2 xs:px-3 rounded-lg hover:bg-primary/90 transition-colors text-xs xs:text-sm font-medium">
              <Edit className="w-3 h-3 xs:w-4 xs:h-4" />
              <span className="hidden xs:inline">Editează</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 xs:gap-2 bg-red-600 text-white py-1.5 xs:py-2 px-2 xs:px-3 rounded-lg hover:bg-red-700 transition-colors text-xs xs:text-sm font-medium">
              <Trash2 className="w-3 h-3 xs:w-4 xs:h-4" />
              <span className="hidden xs:inline">Șterge</span>
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProductGrid() {
  return (
    <div className="bg-white rounded-lg xs:rounded-xl shadow border p-2 xs:p-3 sm:p-6">
      <div className="flex items-center justify-between mb-3 xs:mb-4">
        <h3 className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-4 h-4 xs:w-5 xs:h-5" />
          Produse ({products.length})
        </h3>
        <button className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
          + Adaugă
        </button>
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 xs:gap-3 sm:gap-4">
        {products.map((product) => (
          <AdminProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
