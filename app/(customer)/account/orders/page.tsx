export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Istoric comenzi</h1>
        {/* TODO: Map user orders from Redux or Firestore */}
        <div className="space-y-4">
          <div className="bg-white rounded shadow p-6 flex items-center justify-between">
            <div>
              <div className="font-semibold">#123456</div>
              <div className="text-sm text-gray-500">24.08.2025</div>
            </div>
            <div className="font-bold text-primary">299,99 RON</div>
            <div className="text-green-600 font-semibold">Livrată</div>
            <a href="/order/123456" className="text-blue-600 hover:underline">Detalii</a>
          </div>
        </div>
      </section>
    </main>
  );
}
