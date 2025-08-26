const categories = [
  { id: "1", name: "Materiale Construcții", products: 24 },
  { id: "2", name: "Unelte Electrice", products: 18 },
  { id: "3", name: "Grădină & Exterior", products: 12 },
  { id: "4", name: "Instalații", products: 9 },
  { id: "5", name: "Decorațiuni", products: 7 },
  { id: "6", name: "Mobilier", products: 6 },
];

export default function CategoryTable() {
  return (
    <div className="bg-white rounded-lg xs:rounded-xl shadow border p-2 xs:p-3 sm:p-6">
      <h3 className="text-sm xs:text-base sm:text-lg font-bold mb-2 xs:mb-3 text-gray-900">Categorii</h3>
      
      {/* Desktop Table - Hidden on small screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left font-medium pb-2">ID</th>
              <th className="text-left font-medium pb-2">Nume</th>
              <th className="text-left font-medium pb-2">Produse</th>
              <th className="text-left font-medium pb-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t hover:bg-gray-50">
                <td className="py-3 font-mono">{cat.id}</td>
                <td className="py-3">{cat.name}</td>
                <td className="py-3">{cat.products}</td>
                <td className="py-3">
                  <button className="text-primary hover:underline text-sm font-semibold mr-2">Editează</button>
                  <button className="text-red-600 hover:underline text-sm font-semibold">Șterge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Visible only on small screens */}
      <div className="sm:hidden space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-gray-600">#{cat.id}</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                {cat.products} produse
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900 mb-2 leading-tight">{cat.name}</div>
            <div className="flex gap-2">
              <button className="flex-1 text-primary hover:bg-primary/10 text-xs font-semibold py-1 px-2 rounded transition-colors">
                Editează
              </button>
              <button className="flex-1 text-red-600 hover:bg-red-50 text-xs font-semibold py-1 px-2 rounded transition-colors">
                Șterge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
