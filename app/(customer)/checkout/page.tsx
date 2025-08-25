export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Finalizare comandă</h1>
        {/* TODO: Multi-step checkout (address, shipping, payment) */}
        <div className="mb-8 flex gap-4">
          <div className="flex-1 bg-white rounded shadow p-6">
            <div className="mb-4 font-semibold">1. Adresă de livrare</div>
            {/* TODO: Address form */}
            <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Stradă, număr, bloc, apartament" />
            <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Oraș" />
            <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Județ" />
            <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Cod poștal" />
            <input className="w-full border rounded px-3 py-2 mb-4" placeholder="Telefon" />
          </div>
          <div className="w-80 bg-white rounded shadow p-6">
            <div className="font-semibold mb-2">Sumar comandă</div>
            <div className="flex justify-between mb-1"><span>Produse</span><span>99,99 RON</span></div>
            <div className="flex justify-between mb-1"><span>Transport</span><span>19,99 RON</span></div>
            <div className="flex justify-between font-bold"><span>Total</span><span>119,98 RON</span></div>
            <button className="mt-6 w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 transition">Plătește</button>
          </div>
        </div>
      </section>
    </main>
  );
}
