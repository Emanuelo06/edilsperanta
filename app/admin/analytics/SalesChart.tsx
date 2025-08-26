const data = [
  { month: "Ian", value: 1200 },
  { month: "Feb", value: 1900 },
  { month: "Mar", value: 3000 },
  { month: "Apr", value: 2500 },
  { month: "Mai", value: 3200 },
  { month: "Iun", value: 4000 },
  { month: "Iul", value: 3500 },
  { month: "Aug", value: 4200 },
];

const maxValue = Math.max(...data.map(d => d.value));

export default function SalesChart() {
  return (
    <div className="bg-white rounded-lg xs:rounded-xl shadow border p-2 xs:p-3 sm:p-6">
      <h3 className="text-sm xs:text-base sm:text-lg font-bold mb-2 xs:mb-3 sm:mb-4 text-gray-900">Evoluție vânzări</h3>
      <div className="space-y-2 xs:space-y-3">
        {data.map((item, index) => (
          <div key={item.month} className="flex items-center gap-1 xs:gap-2 sm:gap-3">
            <span className="text-xs xs:text-sm font-medium text-gray-600 w-6 xs:w-8 flex-shrink-0">{item.month}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 xs:h-3 relative overflow-hidden min-w-0">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`
                }}
              ></div>
            </div>
            <span className="text-xs xs:text-sm font-semibold text-gray-800 w-12 xs:w-16 sm:w-20 text-right flex-shrink-0">
              {item.value >= 1000 ? `${(item.value/1000).toFixed(1)}k` : item.value} <span className="hidden xs:inline">RON</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
