"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Package, 
  CreditCard, 
  MapPin, 
  Settings, 
  Heart,
  Star,
  Truck,
  ShoppingBag,
  Clock,
  Gift,
  Shield,
  Bell,
  ChevronRight,
  Award,
  Target
} from "lucide-react";

interface Order {
  id: string;
  date: string;
  status: "delivered" | "in_progress" | "cancelled";
  total: number;
  items: number;
}

interface RecentActivity {
  id: string;
  type: "order" | "review" | "favorite";
  description: string;
  date: string;
}

export default function AccountDashboardPage() {
  const [user] = useState({
    name: "Ion Popescu",
    email: "ion.popescu@email.com",
    memberSince: "2022",
    loyaltyPoints: 2450,
    loyaltyLevel: "Silver"
  });

  const [recentOrders] = useState<Order[]>([
    {
      id: "CMD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 1299,
      items: 3
    },
    {
      id: "CMD-2024-002", 
      date: "2024-01-10",
      status: "in_progress",
      total: 899,
      items: 2
    },
    {
      id: "CMD-2023-158",
      date: "2023-12-28",
      status: "delivered", 
      total: 456,
      items: 1
    }
  ]);

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "order",
      description: "Comanda CMD-2024-002 a fost expediată",
      date: "2024-01-12"
    },
    {
      id: "2", 
      type: "review",
      description: "Ai evaluat Bormasina BOSCH GSB 21-2 RCE",
      date: "2024-01-11"
    },
    {
      id: "3",
      type: "favorite",
      description: "Ai adăugat la favorite Set chei tubulare GEDORE",
      date: "2024-01-09"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-green-100 text-green-800">Livrat</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">În procesare</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Anulat</Badge>;
      default:
        return <Badge variant="secondary">Necunoscut</Badge>;
    }
  };

  const getLoyaltyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "gold": return "text-yellow-600";
      case "silver": return "text-gray-600";
      case "bronze": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2 sm:py-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                <span className="hidden xs:inline">Contul meu</span>
                <span className="xs:hidden">Cont</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                <span className="hidden xs:inline">Bine ai revenit, {user.name}!</span>
                <span className="xs:hidden">Salut, {user.name.split(' ')[0]}!</span>
              </p>
            </div>
            <Button variant="outline" asChild className="w-fit text-xs sm:text-sm">
              <Link href="/account/settings">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Setări cont</span>
                <span className="xs:hidden">Setări</span>
              </Link>
            </Button>
          </div>

          {/* User Info Card */}
          <Card className="mb-4 sm:mb-8">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-6">
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
                  <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                    <AvatarFallback className="text-sm sm:text-xl font-bold bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-xl font-semibold truncate">{user.name}</h2>
                    <p className="text-xs sm:text-base text-gray-600 truncate">{user.email}</p>
                    <p className="text-xs text-gray-500">
                      <span className="hidden xs:inline">Client din {user.memberSince}</span>
                      <span className="xs:hidden">Din {user.memberSince}</span>
                    </p>
                  </div>
                </div>

                <Separator className="hidden sm:block" />

                {/* Loyalty Program */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 justify-center xs:justify-start">
                  <div className="text-center">
                    <div className={`flex items-center gap-1 ${getLoyaltyColor(user.loyaltyLevel)} justify-center`}>
                      <Award className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-xs sm:text-base">{user.loyaltyLevel}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="hidden xs:inline">Status membru</span>
                      <span className="xs:hidden">Status</span>
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-primary justify-center">
                      <Target className="w-3 h-3 sm:w-5 sm:h-5" />
                      <span className="font-semibold text-xs sm:text-base">{user.loyaltyPoints.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="hidden xs:inline">Puncte loialitate</span>
                      <span className="xs:hidden">Puncte</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <ShoppingBag className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Acțiuni rapide</span>
                  <span className="xs:hidden">Acțiuni</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm" asChild>
                    <Link href="/account/orders">
                      <Package className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="hidden xs:inline">Comenzile mele</span>
                      <span className="xs:hidden text-xs">Comenzi</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm" asChild>
                    <Link href="/account/favorites">
                      <Heart className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="hidden xs:inline">Favorite</span>
                      <span className="xs:hidden text-xs">Fav</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm" asChild>
                    <Link href="/account/addresses">
                      <MapPin className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="hidden xs:inline">Adrese</span>
                      <span className="xs:hidden text-xs">Addr</span>
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 text-xs sm:text-sm" asChild>
                    <Link href="/account/payment-methods">
                      <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" />
                      <span className="hidden xs:inline">Plăți</span>
                      <span className="xs:hidden text-xs">Pay</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                    <Package className="w-3 h-3 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Comenzi recente</span>
                    <span className="xs:hidden">Comenzi</span>
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm" asChild>
                    <Link href="/account/orders">
                      <span className="hidden xs:inline">Vezi toate</span>
                      <span className="xs:hidden">Toate</span>
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-2 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Package className="w-3 h-3 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-xs sm:text-base truncate">{order.id}</p>
                        <p className="text-xs text-gray-600">
                          <span className="hidden xs:inline">{order.items} produse • {new Date(order.date).toLocaleDateString("ro-RO")}</span>
                          <span className="xs:hidden">{order.items} prod • {new Date(order.date).toLocaleDateString("ro-RO", {day: '2-digit', month: '2-digit'})}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="mb-1">
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm sm:text-lg font-bold">
                        <span className="hidden xs:inline">{order.total.toLocaleString("ro-RO", { style: "currency", currency: "RON" })}</span>
                        <span className="xs:hidden">{order.total} lei</span>
                      </p>
                    </div>
                  </div>
                ))}
                
                {recentOrders.length === 0 && (
                  <div className="text-center py-4 sm:py-8 text-gray-500">
                    <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-4" />
                    <p className="text-xs sm:text-base">Nu ai încă nicio comandă</p>
                    <Button className="mt-2 sm:mt-4 text-xs sm:text-sm" size="sm" asChild>
                      <Link href="/products">Începe să cumperi</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Clock className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Activitate recentă</span>
                  <span className="xs:hidden">Activitate</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.type === "order" && <Truck className="w-3 h-3 sm:w-4 sm:h-4" />}
                      {activity.type === "review" && <Star className="w-3 h-3 sm:w-4 sm:h-4" />}
                      {activity.type === "favorite" && <Heart className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm leading-tight">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.date).toLocaleDateString("ro-RO", { day: '2-digit', month: '2-digit', year: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 250px optimized */}
          <div className="space-y-3 sm:space-y-6">
            {/* Account Menu */}
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <User className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Contul meu</span>
                  <span className="xs:hidden">Cont</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 sm:space-y-2">
                <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10" asChild>
                  <Link href="/account/profile">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                    <span className="hidden xs:inline">Profilul meu</span>
                    <span className="xs:hidden">Profil</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10" asChild>
                  <Link href="/account/orders">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                    <span className="hidden xs:inline">Comenzile mele</span>
                    <span className="xs:hidden">Comenzi</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10" asChild>
                  <Link href="/account/favorites">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                    <span className="hidden xs:inline">Produse favorite</span>
                    <span className="xs:hidden">Favorite</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10" asChild>
                  <Link href="/account/addresses">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                    <span className="hidden xs:inline">Cărți de adrese</span>
                    <span className="xs:hidden">Adrese</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10" asChild>
                  <Link href="/account/payment-methods">
                    <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                    <span className="hidden xs:inline">Metode de plată</span>
                    <span className="xs:hidden">Plăți</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10" asChild>
                  <Link href="/account/notifications">
                    <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                    <span className="hidden xs:inline">Notificări</span>
                    <span className="xs:hidden">Notif</span>
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-xs sm:text-sm h-8 sm:h-10" asChild>
                  <Link href="/account/settings">
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                    Setări
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Loyalty Program - 250px optimized */}
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Gift className="w-3 h-3 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Program loialitate</span>
                  <span className="xs:hidden">Loialitate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-3 sm:mb-4">
                  <div className={`text-lg sm:text-2xl font-bold ${getLoyaltyColor(user.loyaltyLevel)} flex items-center justify-center gap-1 sm:gap-2`}>
                    <Award className="w-4 h-4 sm:w-6 sm:h-6" />
                    {user.loyaltyLevel}
                  </div>
                  <p className="text-xs text-gray-600">Status curent</p>
                </div>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span>Puncte:</span>
                    <span className="font-semibold">{user.loyaltyPoints.toLocaleString()}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                    <div className="bg-primary h-1.5 sm:h-2 rounded-full" style={{ width: `${(user.loyaltyPoints % 5000) / 50}%` }}></div>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center leading-tight">
                    <span className="hidden xs:inline">{5000 - (user.loyaltyPoints % 5000)} puncte până la următorul nivel</span>
                    <span className="xs:hidden">{5000 - (user.loyaltyPoints % 5000)} puncte la următor</span>
                  </p>
                </div>
                
                <Button className="w-full mt-3 sm:mt-4 text-xs sm:text-sm" variant="outline" size="sm" asChild>
                  <Link href="/account/loyalty">
                    <span className="hidden xs:inline">Vezi beneficiile</span>
                    <span className="xs:hidden">Beneficii</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Security - 250px optimized */}
            <Card>
              <CardHeader className="pb-2 sm:pb-6">
                <CardTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                  <Shield className="w-3 h-3 sm:w-5 sm:h-5" />
                  Securitate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full"></div>
                  <span className="hidden xs:inline">Cont verificat</span>
                  <span className="xs:hidden">Verificat</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-600 rounded-full"></div>
                  <span className="hidden xs:inline">Email confirmat</span>
                  <span className="xs:hidden">Email OK</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-600 rounded-full"></div>
                  <span className="hidden xs:inline">2FA dezactivat</span>
                  <span className="xs:hidden">2FA off</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2 sm:mt-3 text-xs sm:text-sm" asChild>
                  <Link href="/account/security">
                    <span className="hidden xs:inline">Îmbunătățește securitatea</span>
                    <span className="xs:hidden">Securitate</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
