"use client";

import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Package,
  Save,
  X
} from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  total: number;
  status: 'În așteptare' | 'Confirmat' | 'În livrare' | 'Livrat' | 'Anulat';
  date: string;
  items: OrderItem[];
  paymentMethod: string;
  notes?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#1001",
      customerName: "Ion Popescu",
      customerEmail: "ion.popescu@email.com",
      customerPhone: "+40 722 123 456",
      shippingAddress: "Str. Libertății nr. 15, București, Sector 3",
      total: 2499,
      status: "Livrat",
      date: "2025-08-20T10:30:00",
      paymentMethod: "Card",
      notes: "Livrare la etajul 2",
      items: [
        { id: "1", name: "Aparat foto Canon EOS 5D Mark IV", price: 2499, quantity: 1 }
      ]
    },
    {
      id: "#1002", 
      customerName: "Maria Ionescu",
      customerEmail: "maria.ionescu@email.com",
      customerPhone: "+40 733 987 654",
      shippingAddress: "Bd. Unirii nr. 45, București, Sector 4",
      total: 1850,
      status: "În livrare",
      date: "2025-08-22T14:15:00",
      paymentMethod: "Transfer",
      items: [
        { id: "2", name: "Laptop Dell XPS 13", price: 1850, quantity: 1 }
      ]
    },
    {
      id: "#1003",
      customerName: "Vasile Georgescu", 
      customerEmail: "vasile.g@email.com",
      customerPhone: "+40 744 555 777",
      shippingAddress: "Str. Mihai Viteazu nr. 23, Cluj-Napoca",
      total: 650,
      status: "În așteptare",
      date: "2025-08-23T09:45:00",
      paymentMethod: "Cash",
      items: [
        { id: "4", name: "Căști Sony WH-1000XM5", price: 399, quantity: 1 },
        { id: "5", name: "Husă telefon", price: 29, quantity: 1 }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState<Order>({
    id: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    total: 0,
    status: "În așteptare",
    date: "",
    paymentMethod: "",
    notes: "",
    items: []
  });

  const statuses = ["all", "În așteptare", "Confirmat", "În livrare", "Livrat", "Anulat"];

  // Mock loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "În așteptare": 
        return { 
          color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
          icon: Clock,
          iconColor: "text-yellow-600" 
        };
      case "Confirmat": 
        return { 
          color: "bg-blue-100 text-blue-800 border-blue-200", 
          icon: CheckCircle,
          iconColor: "text-blue-600" 
        };
      case "În livrare": 
        return { 
          color: "bg-purple-100 text-purple-800 border-purple-200", 
          icon: Truck,
          iconColor: "text-purple-600" 
        };
      case "Livrat": 
        return { 
          color: "bg-green-100 text-green-800 border-green-200", 
          icon: CheckCircle,
          iconColor: "text-green-600" 
        };
      case "Anulat": 
        return { 
          color: "bg-red-100 text-red-800 border-red-200", 
          icon: XCircle,
          iconColor: "text-red-600" 
        };
      default: 
        return { 
          color: "bg-gray-100 text-gray-800 border-gray-200", 
          icon: Clock,
          iconColor: "text-gray-600" 
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === "În așteptare").length,
      confirmed: orders.filter(o => o.status === "Confirmat").length,
      inDelivery: orders.filter(o => o.status === "În livrare").length,
      delivered: orders.filter(o => o.status === "Livrat").length,
      cancelled: orders.filter(o => o.status === "Anulat").length
    };
  };

  // Handle View Order
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  // Handle Edit Order
  const handleEditOrder = (order: Order) => {
    setEditForm({ ...order });
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  // Handle Save Edit
  const handleSaveEdit = () => {
    setOrders(prev => prev.map(order => 
      order.id === editForm.id ? editForm : order
    ));
    setEditModalOpen(false);
    setSelectedOrder(null);
  };

  // Quick Status Update
  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const stats = getOrderStats();

  return (
    <AdminLayout section="orders">
      <div className="space-y-2 2xs:space-y-3 xs:space-y-4 sm:space-y-6 p-2 2xs:p-3 xs:p-4 sm:p-6">
        {/* Ultra-Responsive Header */}
        <div className="flex flex-col 2xs:flex-row items-start 2xs:items-center justify-between gap-2 2xs:gap-3 xs:gap-4 mb-3 2xs:mb-4 xs:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
              Gestionare Comenzi  
            </h1>
            <p className="text-2xs 2xs:text-xs xs:text-sm text-gray-600 mt-0.5 leading-tight">
              {filteredOrders.length} comenzi găsite
            </p>
          </div>
        </div>

        {/* Ultra-Responsive Stats Overview */}
        <div className="grid grid-cols-2 2xs:grid-cols-3 lg:grid-cols-6 gap-2 2xs:gap-3 xs:gap-4 mb-2 2xs:mb-3 xs:mb-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
            <CardContent className="p-2 2xs:p-3 text-center">
              <div className="text-xs 2xs:text-sm xs:text-base font-bold text-gray-900">{stats.total}</div>
              <div className="text-2xs text-gray-600">Total</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("În așteptare")}>
            <CardContent className="p-2 2xs:p-3 text-center">
              <div className="text-xs 2xs:text-sm xs:text-base font-bold text-gray-900">{stats.pending}</div>
              <div className="text-2xs text-gray-600">Așteptare</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("În livrare")}>
            <CardContent className="p-2 2xs:p-3 text-center">
              <div className="text-xs 2xs:text-sm xs:text-base font-bold text-gray-900">{stats.inDelivery}</div>
              <div className="text-2xs text-gray-600">Livrare</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("Livrat")}>
            <CardContent className="p-2 2xs:p-3 text-center">
              <div className="text-xs 2xs:text-sm xs:text-base font-bold text-gray-900">{stats.delivered}</div>
              <div className="text-2xs text-gray-600">Livrat</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("Confirmat")}>
            <CardContent className="p-2 2xs:p-3 text-center">
              <div className="text-xs 2xs:text-sm xs:text-base font-bold text-gray-900">{stats.confirmed}</div>
              <div className="text-2xs text-gray-600">Confirmat</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-0 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedStatus("Anulat")}>
            <CardContent className="p-2 2xs:p-3 text-center">
              <div className="text-xs 2xs:text-sm xs:text-base font-bold text-gray-900">{stats.cancelled}</div>
              <div className="text-2xs text-gray-600">Anulat</div>
            </CardContent>
          </Card>
        </div>

        {/* Ultra-Responsive Filters */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-white">
          <CardContent className="p-2 2xs:p-3 xs:p-4">
            <div className="flex flex-col 2xs:flex-row gap-2 2xs:gap-3 xs:gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-2 2xs:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 2xs:w-4 2xs:h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Căutare comenzi, clienți sau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 2xs:pl-9 pr-2 2xs:pr-3 py-1.5 2xs:py-2 text-2xs 2xs:text-xs xs:text-sm border border-gray-200 rounded-lg 2xs:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="relative min-w-0 flex-shrink-0">
                <Filter className="absolute left-2 2xs:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 2xs:w-4 2xs:h-4 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-7 2xs:pl-9 pr-6 2xs:pr-8 py-1.5 2xs:py-2 text-2xs 2xs:text-xs xs:text-sm border border-gray-200 rounded-lg 2xs:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="all">Toate statusurile</option>
                  {statuses.slice(1).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {selectedStatus !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStatus("all")}
                  className="text-2xs 2xs:text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Resetează
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ultra-Responsive Orders List */}
        {isLoading ? (
          <div className="space-y-2 2xs:space-y-3">
            {[1,2,3,4].map((i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-2 2xs:p-3 xs:p-4">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-2 2xs:mb-3">
                      <div className="h-3 2xs:h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-2 2xs:h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                    <div className="h-2 2xs:h-3 bg-gray-200 rounded mb-1 2xs:mb-2 w-1/3"></div>
                    <div className="h-2 2xs:h-3 bg-gray-200 rounded w-1/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2 2xs:space-y-3 xs:space-y-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <Card key={order.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white overflow-hidden">
                  <CardContent className="p-2 2xs:p-3 xs:p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 2xs:gap-3 xs:gap-4">
                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col 2xs:flex-row 2xs:items-center justify-between gap-1 2xs:gap-2 mb-1 2xs:mb-2">
                          <div className="flex items-center gap-1 2xs:gap-2">
                            <h3 className="text-xs 2xs:text-sm xs:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => handleViewOrder(order)}>
                              {order.id}
                            </h3>
                            <Badge className={`text-2xs px-1 py-0 flex items-center gap-0.5 ${statusConfig.color}`}>
                              <StatusIcon className="w-2 h-2 2xs:w-2.5 2xs:h-2.5" />
                              {order.status}
                            </Badge>
                            
                            {/* Quick Status Updates */}
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {order.status === "În așteptare" && (
                                <button
                                  onClick={() => handleStatusUpdate(order.id, "Confirmat")}
                                  className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-2xs hover:bg-blue-200 transition-colors"
                                >
                                  Confirmă
                                </button>
                              )}
                              {order.status === "Confirmat" && (
                                <button
                                  onClick={() => handleStatusUpdate(order.id, "În livrare")}
                                  className="px-1 py-0.5 bg-purple-100 text-purple-700 rounded text-2xs hover:bg-purple-200 transition-colors"
                                >
                                  În livrare
                                </button>
                              )}
                              {order.status === "În livrare" && (
                                <button
                                  onClick={() => handleStatusUpdate(order.id, "Livrat")}
                                  className="px-1 py-0.5 bg-green-100 text-green-700 rounded text-2xs hover:bg-green-200 transition-colors"
                                >
                                  Livrat
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 text-2xs 2xs:text-xs text-gray-600">
                            <Calendar className="w-2 h-2 2xs:w-3 2xs:h-3" />
                            <span className="leading-tight">{formatDate(order.date)}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 2xs:grid-cols-2 lg:grid-cols-4 gap-1 2xs:gap-2 text-2xs 2xs:text-xs">
                          <div className="flex items-center gap-1">
                            <User className="w-2 h-2 2xs:w-2.5 2xs:h-2.5 text-gray-400" />
                            <span className="truncate font-medium">{order.customerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Package className="w-2 h-2 2xs:w-2.5 2xs:h-2.5 text-gray-400" />
                            <span className="text-gray-600">{order.items.length} articole</span>
                          </div>
                          
                          <div className="text-gray-600 truncate">
                            <span className="lg:hidden">Email: </span>
                            {order.customerEmail}
                          </div>
                          
                          <div className="text-gray-600">
                            <span className="lg:hidden">Plată: </span>
                            {order.paymentMethod}
                          </div>
                        </div>
                      </div>

                      {/* Order Actions & Total */}
                      <div className="flex items-center justify-between 2xs:justify-end lg:justify-between lg:flex-col lg:items-end gap-2 2xs:gap-3 lg:gap-1 lg:min-w-0 lg:w-32">
                        <div className="text-right">
                          <div className="text-sm 2xs:text-base xs:text-lg font-bold text-gray-900">
                            {order.total.toLocaleString()} RON
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleViewOrder(order)}
                            className="p-1.5 2xs:p-2 bg-gray-50 hover:bg-gray-100 rounded-md 2xs:rounded-lg transition-colors group-hover:bg-blue-50"
                          >
                            <Eye className="w-3 h-3 2xs:w-4 2xs:h-4 text-gray-600 group-hover:text-blue-600" />
                          </button>
                          <button 
                            onClick={() => handleEditOrder(order)}
                            className="p-1.5 2xs:p-2 bg-gray-50 hover:bg-gray-100 rounded-md 2xs:rounded-lg transition-colors group-hover:bg-green-50"
                          >
                            <Edit className="w-3 h-3 2xs:w-4 2xs:h-4 text-gray-600 group-hover:text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 2xs:p-8 xs:p-12 text-center">
              <ShoppingCart className="w-8 h-8 2xs:w-12 2xs:h-12 xs:w-16 xs:h-16 text-gray-400 mx-auto mb-3 2xs:mb-4" />
              <h3 className="text-sm 2xs:text-base xs:text-lg font-medium text-gray-900 mb-1 2xs:mb-2">
                Nicio comandă găsită
              </h3>
              <p className="text-2xs 2xs:text-xs xs:text-sm text-gray-600 mb-3 2xs:mb-4">
                {searchQuery || selectedStatus !== "all" ? 
                  "Încearcă să modifici filtrele de căutare." : 
                  "Nu există comenzi încă."}
              </p>
              {(searchQuery || selectedStatus !== "all") && (
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedStatus("all");
                  }}
                  variant="outline"
                  className="text-2xs 2xs:text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  Resetează filtrele
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* View Order Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Detalii Comandă {selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Informații Client</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Nume:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Telefon:</strong> {selectedOrder.customerPhone}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Detalii Comandă</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Data:</strong> {formatDate(selectedOrder.date)}</p>
                    <p><strong>Plată:</strong> {selectedOrder.paymentMethod}</p>
                    <p className="flex items-center gap-1">
                      <strong>Status:</strong> 
                      <Badge className={`${getStatusConfig(selectedOrder.status).color} text-xs`}>
                        {selectedOrder.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Adresa de Livrare</h3>
                <p className="text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Produse Comandate</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-600">Cantitate: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{item.price.toLocaleString()} RON</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">{selectedOrder.total.toLocaleString()} RON</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Note</h3>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded-lg">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Order Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5 text-blue-600" />
              Editare Comandă {editForm.id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Nume Client</Label>
                <Input
                  id="customerName"
                  value={editForm.customerName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, customerName: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={editForm.customerEmail}
                  onChange={(e) => setEditForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerPhone">Telefon</Label>
                <Input
                  id="customerPhone"
                  value={editForm.customerPhone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="paymentMethod">Metodă Plată</Label>
                <select
                  id="paymentMethod"
                  value={editForm.paymentMethod}
                  onChange={(e) => setEditForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 mt-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Card">Card</option>
                  <option value="Transfer">Transfer Bancar</option>
                  <option value="Cash">Cash la Livrare</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="shippingAddress">Adresă Livrare</Label>
              <Textarea
                id="shippingAddress"
                value={editForm.shippingAddress}
                onChange={(e) => setEditForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={editForm.status}
                onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value as Order['status'] }))}
                className="w-full px-3 py-2 mt-1 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.slice(1).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="notes">Note</Label>
              <Textarea
                id="notes"
                value={editForm.notes || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                className="mt-1"
                rows={2}
                placeholder="Note suplimentare pentru comandă..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditModalOpen(false)}
              >
                <X className="w-4 h-4 mr-1" />
                Anulează
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-1" />
                Salvează
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
