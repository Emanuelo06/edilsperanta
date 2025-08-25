export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded shadow p-6 flex items-center justify-center">
            {/* TODO: Product image gallery */}
            <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">Imagine produs</div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Nume produs</h1>
            <div className="text-primary font-bold text-xl mb-4">149,99 RON</div>
            <p className="mb-4">Descriere scurtă a produsului...</p>
            {/* TODO: Add to cart, wishlist, stock indicator */}
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90">Adaugă în coș</button>
          </div>
        </div>
        {/* TODO: Tabs for specificații, recenzii, produse similare */}
      </section>
    </main>
  );
}
