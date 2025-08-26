"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RootState, AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slices/authSlice";
import { fetchUserOrders } from "@/redux/slices/orderSlice";
import { 
  User, 
  Mail, 
  Settings,
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders } = useSelector((state: RootState) => state.orders);
  
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/auth/login?redirect=/profile');
      return;
    }

    // Load user data into form
    setForm({
      name: user.name || '',
      email: user.email || ''
    });

    // Load user orders
    dispatch(fetchUserOrders(user.uid));
  }, [user, router, dispatch]);

  const handleSave = () => {
    if (!user) return;
    
    // Update user profile with basic info
    const updatedUser = { ...user, name: form.name };
    dispatch(setUser(updatedUser));
    
    setSuccess('Profilul a fost actualizat cu succes!');
    setIsEditing(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
    setIsEditing(false);
    setSuccess(null);
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return AlertCircle;
      default: return Package;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi acasă
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Contul meu</h1>
          <p className="text-gray-600 mt-2">Gestionează-ți informațiile personale și comenzile</p>
        </div>

        {/* Success Alert */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informații personale
                </CardTitle>
                {!isEditing ? (
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Editează
                  </Button>
                ) : (
                  <div className="space-x-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Anulează
                    </Button>
                    <Button onClick={handleSave}>
                      Salvează
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nume complet</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      disabled={true} // Email cannot be changed
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email-ul nu poate fi modificat
                  </p>
                </div>

                <div>
                  <Label>Rol</Label>
                  <div className="mt-1">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? 'Administrator' : 'Client'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Comenzi recente
                </CardTitle>
                <Button variant="outline" onClick={() => router.push('/orders')}>
                  Vezi toate
                </Button>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => {
                      const StatusIcon = getOrderStatusIcon(order.status);
                      return (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <StatusIcon className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Comanda #{order.id?.slice(-8)}</span>
                            </div>
                            <Badge className={getOrderStatusColor(order.status)}>
                              {order.status === 'delivered' && 'Livrat'}
                              {order.status === 'shipped' && 'Expediat'}
                              {order.status === 'processing' && 'Se procesează'}
                              {order.status === 'cancelled' && 'Anulat'}
                              {order.status === 'pending' && 'În așteptare'}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>{order.items.length} produse</span>
                            <span>{order.total.toLocaleString('ro-RO')} Lei</span>
                          </div>
                          {order.createdAt && (
                            <div className="text-xs text-gray-400 mt-1">
                              {new Date(order.createdAt.seconds * 1000).toLocaleDateString('ro-RO')}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Nu ai nicio comandă încă</p>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/products')}>
                      Descoperă produsele
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistici cont</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total comenzi</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">În procesare</span>
                  <span className="font-semibold">
                    {orders.filter(o => o.status === 'processing').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Livrate</span>
                  <span className="font-semibold">
                    {orders.filter(o => o.status === 'delivered').length}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total cheltuit</span>
                  <span className="font-bold text-blue-600">
                    {orders
                      .filter(o => o.status !== 'cancelled')
                      .reduce((sum, order) => sum + order.total, 0)
                      .toLocaleString('ro-RO')} Lei
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acțiuni rapide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/orders')}>
                  <Package className="h-4 w-4 mr-3" />
                  Vezi toate comenzile
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/cart')}>
                  <Package className="h-4 w-4 mr-3" />
                  Coșul de cumpărături
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/products')}>
                  <Package className="h-4 w-4 mr-3" />
                  Descoperă produsele
                </Button>
                {user.role === 'admin' && (
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/admin')}>
                    <Settings className="h-4 w-4 mr-3" />
                    Panoul de administrare
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informații cont</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Membru din:</span>
                  <br />
                  <span className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('ro-RO')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status cont:</span>
                  <br />
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Activ
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
