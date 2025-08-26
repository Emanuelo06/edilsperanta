const orders = [
  { id: "#1001", client: "Ion Popescu", total: "1.200 RON", status: "Livrat", date: "2025-08-20" },
  { id: "#1002", client: "Maria Ionescu", total: "850 RON", status: "În curs", date: "2025-08-22" },
  { id: "#1003", client: "Vasile Georgescu", total: "2.100 RON", status: "Anulat", date: "2025-08-23" },
  { id: "#1004", client: "Elena Stan", total: "650 RON", status: "Livrat", date: "2025-08-24" },
];

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-lg xs:rounded-xl shadow border p-2 xs:p-3 sm:p-6">
      <h3 className="text-sm xs:text-base sm:text-lg font-bold mb-3 xs:mb-4 text-gray-900">Comenzi recente</h3>
      
      {/* Desktop Table - Hidden on very small screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left font-medium pb-3">ID</th>
              <th className="text-left font-medium pb-3">Client</th>
              <th className="text-left font-medium pb-3">Total</th>
              <th className="text-left font-medium pb-3">Status</th>
              <th className="text-left font-medium pb-3">Data</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Compact View */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {order.id}
              </span>
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
            
            <div className="space-y-1">
              <div className="font-medium text-gray-900 text-sm leading-tight">
                {order.client}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-primary">
                  {order.total}
                </span>
                <span className="text-gray-600 text-xs">
                  {order.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
