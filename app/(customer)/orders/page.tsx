"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchUserOrders, cancelOrder } from "@/redux/slices/orderSlice";
import { 
  Package, 
  Search, 
  Filter,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Eye,
  Download,
  RefreshCw,
  ArrowLeft,
  Phone,
  Mail
} from "lucide-react";

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orders, isLoading, error } = useSelector((state: RootState) => state.orders);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push('/auth/login?redirect=/orders');
      return;
    }

    // Load user orders
    dispatch(fetchUserOrders(user.uid));
  }, [user, router, dispatch]);

  const handleCancelOrder = async (orderId: string) => {
    if (!user) return;
    
    setCancellingOrder(orderId);
    try {
      await dispatch(cancelOrder({ id: orderId, reason: 'Anulat de client' })).unwrap();
    } catch (err) {
      console.error('Error cancelling order:', err);
    } finally {
      setCancellingOrder(null);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      case 'cancelled': return AlertCircle;
      case 'pending': return Clock;
      default: return Package;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Livrat';
      case 'shipped': return 'Expediat';
      case 'processing': return 'Se procesează';
      case 'cancelled': return 'Anulat';
      case 'pending': return 'În așteptare';
      default: return 'Necunoscut';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => 
        item.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi la profil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Comenzile mele</h1>
          <p className="text-gray-600 mt-2">Urmărește statusul comenzilor tale</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Caută după numărul comenzii sau produse..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">Toate statusurile</option>
                  <option value="pending">În așteptare</option>
                  <option value="processing">Se procesează</option>
                  <option value="shipped">Expediat</option>
                  <option value="delivered">Livrat</option>
                  <option value="cancelled">Anulat</option>
                </select>
              </div>

              <Button 
                variant="outline" 
                onClick={() => dispatch(fetchUserOrders(user.uid))}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Reîmprospătează
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getOrderStatusIcon(order.status);
              const isExpanded = selectedOrder === order.id;
              const canCancel = ['pending', 'processing'].includes(order.status);
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="cursor-pointer" onClick={() => setSelectedOrder(isExpanded ? null : order.id!)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className="h-5 w-5 text-gray-500" />
                        <div>
                          <CardTitle className="text-lg">
                            Comanda #{order.id?.slice(-8)}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {order.createdAt && new Date(order.createdAt.seconds * 1000).toLocaleDateString('ro-RO')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge className={getOrderStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            {order.total.toLocaleString('ro-RO')} Lei
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="border-t">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Produse comandate</h4>
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <div className="relative w-12 h-12 bg-white rounded-lg overflow-hidden">
                                  <Image
                                    src={item.image || '/placeholder.jpg'}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {item.productName}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Cantitate: {item.quantity} × {item.price.toLocaleString('ro-RO')} Lei
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                                    {(item.price * item.quantity).toLocaleString('ro-RO')} Lei
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-6">
                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              Adresa de livrare
                            </h4>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm">
                              <p className="font-medium">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                              </p>
                              <p>{order.shippingAddress.street}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                              {order.shippingAddress.phone && (
                                <p className="flex items-center mt-2">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {order.shippingAddress.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Informații plată
                            </h4>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                              <div className="flex justify-between">
                                <span>Metodă plată:</span>
                                <span className="font-medium">
                                  {order.paymentMethod === 'card' && 'Card bancar'}
                                  {order.paymentMethod === 'cash_on_delivery' && 'Ramburs'}
                                  {order.paymentMethod === 'paypal' && 'PayPal'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status plată:</span>
                                <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                                  {order.paymentStatus === 'paid' ? 'Plătit' : 'În așteptare'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          {/* Cost Breakdown */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Detalii cost</h4>
                            <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-2">
                              <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>{order.subtotal.toLocaleString('ro-RO')} Lei</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Livrare:</span>
                                <span>{order.shipping.toLocaleString('ro-RO')} Lei</span>
                              </div>
                              <div className="flex justify-between">
                                <span>TVA:</span>
                                <span>{order.tax.toLocaleString('ro-RO')} Lei</span>
                              </div>
                              <Separator />
                              <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>{order.total.toLocaleString('ro-RO')} Lei</span>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {order.notes && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Observații</h4>
                              <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                                {order.notes}
                              </p>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex space-x-3">
                            {canCancel && (
                              <Button
                                variant="outline"
                                onClick={() => handleCancelOrder(order.id!)}
                                disabled={cancellingOrder === order.id}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                {cancellingOrder === order.id ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                    Se anulează...
                                  </div>
                                ) : (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    Anulează comanda
                                  </>
                                )}
                              </Button>
                            )}

                            <Button variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Descarcă factură
                            </Button>

                            <Button variant="outline">
                              <Mail className="h-4 w-4 mr-2" />
                              Contact support
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nu s-au găsit comenzi' : 'Nu ai nicio comandă încă'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'Încearcă să modifici criteriile de căutare.' 
                : 'Când vei plasa o comandă, o vei vedea aici.'}
            </p>
            <div className="space-x-4">
              {(searchTerm || statusFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  Șterge filtrele
                </Button>
              )}
              <Button onClick={() => router.push('/products')}>
                Descoperă produsele
              </Button>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Sumar comenzi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{filteredOrders.length}</p>
                  <p className="text-sm text-gray-600">Total comenzi</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredOrders.filter(o => o.status === 'delivered').length}
                  </p>
                  <p className="text-sm text-gray-600">Livrate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredOrders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                  </p>
                  <p className="text-sm text-gray-600">În progres</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredOrders
                      .filter(o => o.status !== 'cancelled')
                      .reduce((sum, order) => sum + order.total, 0)
                      .toLocaleString('ro-RO')} Lei
                  </p>
                  <p className="text-sm text-gray-600">Total cheltuit</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
