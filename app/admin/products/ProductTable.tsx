const products = [
  { id: "1", name: "Bormasină BOSCH GSB 21-2 RCE", price: "849 RON", stock: 12, category: "Unelte Electrice" },
  { id: "2", name: "Set chei GEDORE 19-piece", price: "299 RON", stock: 8, category: "Materiale Construcții" },
  { id: "3", name: "Fierăstrău MAKITA HS7601", price: "1299 RON", stock: 5, category: "Unelte Electrice" },
  { id: "4", name: "Ciocan demolator HILTI TE 60-ATC", price: "2199 RON", stock: 2, category: "Materiale Construcții" },
  { id: "5", name: "Șurubelnița MILWAUKEE M18", price: "599 RON", stock: 15, category: "Unelte Electrice" },
  { id: "6", name: "Polizor DEWALT DWE4157", price: "429 RON", stock: 10, category: "Unelte Electrice" },
];

export default function ProductTable() {
  return (
    <div className="bg-white rounded-xl shadow border p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold mb-2 text-gray-900">Produse</h3>
      <table className="w-full text-xs sm:text-sm">
        <thead>
          <tr className="text-gray-500">
            <th className="text-left font-medium pb-1">ID</th>
            <th className="text-left font-medium pb-1">Nume</th>
            <th className="text-left font-medium pb-1">Preț</th>
            <th className="text-left font-medium pb-1">Stoc</th>
            <th className="text-left font-medium pb-1">Categorie</th>
            <th className="text-left font-medium pb-1">Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} className="border-t last:border-b hover:bg-gray-50">
              <td className="py-1.5 font-mono">{prod.id}</td>
              <td className="py-1.5">{prod.name}</td>
              <td className="py-1.5">{prod.price}</td>
              <td className="py-1.5">{prod.stock}</td>
              <td className="py-1.5">{prod.category}</td>
              <td className="py-1.5">
                <button className="text-primary hover:underline text-xs font-semibold mr-2">Editează</button>
                <button className="text-red-600 hover:underline text-xs font-semibold">Șterge</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
