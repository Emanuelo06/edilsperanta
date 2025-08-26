"use client";

import AdminLayout from "../AdminLayout";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Store, 
  Globe, 
  CreditCard, 
  Truck, 
  Save,
  Settings as SettingsIcon
} from "lucide-react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [shopSettings, setShopSettings] = useState({
    // Basic Info
    shopName: "EdilSperanta",
    shopDescription: "Materiale de construcții de calitate superioară",
    shopEmail: "contact@edilsperanta.ro",
    shopPhone: "+40 123 456 789",
    shopAddress: "Strada Principală nr. 123, București",
    
    // Business Settings
    currency: "RON",
    language: "ro",
    timezone: "Europe/Bucharest",
    vatRate: 19,
    freeShippingThreshold: 250,
    standardShippingCost: 25,
    lowStockThreshold: 10,
    
    // Feature Toggles
    enableRegistration: true,
    enableGuestCheckout: true,
    enableReviews: true,
    enableWishlist: true,
    enableNewsletter: true,
    
    // Notifications
    emailNotifications: true,
    orderNotifications: true,
    stockNotifications: true,
    
    // SEO
    metaTitle: "EdilSperanta - Materiale de construcții de calitate",
    metaDescription: "Materiale de construcții de cea mai bună calitate pentru proiectele tale. Livrare rapidă în toată România.",
    googleAnalyticsId: "",
    facebookPixelId: ""
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setShopSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveStatus('saving');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for persistence (client-side only)
      if (typeof window !== 'undefined') {
        localStorage.setItem('shopSettings', JSON.stringify(shopSettings));
      }
      
      setSaveStatus('saved');
      
      // Reset save status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      
      // Reset error status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('shopSettings');
      if (savedSettings) {
        try {
          setShopSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error('Failed to load saved settings:', error);
        }
      }
    }
  }, []);

  return (
    <AdminLayout section="settings">
      <div className="space-y-2 2xs:space-y-3 xs:space-y-4 sm:space-y-6 p-2 2xs:p-3 xs:p-4 sm:p-6">
        {/* Ultra-Responsive Enhanced Header */}
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 2xs:gap-3 xs:gap-4 mb-4 2xs:mb-6 xs:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg 2xs:text-xl xs:text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent truncate">
              Configurări Magazin
            </h1>
            <p className="text-2xs 2xs:text-xs xs:text-sm text-gray-600 mt-0.5 xs:mt-1 leading-tight">
              Personalizează setările magazinului tău
            </p>
          </div>
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="w-full xs:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 px-3 2xs:px-4 xs:px-6 py-1.5 2xs:py-2 rounded-lg 2xs:rounded-xl text-2xs 2xs:text-xs xs:text-sm font-medium"
          >
            <Save className="w-3 h-3 2xs:w-4 2xs:h-4 mr-1 2xs:mr-2" />
            {loading ? "Se salvează..." : "Salvează"}
          </Button>
        </div>

        {/* Ultra-Responsive Enhanced Tabs */}
        <div className="space-y-2 2xs:space-y-3 xs:space-y-4">
          <Tabs defaultValue="general" className="w-full">
            {/* Ultra-Responsive Tab Navigation */}
            <div className="bg-white rounded-lg 2xs:rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-3 2xs:mb-4 xs:mb-6">
              <TabsList className="w-full h-auto bg-transparent p-1 2xs:p-2 xs:p-3 grid grid-cols-2 2xs:grid-cols-2 sm:grid-cols-4 gap-1 2xs:gap-2">
                <TabsTrigger 
                  value="general" 
                  className="relative flex-col 2xs:flex-row items-center justify-center 2xs:justify-start gap-1 2xs:gap-2 p-1.5 2xs:p-2 xs:p-3 rounded-md 2xs:rounded-lg text-2xs 2xs:text-xs xs:text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm border-0 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-4 h-4 2xs:w-5 2xs:h-5 xs:w-6 xs:h-6 rounded-md 2xs:rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Store className="w-2 h-2 2xs:w-2.5 2xs:h-2.5 xs:w-3 xs:h-3 text-blue-600" />
                  </div>
                  <div className="text-center 2xs:text-left min-w-0 flex-1">
                    <span className="block font-semibold truncate text-2xs 2xs:text-xs">General</span>
                    <span className="text-2xs text-gray-500 hidden sm:block">Info bază</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="business" 
                  className="relative flex-col 2xs:flex-row items-center justify-center 2xs:justify-start gap-1 2xs:gap-2 p-1.5 2xs:p-2 xs:p-3 rounded-md 2xs:rounded-lg text-2xs 2xs:text-xs xs:text-sm font-medium data-[state=active]:bg-green-50 data-[state=active]:text-green-700 data-[state=active]:shadow-sm border-0 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-4 h-4 2xs:w-5 2xs:h-5 xs:w-6 xs:h-6 rounded-md 2xs:rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-2 h-2 2xs:w-2.5 2xs:h-2.5 xs:w-3 xs:h-3 text-green-600" />
                  </div>
                  <div className="text-center 2xs:text-left min-w-0 flex-1">
                    <span className="block font-semibold truncate text-2xs 2xs:text-xs">Business</span>
                    <span className="text-2xs text-gray-500 hidden sm:block">Monetizare</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="features" 
                  className="relative flex-col 2xs:flex-row items-center justify-center 2xs:justify-start gap-1 2xs:gap-2 p-1.5 2xs:p-2 xs:p-3 rounded-md 2xs:rounded-lg text-2xs 2xs:text-xs xs:text-sm font-medium data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 data-[state=active]:shadow-sm border-0 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-4 h-4 2xs:w-5 2xs:h-5 xs:w-6 xs:h-6 rounded-md 2xs:rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <SettingsIcon className="w-2 h-2 2xs:w-2.5 2xs:h-2.5 xs:w-3 xs:h-3 text-purple-600" />
                  </div>
                  <div className="text-center 2xs:text-left min-w-0 flex-1">
                    <span className="block font-semibold truncate text-2xs 2xs:text-xs">Funcții</span>
                    <span className="text-2xs text-gray-500 hidden sm:block">Features</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="seo" 
                  className="relative flex-col 2xs:flex-row items-center justify-center 2xs:justify-start gap-1 2xs:gap-2 p-1.5 2xs:p-2 xs:p-3 rounded-md 2xs:rounded-lg text-2xs 2xs:text-xs xs:text-sm font-medium data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 data-[state=active]:shadow-sm border-0 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-4 h-4 2xs:w-5 2xs:h-5 xs:w-6 xs:h-6 rounded-md 2xs:rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-2 h-2 2xs:w-2.5 2xs:h-2.5 xs:w-3 xs:h-3 text-orange-600" />
                  </div>
                  <div className="text-center 2xs:text-left min-w-0 flex-1">
                    <span className="block font-semibold truncate text-2xs 2xs:text-xs">SEO</span>
                    <span className="text-2xs text-gray-500 hidden sm:block">Optimizare</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* General Settings Tab */}
            <TabsContent value="general" className="space-y-2 2xs:space-y-3 xs:space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="p-2 2xs:p-3 xs:p-4 lg:p-6 pb-2 2xs:pb-3 xs:pb-4">
                  <CardTitle className="text-xs 2xs:text-sm xs:text-base lg:text-lg flex items-center gap-1 2xs:gap-2">
                    <Store className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 lg:w-6 lg:h-6 text-blue-600" />
                    <span className="truncate">Informații de bază</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 2xs:p-3 xs:p-4 lg:p-6 pt-0 space-y-2 2xs:space-y-3 xs:space-y-4">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 2xs:gap-3 xs:gap-4">
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label htmlFor="shopName" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                        Numele magazinului *
                      </Label>
                      <Input
                        id="shopName"
                        value={shopSettings.shopName}
                        onChange={(e) => handleInputChange("shopName", e.target.value)}
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="EdilSperanta"
                      />
                    </div>
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label htmlFor="shopEmail" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                        Email de contact *
                      </Label>
                      <Input
                        id="shopEmail"
                        type="email"
                        value={shopSettings.shopEmail}
                        onChange={(e) => handleInputChange("shopEmail", e.target.value)}
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="contact@edilsperanta.ro"
                      />
                    </div>
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label htmlFor="shopPhone" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                        Telefon
                      </Label>
                      <Input
                        id="shopPhone"
                        value={shopSettings.shopPhone}
                        onChange={(e) => handleInputChange("shopPhone", e.target.value)}
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="+40 123 456 789"
                      />
                    </div>
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label htmlFor="shopAddress" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                        Adresa
                      </Label>
                      <Input
                        id="shopAddress"
                        value={shopSettings.shopAddress}
                        onChange={(e) => handleInputChange("shopAddress", e.target.value)}
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Strada Principală nr. 123, București"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 2xs:space-y-1.5">
                    <Label htmlFor="shopDescription" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                      Descrierea magazinului
                    </Label>
                    <Textarea
                      id="shopDescription"
                      value={shopSettings.shopDescription}
                      onChange={(e) => handleInputChange("shopDescription", e.target.value)}
                      rows={2}
                      className="text-2xs 2xs:text-xs xs:text-sm min-h-12 2xs:min-h-16 xs:min-h-20 p-2 2xs:p-3 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      placeholder="Descrierea completă a magazinului tău..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Settings Tab */}
            <TabsContent value="business" className="space-y-2 2xs:space-y-3 xs:space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 2xs:gap-3 xs:space-y-4">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-2 2xs:p-3 xs:p-4 pb-2 2xs:pb-3 xs:pb-4">
                    <CardTitle className="text-xs 2xs:text-sm xs:text-base flex items-center gap-1 2xs:gap-2">
                      <CreditCard className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-green-600" />
                      <span className="truncate">Monedă & Locație</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 2xs:p-3 xs:p-4 pt-0 space-y-2 2xs:space-y-3">
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">Moneda</Label>
                      <select 
                        value={shopSettings.currency}
                        onChange={(e) => handleInputChange("currency", e.target.value)}
                        className="w-full text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border border-gray-200 rounded-md focus:border-green-500 focus:ring-green-500 bg-white"
                      >
                        <option value="RON">RON - Leu românesc</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="USD">USD - Dolar american</option>
                      </select>
                    </div>
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">TVA (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={shopSettings.vatRate}
                        onChange={(e) => handleInputChange("vatRate", parseInt(e.target.value) || 0)}
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="19"
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-sm">
                  <CardHeader className="p-2 2xs:p-3 xs:p-4 pb-2 2xs:pb-3 xs:pb-4">
                    <CardTitle className="text-xs 2xs:text-sm xs:text-base flex items-center gap-1 2xs:gap-2">
                      <Truck className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-green-600" />
                      <span className="truncate">Transport</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 2xs:p-3 xs:p-4 pt-0 space-y-2 2xs:space-y-3">
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">Transport gratuit (RON)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={shopSettings.freeShippingThreshold}
                        onChange={(e) => handleInputChange("freeShippingThreshold", parseInt(e.target.value) || 0)}
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="250"
                      />
                    </div>
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">Cost transport (RON)</Label>
                      <Input
                        type="number"
                        min="0"
                        value={shopSettings.standardShippingCost}
                        onChange={(e) => handleInputChange("standardShippingCost", parseInt(e.target.value) || 0)}
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        placeholder="25"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Settings Tab */}
            <TabsContent value="features" className="space-y-2 2xs:space-y-3 xs:space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="p-2 2xs:p-3 xs:p-4 pb-2 2xs:pb-3 xs:pb-4">
                  <CardTitle className="text-xs 2xs:text-sm xs:text-base flex items-center gap-1 2xs:gap-2">
                    <SettingsIcon className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-purple-600" />
                    <span className="truncate">Caracteristici disponibile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 2xs:p-3 xs:p-4 pt-0 space-y-2 2xs:space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 2xs:gap-3">
                    {[
                      { key: "enableRegistration", label: "Înregistrare utilizatori", desc: "Permite crearea de conturi noi" },
                      { key: "enableGuestCheckout", label: "Cumpără ca invitat", desc: "Permite comenzi fără cont" },
                      { key: "enableReviews", label: "Recenzii produse", desc: "Clienții pot lăsa recenzii" },
                      { key: "enableWishlist", label: "Listă de dorințe", desc: "Salvează produse favorite" },
                      { key: "enableNewsletter", label: "Newsletter", desc: "Abonare la newsletter" },
                      { key: "emailNotifications", label: "Notificări email", desc: "Alerte prin email" }
                    ].map((feature) => (
                      <div key={feature.key} className="flex items-start gap-2 2xs:gap-3 p-2 2xs:p-3 rounded-lg border border-gray-100 hover:border-purple-200 transition-colors">
                        <Switch
                          id={feature.key}
                          checked={shopSettings[feature.key as keyof typeof shopSettings] as boolean}
                          onCheckedChange={(checked) => handleInputChange(feature.key, checked)}
                          className="mt-0.5 data-[state=checked]:bg-purple-600 scale-75 2xs:scale-90 xs:scale-100"
                        />
                        <div className="flex-1 min-w-0">
                          <label 
                            htmlFor={feature.key}
                            className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-900 cursor-pointer block leading-tight"
                          >
                            {feature.label}
                          </label>
                          <p className="text-2xs text-gray-500 mt-0.5 leading-tight">
                            {feature.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Settings Tab */}
            <TabsContent value="seo" className="space-y-2 2xs:space-y-3 xs:space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="p-2 2xs:p-3 xs:p-4 pb-2 2xs:pb-3 xs:pb-4">
                  <CardTitle className="text-xs 2xs:text-sm xs:text-base flex items-center gap-1 2xs:gap-2">
                    <Globe className="w-3 h-3 2xs:w-4 2xs:h-4 xs:w-5 xs:h-5 text-orange-600" />
                    <span className="truncate">Optimizare SEO</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-2 2xs:p-3 xs:p-4 pt-0 space-y-2 2xs:space-y-3">
                  <div className="space-y-1 2xs:space-y-1.5">
                    <Label htmlFor="metaTitle" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                      Titlu Meta (SEO)
                    </Label>
                    <Input
                      id="metaTitle"
                      value={shopSettings.metaTitle}
                      onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                      className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      placeholder="EdilSperanta - Materiale de construcții de calitate"
                      maxLength={60}
                    />
                    <p className="text-2xs text-gray-500">
                      {shopSettings.metaTitle.length}/60 caractere
                    </p>
                  </div>
                  <div className="space-y-1 2xs:space-y-1.5">
                    <Label htmlFor="metaDescription" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                      Descriere Meta (SEO)
                    </Label>
                    <Textarea
                      id="metaDescription"
                      value={shopSettings.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                      rows={2}
                      className="text-2xs 2xs:text-xs xs:text-sm min-h-12 2xs:min-h-16 p-2 2xs:p-3 border-gray-200 focus:border-orange-500 focus:ring-orange-500 resize-none"
                      placeholder="Descrierea magazinului pentru motoarele de căutare..."
                      maxLength={160}
                    />
                    <p className="text-2xs text-gray-500">
                      {shopSettings.metaDescription.length}/160 caractere
                    </p>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 2xs:gap-3">
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label htmlFor="googleAnalytics" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                        Google Analytics ID
                      </Label>
                      <Input
                        id="googleAnalytics"
                        value={shopSettings.googleAnalyticsId}
                        onChange={(e) => handleInputChange("googleAnalyticsId", e.target.value)}
                        placeholder="GA-XXXXXXXXX"
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                    <div className="space-y-1 2xs:space-y-1.5">
                      <Label htmlFor="facebookPixel" className="text-2xs 2xs:text-xs xs:text-sm font-medium text-gray-700">
                        Facebook Pixel ID
                      </Label>
                      <Input
                        id="facebookPixel"
                        value={shopSettings.facebookPixelId}
                        onChange={(e) => handleInputChange("facebookPixelId", e.target.value)}
                        placeholder="123456789"
                        className="text-2xs 2xs:text-xs xs:text-sm h-6 2xs:h-7 xs:h-8 lg:h-10 px-2 2xs:px-3 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mobile Save Button - Sticky at bottom */}
        <div className="sticky bottom-2 2xs:bottom-3 xs:bottom-4 bg-white p-2 2xs:p-3 xs:p-4 rounded-lg border shadow-lg sm:hidden">
          <Button 
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-2xs 2xs:text-xs xs:text-sm h-8 2xs:h-9 xs:h-10"
          >
            <Save className="w-3 h-3 2xs:w-4 2xs:h-4 mr-1 2xs:mr-2" />
            {saveStatus === 'saving' ? "Salvez..." : 
             saveStatus === 'saved' ? "✓ Salvat!" : 
             saveStatus === 'error' ? "✗ Eroare" : 
             "Salvează toate modificările"}
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
