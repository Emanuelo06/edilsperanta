import { TrendingUp, ShoppingCart, Users, Package } from "lucide-react";

const cards = [
  {
    label: "Vânzări",
    value: "12.3k RON",
    icon: <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-primary" />,
    color: "bg-primary/10",
  },
  {
    label: "Comenzi", 
    value: "1.2k",
    icon: <ShoppingCart className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-blue-600" />,
    color: "bg-blue-100",
  },
  {
    label: "Clienți",
    value: "567",
    icon: <Users className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-green-600" />,
    color: "bg-green-100",
  },
  {
    label: "Produse",
    value: "98", 
    icon: <Package className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-orange-600" />,
    color: "bg-orange-100",
  },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 xs:gap-2 sm:gap-4 mb-3 xs:mb-4 sm:mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-5 flex flex-col items-center shadow bg-white border ${card.color} min-h-[70px] xs:min-h-[80px] sm:min-h-[120px]`}
        >
          <div className="mb-1 xs:mb-2 flex-shrink-0">{card.icon}</div>
          <div className="text-sm xs:text-base sm:text-2xl font-bold text-gray-900 text-center leading-tight">
            {card.value}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 font-medium text-center leading-tight">
            {card.label}
          </div>
        </div>
      ))}
    </div>
  );
}
