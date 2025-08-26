const orders = [
  { id: "#1001", client: "Ion Popescu", total: "1.200 RON", status: "Livrat", date: "2025-08-20" },
  { id: "#1002", client: "Maria Ionescu", total: "850 RON", status: "În curs", date: "2025-08-22" },
  { id: "#1003", client: "Vasile Georgescu", total: "2.100 RON", status: "Anulat", date: "2025-08-23" },
  { id: "#1004", client: "Elena Stan", total: "650 RON", status: "Livrat", date: "2025-08-24" },
];

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-lg xs:rounded-xl shadow border p-2 xs:p-3 sm:p-6">
      <h3 className="text-sm xs:text-base sm:text-lg font-bold mb-2 xs:mb-3 text-gray-900">Comenzi</h3>
      
      {/* Desktop Table - Hidden on small screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left font-medium pb-2">ID</th>
              <th className="text-left font-medium pb-2">Client</th>
              <th className="text-left font-medium pb-2">Total</th>
              <th className="text-left font-medium pb-2">Status</th>
              <th className="text-left font-medium pb-2">Data</th>
              <th className="text-left font-medium pb-2">Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50">
                <td className="py-3 font-mono">{order.id}</td>
                <td className="py-3">{order.client}</td>
                <td className="py-3">{order.total}</td>
                <td className="py-3">
                  <span className={
                    order.status === "Livrat"
                      ? "text-green-600 font-semibold"
                      : order.status === "Anulat"
                      ? "text-red-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }>
                    {order.status}
                  </span>
                </td>
                <td className="py-3">{order.date}</td>
                <td className="py-3">
                  <button className="text-primary hover:underline text-sm font-semibold mr-2">Detalii</button>
                  <button className="text-red-600 hover:underline text-sm font-semibold">Șterge</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards - Visible only on small screens */}
      <div className="sm:hidden space-y-2">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-2 hover:bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-gray-600">{order.id}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                order.status === "Livrat"
                  ? "bg-green-100 text-green-800"
                  : order.status === "Anulat"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}>
                {order.status}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1 truncate">{order.client}</div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="font-semibold">{order.total}</span>
              <span>{order.date}</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-primary hover:bg-primary/10 text-xs font-semibold py-1 px-2 rounded transition-colors">
                Detalii
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
