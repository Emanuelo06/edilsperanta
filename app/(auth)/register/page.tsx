"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu se potrivesc");
      setLoading(false);
      return;
    }
    
    if (!acceptTerms) {
      setError("Trebuie să accepti termenii și condițiile");
      setLoading(false);
      return;
    }
    
    // TODO: Implement actual register logic
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      {/* Ultra compact header - 250px first */}
      <div className="mb-3">
        <Link href="/" className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm transition-colors">
          <ArrowLeft className="w-3 h-3" />
          <span className="text-xs">Înapoi</span>
        </Link>
      </div>

      <div className="max-w-sm mx-auto">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-3 px-3 pt-4">
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Cont nou</h1>
            <p className="text-xs text-gray-600 leading-tight px-1">Înregistrează-te la EdilSperanța</p>
          </CardHeader>
          
          <CardContent className="px-3 pb-4 space-y-3">
            {error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name fields - stacked on 250px */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-xs font-medium">Prenume</Label>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Ion"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-7 h-8 text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-xs font-medium">Nume</Label>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Popescu"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="pl-7 h-8 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-7 h-8 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-medium">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0722 123 456"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-7 h-8 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-medium">Parola</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minim 8 caractere"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-7 pr-8 h-8 text-xs"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-xs font-medium">Confirmă</Label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repetă parola"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-7 pr-8 h-8 text-xs"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Ultra compact terms checkbox */}
              <div className="flex items-start space-x-2 text-xs">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 mt-0.5 w-3 h-3" 
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span className="text-gray-600 leading-tight">
                  Accept{" "}
                  <Link href="/terms" className="text-primary hover:text-primary/80 underline">
                    termenii
                  </Link>
                  {" "}și{" "}
                  <Link href="/privacy" className="text-primary hover:text-primary/80 underline">
                    confidențialitatea
                  </Link>
                </span>
              </div>

              <Button 
                type="submit" 
                className="w-full h-8 bg-primary hover:bg-primary/90 text-white font-semibold text-xs"
                disabled={loading}
              >
                {loading ? "Se creează..." : "Creează cont"}
              </Button>
            </form>

            <div className="text-center text-xs text-gray-600 pt-2 border-t">
              Ai cont?{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Conectează-te
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ultra compact benefits */}
        <div className="mt-3 bg-white rounded-lg p-2 shadow-sm">
          <h3 className="font-semibold text-xs mb-2 text-gray-900">Beneficii cont:</h3>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-start gap-1">
              <span className="text-green-500 text-xs mt-0.5">✓</span>
              <span className="leading-tight">Livrare gratuită peste 500 RON</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-green-500 text-xs mt-0.5">✓</span>
              <span className="leading-tight">Oferte exclusive</span>
            </div>
            <div className="flex items-start gap-1">
              <span className="text-green-500 text-xs mt-0.5">✓</span>
              <span className="leading-tight">Istoric comenzi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
