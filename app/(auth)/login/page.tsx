"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // TODO: Implement actual login logic
      
      // Simulate login success
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push("/account");
    } catch (error) {
      setError("Eroare la autentificare. Te rugăm să încerci din nou.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link href="/" className="inline-flex items-center gap-1 sm:gap-2 text-primary hover:text-primary/80 mb-3 sm:mb-6 transition-colors text-sm">
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Înapoi la magazin</span>
          <span className="xs:hidden">Înapoi</span>
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-1 sm:space-y-2 pb-3 sm:pb-6">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              <span className="hidden xs:inline">Bine ai revenit!</span>
              <span className="xs:hidden">Salut!</span>
            </h1>
            <p className="text-xs sm:text-base text-gray-600">
              <span className="hidden xs:inline">Conectează-te la contul tău EdilSperanța</span>
              <span className="xs:hidden">Conectează-te</span>
            </p>
          </CardHeader>
          
          <CardContent className="px-3 pb-4 space-y-3">
            {error && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Parola"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-1.5">
                  <input type="checkbox" className="rounded border-gray-300 w-3 h-3" />
                  <span className="text-gray-600">Conectat</span>
                </label>
                <Link href="/forgot-password" className="text-primary hover:text-primary/80 transition-colors">
                  Parolă uitată?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-8 bg-primary hover:bg-primary/90 text-white font-semibold text-xs"
                disabled={loading}
              >
                {loading ? "Se conectează..." : "Conectează-te"}
              </Button>
            </form>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">sau</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full h-8 text-xs" type="button">
                <svg className="w-3 h-3 mr-1.5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button variant="outline" className="w-full h-8 text-xs" type="button">
                <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </Button>
            </div>

            <div className="text-center text-xs text-gray-600 pt-2 border-t">
              Fără cont?{" "}
              <Link href="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Înregistrează-te
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Ultra compact trust indicators */}
        <div className="mt-3 text-center text-xs text-gray-500 space-y-1 leading-tight">
          <p>🔒 SSL protejat</p>
          <p>✅ 100.000+ clienți</p>
        </div>
      </div>
    </div>
  );
}
