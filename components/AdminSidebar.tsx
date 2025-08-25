import Link from "next/link";
import { LayoutDashboard, Package, List, ShoppingBag, BarChart2 } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produse", icon: Package },
  { href: "/admin/categories", label: "Categorii", icon: List },
  { href: "/admin/orders", label: "Comenzi", icon: ShoppingBag },
  { href: "/admin/analytics", label: "Analitice", icon: BarChart2 },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 py-8 px-4 flex flex-col gap-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition"
        >
          <Icon className="w-5 h-5" />
          {label}
        </Link>
      ))}
    </aside>
  );
}
