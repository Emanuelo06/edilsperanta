"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

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
  featured?: boolean;
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data instead of Firebase for now to ensure functionality
    const mockCategories: Category[] = [
      {
        id: "1",
        name: "Unelte Electrice",
        image: "/file.svg"
      },
      {
        id: "2", 
        name: "Materiale de Construcție",
        image: "/file.svg"
      },
      {
        id: "3",
        name: "Instalații Sanitare",
        image: "/file.svg"
      },
      {
        id: "4",
        name: "Grădină & Exterior",
        image: "/file.svg"
      }
    ];

    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Bormasina cu Percutie BOSCH Professional",
        price: 899,
        images: ["/file.svg"],
        featured: true
      },
      {
        id: "2",
        name: "Set Cheie Tubulare 108 Piese GEDORE",
        price: 459,
        images: ["/file.svg"],
        featured: true
      },
      {
        id: "3",
        name: "Flexibilul Inox pentru Apa 1/2\"",
        price: 89,
        images: ["/file.svg"],
        featured: true
      },
      {
        id: "4",
        name: "Motocoasa Benzina STIHL FS 55",
        price: 1299,
        images: ["/file.svg"],
        featured: true
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setCategories(mockCategories);
      setProducts(mockProducts);
      setLoading(false);
    }, 300);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-12 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Bine ai venit la EdilSperanța!</h1>
        <p className="text-lg md:text-2xl mb-6">Totul pentru casa și construcții, livrat rapid oriunde în România.</p>
        <Link href="/products" className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition">
          Vezi catalogul
        </Link>
      </section>
      
      <section className="py-10 max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Categorii populare</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded shadow p-6 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {categories.map(cat => (
              <Link 
                key={cat.id} 
                href={`/products?category=${cat.id}`} 
                className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                {cat.image ? (
                  <Image 
                    src={cat.image} 
                    alt={cat.name} 
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover mb-2 rounded-full group-hover:scale-110 transition-transform" 
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
                )}
                <div className="font-semibold text-center group-hover:text-blue-600 transition-colors">{cat.name}</div>
              </Link>
            ))}
          </div>
        )}
        
        <h2 className="text-2xl font-bold mb-6 text-center">Produse recomandate</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded shadow p-6 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map(prod => (
              <Link 
                key={prod.id} 
                href={`/products/${prod.id}`} 
                className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-gray-100 hover:shadow-lg transition-all duration-300 group"
              >
                {prod.images && prod.images[0] ? (
                  <Image 
                    src={prod.images[0]} 
                    alt={prod.name} 
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover mb-2 rounded group-hover:scale-105 transition-transform" 
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded mb-2" />
                )}
                <div className="font-semibold text-center mb-1 group-hover:text-blue-600 transition-colors">{prod.name}</div>
                <div className="text-blue-600 font-bold">{prod.price.toFixed(2)} RON</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
