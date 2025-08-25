export default function ProductCatalogPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Catalog produse</h1>
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input className="border rounded px-4 py-2 w-full md:w-1/3" placeholder="Caută produse..." />
          {/* TODO: Add filters, sorting, and category tree */}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* TODO: Map products from Redux or Firestore */}
          <div className="bg-white rounded shadow p-6">Produs 1</div>
          <div className="bg-white rounded shadow p-6">Produs 2</div>
          <div className="bg-white rounded shadow p-6">Produs 3</div>
          <div className="bg-white rounded shadow p-6">Produs 4</div>
        </div>
      </section>
    </main>
  );
}
