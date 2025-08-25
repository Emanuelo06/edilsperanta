import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
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
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const catSnap = await getDocs(query(collection(db, "categories"), where("isActive", "==", true), limit(4)));
        const prodSnap = await getDocs(query(collection(db, "products"), where("featured", "==", true), limit(4)));
        setCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      } catch (e) {
        setError("Eroare la încărcare. Încearcă din nou.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-12 text-center bg-primary text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Bine ai venit la EdilSperanța!</h1>
        <p className="text-lg md:text-2xl mb-6">Totul pentru casa și construcții, livrat rapid oriunde în România.</p>
        <a href="/products" className="inline-block bg-white text-primary font-semibold px-6 py-3 rounded shadow hover:bg-gray-100 transition">Vezi catalogul</a>
      </section>
      <section className="py-10 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Categorii populare</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded shadow p-6 animate-pulse h-32" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 mb-12">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {categories.map(cat => (
              <a key={cat.id} href={`/products?category=${cat.id}`} className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-gray-100 transition">
                {cat.image ? <img src={cat.image} alt={cat.name} className="w-16 h-16 object-cover mb-2 rounded-full" /> : <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />}
                <div className="font-semibold text-center">{cat.name}</div>
              </a>
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
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {products.map(prod => (
              <a key={prod.id} href={`/products/${prod.id}`} className="bg-white rounded shadow p-6 flex flex-col items-center hover:bg-gray-100 transition">
                {prod.images && prod.images[0] ? <img src={prod.images[0]} alt={prod.name} className="w-24 h-24 object-cover mb-2 rounded" /> : <div className="w-24 h-24 bg-gray-200 rounded mb-2" />}
                <div className="font-semibold text-center mb-1">{prod.name}</div>
                <div className="text-primary font-bold">{prod.price.toFixed(2)} RON</div>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
