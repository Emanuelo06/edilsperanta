"use client";

import AdminLayout from "./AdminLayout";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Eye,
  Settings as SettingsIcon,
  Plus,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats] = useState({
    totalRevenue: 12300,
    totalOrders: 1200,
    totalUsers: 567,
    totalProducts: 98,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    usersGrowth: 15.2,
    productsGrowth: 3.1
  });

  const [recentOrders] = useState([
    { id: "#1001", customer: "Ion Popescu", amount: 1200, status: "Livrat", date: "2025-08-20" },
    { id: "#1002", customer: "Maria Ionescu", amount: 850, status: "În curs", date: "2025-08-22" },
    { id: "#1003", customer: "Vasile Georgescu", amount: 2100, status: "Anulat", date: "2025-08-23" },
    { id: "#1004", customer: "Elena Stan", amount: 650, status: "Livrat", date: "2025-08-24" }
  ]);

  const [monthlyData] = useState([
    { month: "Ian", revenue: 1200, orders: 45 },
    { month: "Feb", revenue: 1900, orders: 68 },
    { month: "Mar", revenue: 3000, orders: 95 },
    { month: "Apr", revenue: 2500, orders: 82 },
    { month: "Mai", revenue: 3200, orders: 110 },
    { month: "Iun", revenue: 4000, orders: 128 },
    { month: "Iul", revenue: 3500, orders: 115 },
    { month: "Aug", revenue: 4200, orders: 142 }
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // Mock loading simulation - Faster loading for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Reduced from 800ms to 200ms
    return () => clearTimeout(timer);
  }, []);

  const quickActions = [
    { 
      title: "Adaugă Produs", 
      href: "/admin/products/create", 
      icon: Plus, 
      color: "from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
      description: "Produs nou"
    },
    { 
      title: "Vezi Comenzi", 
      href: "/admin/orders", 
      icon: Eye, 
      color: "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      description: "Gestionează"
    },
    { 
      title: "Setări", 
      href: "/admin/settings", 
      icon: SettingsIcon, 
      color: "from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
      description: "Configurări"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Livrat": return "bg-green-100 text-green-800 border-green-200";
      case "În curs": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Anulat": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <AdminLayout section="dashboard">
      <div className="space-y-2 2xs:space-y-3 xs:space-y-4 sm:space-y-6 p-2 2xs:p-3 xs:p-4 sm:p-6">
        {/* Ultra-Responsive Enhanced Header */}
        <div className="flex flex-col 2xs:flex-row items-start 2xs:items-center justify-between gap-2 2xs:gap-3 xs:gap-4 mb-3 2xs:mb-4 xs:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
              Dashboard Analytics
            </h1>
            <p className="text-2xs 2xs:text-xs xs:text-sm text-gray-600 mt-0.5 leading-tight">
              Privire de ansamblu asupra performanțelor
            </p>
          </div>
          
          <Link 
            href="/admin/settings"
            className="w-full 2xs:w-auto flex items-center justify-center gap-1 2xs:gap-2 px-2 2xs:px-3 py-1.5 2xs:py-2 rounded-lg 2xs:rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 text-2xs 2xs:text-xs xs:text-sm font-medium border border-blue-200 hover:border-blue-300"
          >
            <SettingsIcon className="w-3 h-3 2xs:w-4 2xs:h-4" />
            <span>Setări Rapide</span>
          </Link>
        </div>

        {/* Ultra-Responsive Stats Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 2xs:gap-3 xs:gap-4">
          {/* Revenue Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 overflow-hidden">
            <CardContent className="p-2 2xs:p-3 xs:p-4">
              <div className="flex items-start justify-between mb-1 2xs:mb-2">
                <div className="p-1 2xs:p-1.5 xs:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md 2xs:rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-white" />
                </div>
                <Badge className="text-2xs 2xs:text-xs bg-green-100 text-green-700 border-green-200 px-1 2xs:px-2 py-0 2xs:py-0.5">
                  +{stats.revenueGrowth}%
                </Badge>
              </div>
              <div className="space-y-0.5 2xs:space-y-1">
                {isLoading ? (
                  <div className="h-4 2xs:h-5 xs:h-6 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-sm 2xs:text-base xs:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-none">
                    12.3k RON
                  </p>
                )}
                <p className="text-2xs 2xs:text-xs text-gray-600 font-medium leading-tight">Vânzări</p>
              </div>
            </CardContent>
          </Card>

          {/* Orders Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 overflow-hidden">
            <CardContent className="p-2 2xs:p-3 xs:p-4">
              <div className="flex items-start justify-between mb-1 2xs:mb-2">
                <div className="p-1 2xs:p-1.5 xs:p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md 2xs:rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-white" />
                </div>
                <Badge className="text-2xs 2xs:text-xs bg-green-100 text-green-700 border-green-200 px-1 2xs:px-2 py-0 2xs:py-0.5">
                  +{stats.ordersGrowth}%
                </Badge>
              </div>
              <div className="space-y-0.5 2xs:space-y-1">
                {isLoading ? (
                  <div className="h-4 2xs:h-5 xs:h-6 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-sm 2xs:text-base xs:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors leading-none">
                    1.2k
                  </p>
                )}
                <p className="text-2xs 2xs:text-xs text-gray-600 font-medium leading-tight">Comenzi</p>
              </div>
            </CardContent>
          </Card>

          {/* Users Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 overflow-hidden">
            <CardContent className="p-2 2xs:p-3 xs:p-4">
              <div className="flex items-start justify-between mb-1 2xs:mb-2">
                <div className="p-1 2xs:p-1.5 xs:p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md 2xs:rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-white" />
                </div>
                <Badge className="text-2xs 2xs:text-xs bg-green-100 text-green-700 border-green-200 px-1 2xs:px-2 py-0 2xs:py-0.5">
                  +{stats.usersGrowth}%
                </Badge>
              </div>
              <div className="space-y-0.5 2xs:space-y-1">
                {isLoading ? (
                  <div className="h-4 2xs:h-5 xs:h-6 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-sm 2xs:text-base xs:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors leading-none">
                    567
                  </p>
                )}
                <p className="text-2xs 2xs:text-xs text-gray-600 font-medium leading-tight">Clienți</p>
              </div>
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 overflow-hidden">
            <CardContent className="p-2 2xs:p-3 xs:p-4">
              <div className="flex items-start justify-between mb-1 2xs:mb-2">
                <div className="p-1 2xs:p-1.5 xs:p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-md 2xs:rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-white" />
                </div>
                <Badge className="text-2xs 2xs:text-xs bg-green-100 text-green-700 border-green-200 px-1 2xs:px-2 py-0 2xs:py-0.5">
                  +{stats.productsGrowth}%
                </Badge>
              </div>
              <div className="space-y-0.5 2xs:space-y-1">
                {isLoading ? (
                  <div className="h-4 2xs:h-5 xs:h-6 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  <p className="text-sm 2xs:text-base xs:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-none">
                    98
                  </p>
                )}
                <p className="text-2xs 2xs:text-xs text-gray-600 font-medium leading-tight">Produse</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2 2xs:gap-3 xs:gap-4">
          {/* Sales Evolution Chart */}
          <div className="xl:col-span-2">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="p-2 2xs:p-3 xs:p-4 pb-2 2xs:pb-3">
                <CardTitle className="text-xs 2xs:text-sm xs:text-base flex items-center gap-1 2xs:gap-2">
                  <BarChart3 className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-blue-600" />
                  <span className="truncate">Evoluție vânzări</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 2xs:p-3 xs:p-4 pt-0">
                <div className="space-y-2 2xs:space-y-3">
                  {monthlyData.slice(-8).map((month) => {
                    const maxRevenue = Math.max(...monthlyData.map(m => m.revenue));
                    const widthPercentage = (month.revenue / maxRevenue) * 100;
                    
                    return (
                      <div key={month.month} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-2xs 2xs:text-xs font-medium text-gray-600">{month.month}</span>
                          <div className="flex items-center gap-2 2xs:gap-3">
                            <span className="text-2xs 2xs:text-xs font-bold text-gray-900">{month.revenue.toLocaleString()}k</span>
                            <span className="text-2xs text-gray-500">{month.orders} comenzi</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 2xs:h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 2xs:h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${widthPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="p-2 2xs:p-3 xs:p-4 pb-2 2xs:pb-3">
              <CardTitle className="text-xs 2xs:text-sm xs:text-base flex items-center gap-1 2xs:gap-2">
                <Activity className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-green-600" />
                <span className="truncate">Comenzi recente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 2xs:p-3 xs:p-4 pt-0 space-y-2 2xs:space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between gap-2 p-2 2xs:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 2xs:gap-2 mb-0.5">
                      <span className="text-2xs 2xs:text-xs font-bold text-gray-900 truncate">{order.id}</span>
                      <Badge className={`text-2xs px-1 py-0 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-2xs text-gray-600 truncate">{order.customer}</p>
                    <p className="text-2xs text-gray-500">{new Date(order.date).toLocaleDateString('ro-RO')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xs 2xs:text-xs font-bold text-gray-900">
                      {order.amount.toLocaleString()} RON
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-white">
          <CardHeader className="p-2 2xs:p-3 xs:p-4 pb-2 2xs:pb-3">
            <CardTitle className="text-xs 2xs:text-sm xs:text-base flex items-center gap-1 2xs:gap-2">
              <div className="w-4 h-4 2xs:w-5 2xs:h-5 xs:w-6 xs:h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md 2xs:rounded-lg flex items-center justify-center">
                <Package className="w-2 h-2 2xs:w-2.5 2xs:h-2.5 xs:w-3 xs:h-3 text-white" />
              </div>
              <span className="truncate">Acțiuni Rapide</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 2xs:p-3 xs:p-4 pt-0">
            <div className="grid grid-cols-1 2xs:grid-cols-3 gap-2 2xs:gap-3">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href} className="group">
                  <Card className={`hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br ${action.color} text-white overflow-hidden cursor-pointer transform hover:scale-105`}>
                    <CardContent className="p-3 2xs:p-4 xs:p-6 text-center">
                      <div className="flex flex-col items-center gap-1 2xs:gap-2 xs:gap-3">
                        <div className="p-2 2xs:p-3 bg-white/20 rounded-xl backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                          <action.icon className="w-4 h-4 2xs:w-5 2xs:h-5 xs:w-6 xs:h-6" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-2xs 2xs:text-xs xs:text-sm font-bold leading-tight">{action.title}</h3>
                          <p className="text-2xs opacity-90 leading-tight">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
