"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { doc, getDoc, updateDoc, collection, query, where, getDocs, limit } from "firebase/firestore";
import { updateProfile, updateEmail } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { RootState, AppDispatch } from "@/lib/store";
import { setUser } from "@/redux/slices/authSlice";
import { serializeUserForRedux } from "@/utils/userSerialization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Package, 
  Settings,
  Save,
  Edit,
  Calendar,
  Shield,
  Award,
  ArrowLeft,
  Home
} from "lucide-react";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  createdAt: Timestamp | string; // Allow both Timestamp and string formats
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  preferences?: {
    newsletter?: boolean;
    notifications?: boolean;
  };
}

interface Order {
  id: string;
  createdAt: Timestamp | string; // Allow both Timestamp and string formats
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export function UserProfileSection() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "România",
    newsletter: false,
    notifications: true
  });

  // Fetch user profile and orders
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const userDoc = await getDoc(doc(db, "users", user!.uid));
      if (userDoc.exists()) {
        const profileData = { uid: userDoc.id, ...userDoc.data() } as UserProfile;
        setUserProfile(profileData);
        
        // Update form data
        setFormData({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          street: profileData.address?.street || "",
          city: profileData.address?.city || "",
          postalCode: profileData.address?.postalCode || "",
          country: profileData.address?.country || "România",
          newsletter: profileData.preferences?.newsletter || false,
          notifications: profileData.preferences?.notifications || true
        });
      }

      // Fetch recent orders (simplified to avoid index requirement)
      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user!.uid),
          limit(5)
        );
        const ordersSnap = await getDocs(ordersQuery);
        let ordersData = ordersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Order[];
        
        // Sort manually by createdAt (client-side sorting to avoid composite index)
        ordersData = ordersData.sort((a, b) => {
          const aTime = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
          const bTime = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
          return bTime.getTime() - aTime.getTime();
        });
        
        setRecentOrders(ordersData);
      } catch (ordersError) {
        console.warn("Could not fetch orders:", ordersError);
        // Continue without orders if there's an issue
        setRecentOrders([]);
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Eroare la încărcarea datelor utilizatorului");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    try {
      setSaving(true);
      setError(null);

      // Update Firestore document
      await updateDoc(doc(db, "users", user.uid), {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        preferences: {
          newsletter: formData.newsletter,
          notifications: formData.notifications
        },
        updatedAt: Timestamp.now()
      });

      // Update Firebase Auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.name
        });

        // Update email if changed
        if (formData.email !== user.email) {
          await updateEmail(auth.currentUser, formData.email);
        }
      }

      // Update Redux state with properly serialized data
      const updatedUserData = serializeUserForRedux({
        ...user,
        name: formData.name,
        email: formData.email
      });
      dispatch(setUser(updatedUserData));

      setEditing(false);
      await fetchUserData(); // Refresh data
      
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const errorMessage = error instanceof Error ? error.message : "Eroare la salvarea profilului";
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const formatDate = (timestamp: Timestamp | string) => {
    const date = timestamp instanceof Timestamp 
      ? timestamp.toDate() 
      : new Date(timestamp);
    
    return date.toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "În așteptare", color: "bg-yellow-100 text-yellow-800" },
      processing: { label: "În procesare", color: "bg-blue-100 text-blue-800" },
      shipped: { label: "Expediat", color: "bg-purple-100 text-purple-800" },
      delivered: { label: "Livrat", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Anulat", color: "bg-red-100 text-red-800" }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge className={`${statusInfo.color} border-0`}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <UserIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profil indisponibil</h3>
        <p className="text-gray-500">Nu am putut încărca informațiile profilului.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-1 xs:p-2 sm:p-4 space-y-2 xs:space-y-4 sm:space-y-6 overflow-hidden">
      {/* Back Navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Înapoi la magazin</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Acasă</span>
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100 overflow-hidden">
        <CardHeader className="p-2 xs:p-4 sm:p-6 lg:p-8 pb-2">
          {/* Large screen layout - horizontal */}
          <div className="hidden lg:flex items-center gap-8">
            <Avatar className="w-32 h-32 border-4 border-white shadow-xl shrink-0">
              <AvatarImage src={auth.currentUser?.photoURL || ""} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold">
                {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {userProfile.name}
                </h1>
                <div className="flex items-center gap-6 text-lg text-gray-600 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Membru din {formatDate(userProfile.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  <Shield className="w-4 h-4 mr-1" />
                  Cont verificat
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <Award className="w-4 h-4 mr-1" />
                  Client fidel
                </Badge>
              </div>
            </div>
          </div>

          {/* Small/Medium screen layout - vertical (existing) */}
          <div className="flex lg:hidden flex-col items-center text-center gap-2 xs:gap-3">
            <Avatar className="w-16 xs:w-20 h-16 xs:h-20 border-2 xs:border-4 border-white shadow-lg shrink-0">
              <AvatarImage src={auth.currentUser?.photoURL || ""} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg xs:text-xl font-bold">
                {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="w-full min-w-0">
              <h1 className="text-base xs:text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words mb-1">
                {userProfile.name}
              </h1>
              <div className="text-xs xs:text-sm text-gray-600 mb-1 break-all">
                <Mail className="w-3 xs:w-4 h-3 xs:h-4 inline mr-1" />
                <span>{userProfile.email}</span>
              </div>
              <div className="text-xs text-gray-500 break-words">
                <Calendar className="w-3 xs:w-4 h-3 xs:h-4 inline mr-1" />
                <span>Membru din {formatDate(userProfile.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col xs:flex-row gap-1 xs:gap-2 w-full xs:w-auto">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1">
                <Shield className="w-2 xs:w-3 h-2 xs:h-3 mr-1" />
                Cont verificat
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                <Award className="w-2 xs:w-3 h-2 xs:h-3 mr-1" />
                {userProfile.role === "admin" ? "Administrator" : "Client"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-1 xs:grid-cols-3 lg:flex lg:justify-center lg:w-auto lg:mx-auto gap-0.5 xs:gap-1 lg:gap-2 h-auto p-0.5 xs:p-1 lg:p-2 lg:bg-white lg:shadow-sm lg:border">
          <TabsTrigger value="profile" className="text-xs xs:text-sm lg:text-base py-2 px-1 xs:px-3 lg:px-6 lg:py-3 rounded-sm xs:rounded lg:rounded-lg lg:min-w-[160px]">
            <UserIcon className="w-3 h-3 xs:w-4 xs:h-4 lg:w-5 lg:h-5 mr-1 xs:mr-2" />
            <span className="hidden xs:inline">Profil Personal</span>
            <span className="xs:hidden">Profil</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="text-xs xs:text-sm lg:text-base py-2 px-1 xs:px-3 lg:px-6 lg:py-3 rounded-sm xs:rounded lg:rounded-lg lg:min-w-[160px]">
            <Package className="w-3 h-3 xs:w-4 xs:h-4 lg:w-5 lg:h-5 mr-1 xs:mr-2" />
            <span className="hidden xs:inline">Comenzile Mele</span>
            <span className="xs:hidden">Comenzi</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs xs:text-sm lg:text-base py-2 px-1 xs:px-3 lg:px-6 lg:py-3 rounded-sm xs:rounded lg:rounded-lg lg:min-w-[160px]">
            <Settings className="w-3 h-3 xs:w-4 xs:h-4 lg:w-5 lg:h-5 mr-1 xs:mr-2" />
            <span className="hidden xs:inline">Setări</span>
            <span className="xs:hidden">Setări</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-3 xs:space-y-6">
          <Card>
            <CardHeader className="p-3 xs:p-4 lg:p-6 flex flex-col xs:flex-row lg:flex-row items-start xs:items-center lg:items-center justify-between gap-2 lg:gap-4">
              <CardTitle className="text-base xs:text-lg lg:text-xl flex items-center gap-1 xs:gap-2">
                <UserIcon className="w-4 xs:w-5 lg:w-6 h-4 xs:h-5 lg:h-6" />
                <span className="text-sm xs:text-base lg:text-lg">Informații Personale</span>
              </CardTitle>
              <Button
                variant={editing ? "outline" : "default"}
                size="sm"
                onClick={() => editing ? setEditing(false) : setEditing(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs xs:text-sm lg:text-base px-2 xs:px-3 lg:px-4 py-1 xs:py-2 lg:py-3 h-auto lg:min-w-[120px]"
              >
                <Edit className="w-3 xs:w-4 lg:w-5 h-3 xs:h-4 lg:h-5 mr-1 lg:mr-2" />
                {editing ? "Anulează" : "Editează"}
              </Button>
            </CardHeader>
            <CardContent className="p-3 xs:p-4 lg:p-6 space-y-3 xs:space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="name" className="text-xs xs:text-sm lg:text-base font-medium">Nume complet</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="mt-1 text-xs xs:text-sm lg:text-base h-8 xs:h-10 lg:h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs xs:text-sm lg:text-base font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editing}
                    className="mt-1 text-xs xs:text-sm lg:text-base h-8 xs:h-10 lg:h-12 break-all"
                  />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="phone" className="text-xs xs:text-sm lg:text-base font-medium">Telefon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editing}
                    placeholder="+40 7XX XXX XXX"
                    className="mt-1 text-xs xs:text-sm lg:text-base h-8 xs:h-10 lg:h-12"
                  />
                </div>
              </div>

              <Separator className="my-3 xs:my-4 lg:my-6" />

              <div className="space-y-3 xs:space-y-4 lg:space-y-6">
                <h4 className="text-sm xs:text-base lg:text-lg font-medium flex items-center gap-1 xs:gap-2">
                  <MapPin className="w-3 xs:w-4 lg:w-5 h-3 xs:h-4 lg:h-5" />
                  Adresă de livrare
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 lg:gap-6">
                  <div className="lg:col-span-2">
                    <Label htmlFor="street" className="text-xs xs:text-sm lg:text-base font-medium">Strada</Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="mt-1 text-xs xs:text-sm lg:text-base h-8 xs:h-10 lg:h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-xs xs:text-sm lg:text-base font-medium">Oraș</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="mt-1 text-xs xs:text-sm lg:text-base h-8 xs:h-10 lg:h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-xs xs:text-sm lg:text-base font-medium">Cod poștal</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="mt-1 text-xs xs:text-sm lg:text-base h-8 xs:h-10 lg:h-12"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <Label htmlFor="country" className="text-xs xs:text-sm lg:text-base font-medium">Țară</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="mt-1 text-xs xs:text-sm lg:text-base h-8 xs:h-10 lg:h-12"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-2 pt-3 xs:pt-4 lg:pt-6 lg:justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs xs:text-sm lg:text-base px-3 xs:px-4 lg:px-6 py-2 lg:py-3 h-auto flex-1 xs:flex-none lg:min-w-[200px]"
                  >
                    <Save className="w-3 xs:w-4 lg:w-5 h-3 xs:h-4 lg:h-5 mr-1 lg:mr-2" />
                    <span className="hidden xs:inline">{saving ? "Salvez..." : "Salvează modificările"}</span>
                    <span className="xs:hidden">{saving ? "Salvez..." : "Salvează"}</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-3 xs:space-y-6">
          <Card>
            <CardHeader className="p-3 xs:p-4 lg:p-6">
              <CardTitle className="text-base xs:text-lg lg:text-xl flex items-center gap-1 xs:gap-2">
                <Package className="w-4 xs:w-5 lg:w-6 h-4 xs:h-5 lg:h-6" />
                <span className="text-sm xs:text-base lg:text-lg">Comenzile Recente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 xs:p-4 lg:p-6">
              {recentOrders.length === 0 ? (
                <div className="text-center py-6 xs:py-8 lg:py-12">
                  <Package className="w-8 xs:w-12 lg:w-16 h-8 xs:h-12 lg:h-16 mx-auto text-gray-400 mb-2 xs:mb-4 lg:mb-6" />
                  <p className="text-gray-500 text-sm xs:text-base lg:text-lg">Nu aveți comenzi încă</p>
                  <p className="text-gray-400 text-xs xs:text-sm lg:text-base mt-2">Comenzile dvs. vor apărea aici după prima achiziție</p>
                </div>
              ) : (
                <div className="space-y-2 xs:space-y-4 lg:space-y-6">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-2 xs:p-3 lg:p-6 hover:bg-gray-50 transition-colors duration-200 overflow-hidden lg:shadow-sm hover:lg:shadow-md">
                      <div className="space-y-1 xs:space-y-2 lg:space-y-4">
                        <div className="flex flex-col xs:flex-row lg:flex-row lg:items-center justify-between gap-1 xs:gap-2 lg:gap-4">
                          <p className="font-medium text-xs xs:text-sm lg:text-base break-words">Comanda #{order.id.slice(-8)}</p>
                          <div className="text-left xs:text-right shrink-0">
                            {getStatusBadge(order.status)}
                          </div>
                        </div>
                        <div className="flex flex-col xs:flex-row lg:flex-row lg:items-center justify-between gap-1 xs:gap-2 lg:gap-4">
                          <p className="text-xs xs:text-sm lg:text-base text-gray-500 break-words">
                            {formatDate(order.createdAt)} • {order.items?.length || 0} produse
                          </p>
                          <p className="font-bold text-sm xs:text-base lg:text-lg text-left xs:text-right">
                            {order.total.toLocaleString("ro-RO", {
                              style: "currency",
                              currency: "RON"
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-3 xs:space-y-6">
          <Card>
            <CardHeader className="p-3 xs:p-4 lg:p-6">
              <CardTitle className="text-base xs:text-lg lg:text-xl flex items-center gap-1 xs:gap-2">
                <Settings className="w-4 xs:w-5 lg:w-6 h-4 xs:h-5 lg:h-6" />
                <span className="text-sm xs:text-base lg:text-lg">Preferințe Cont</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 xs:p-4 lg:p-6 space-y-3 xs:space-y-4 lg:space-y-6">
              <div className="flex flex-col xs:flex-row lg:flex-row lg:items-center justify-between gap-2 xs:gap-4 lg:gap-6 lg:p-4 lg:border lg:rounded-lg lg:hover:bg-gray-50 lg:transition-colors lg:duration-200">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs xs:text-sm lg:text-base break-words">Newsletter</p>
                  <p className="text-xs xs:text-sm lg:text-base text-gray-500 break-words">Primește oferte și noutăți pe email</p>
                </div>
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0 w-4 h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6"
                />
              </div>
              <Separator className="my-2 xs:my-3 lg:my-4" />
              <div className="flex flex-col xs:flex-row lg:flex-row lg:items-center justify-between gap-2 xs:gap-4 lg:gap-6 lg:p-4 lg:border lg:rounded-lg lg:hover:bg-gray-50 lg:transition-colors lg:duration-200">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs xs:text-sm lg:text-base break-words">Notificări</p>
                  <p className="text-xs xs:text-sm lg:text-base text-gray-500 break-words">Primește notificări despre comenzi</p>
                </div>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleInputChange}
                  disabled={!editing}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 shrink-0 w-4 h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
