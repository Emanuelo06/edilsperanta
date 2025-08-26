"use client";
import { useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { ShoppingCart, User, Menu, MapPin, Phone, X, Search } from "lucide-react";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RootState } from "@/lib/store";
import { useAuthListener } from "@/hooks/useAuthListener";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Initialize auth listener
  useAuthListener();
  
  // Get user from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-50 via-white to-purple-50 shadow-lg border-b-2 border-blue-200">
      {/* Top bar - Contact info - Hidden on 250px */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-1 xs:py-2 text-xs hidden sm:block">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6 text-white">
            <div className="flex items-center gap-1 sm:gap-2 hover:bg-white/20 px-2 py-1 rounded-md transition-colors">
              <Phone className="w-3 h-3" />
              <span className="hidden xs:inline">0800.123.456</span>
              <span className="xs:hidden">0800.123.456</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 hover:bg-white/20 px-2 py-1 rounded-md transition-colors">
              <MapPin className="w-3 h-3" />
              <span className="hidden md:inline">Livrare în toată România</span>
              <span className="md:hidden">Livrare România</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white">
            <Link href="/stores" className="hover:bg-white/20 px-3 py-1 rounded-md transition-colors font-medium">Magazine</Link>
            <Link href="/help" className="hover:bg-white/20 px-3 py-1 rounded-md transition-colors font-medium">Ajutor</Link>
          </div>
        </div>
      </div>

      {/* Main header - 250px optimized */}
      <div className="py-2 xs:py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
          
          {/* Mobile Menu Button - Left side on mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="sm:hidden p-1 h-8 w-8"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 xs:gap-2 sm:gap-3 text-primary font-bold text-lg xs:text-xl sm:text-2xl lg:text-3xl flex-shrink-0">
            <Image src="/globe.svg" alt="Logo" width={32} height={32} className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10" priority />
            <span className="hidden xs:block sm:inline">EdilSperanța</span>
            <span className="xs:hidden text-sm">ES</span>
          </Link>

          {/* Desktop SearchBar - Hidden on mobile */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          {/* Mobile Search Button - Only visible on mobile */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="sm:hidden p-1 h-8 w-8"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            aria-label="Toggle search"
          >
            <Search className="w-4 h-4" />
          </Button>

          {/* Right Actions */}
          <div className="flex items-center gap-1 xs:gap-2 lg:gap-3">
            {/* Cart with badge */}
            <Link href="/cart" className="relative group p-1 xs:p-1.5 sm:p-2 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 rounded-lg transition-all duration-300">
              <ShoppingCart className="w-5 h-5 xs:w-6 xs:h-6 lg:w-7 lg:h-7 text-gray-700 group-hover:text-blue-600 transition-colors" />
              <Badge className="absolute -top-0.5 -right-0.5 xs:-top-1 xs:-right-1 h-4 w-4 xs:h-5 xs:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold shadow-lg">
                3
              </Badge>
              <span className="sr-only">Coș de cumpărături</span>
            </Link>

            {/* Account */}
            <Link 
              href={user ? "/account" : "/auth/login"} 
              className="group p-1 xs:p-1.5 sm:p-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 rounded-lg transition-all duration-300"
            >
              <User className="w-5 h-5 xs:w-6 xs:h-6 lg:w-7 lg:h-7 text-gray-700 group-hover:text-purple-600 transition-colors" />
              <span className="sr-only">{user ? "Contul meu" : "Conectează-te"}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar - Collapsible */}
        {isMobileSearchOpen && (
          <div className="sm:hidden px-2 pb-2 border-t border-gray-100 mt-2 pt-2">
            <form className="flex items-center w-full bg-white rounded-lg border-2 border-gray-200 focus-within:border-primary transition-colors overflow-hidden">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Caută..."
                  className="w-full pl-7 pr-2 py-2 border-none bg-transparent focus:ring-0 text-sm placeholder:text-gray-500"
                  aria-label="Caută produse"
                />
              </div>
              <Button type="submit" className="h-full px-3 rounded-none bg-primary hover:bg-primary/90 text-white font-semibold text-xs">
                Caută
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-purple-50 border-t border-blue-200 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-4 md:gap-6 lg:gap-8 py-3 text-xs sm:text-sm overflow-x-auto">
            <Link href="/categories/materiale-constructii" className="whitespace-nowrap hover:text-blue-600 font-medium px-3 py-2 rounded-lg hover:bg-blue-100 transition-all duration-300">
              <span className="hidden lg:inline">Materiale construcții</span>
              <span className="lg:hidden">Materiale</span>
            </Link>
            <Link href="/categories/unelte" className="whitespace-nowrap hover:text-purple-600 font-medium px-3 py-2 rounded-lg hover:bg-purple-100 transition-all duration-300">
              Unelte
            </Link>
            <Link href="/categories/gradina" className="whitespace-nowrap hover:text-green-600 font-medium px-3 py-2 rounded-lg hover:bg-green-100 transition-all duration-300">
              Grădină
            </Link>
            <Link href="/categories/instalatii" className="whitespace-nowrap hover:text-orange-600 font-medium px-3 py-2 rounded-lg hover:bg-orange-100 transition-all duration-300">
              <span className="hidden md:inline">Instalații</span>
              <span className="md:hidden">Instal.</span>
            </Link>
            <Link href="/categories/decoratiuni" className="whitespace-nowrap hover:text-pink-600 font-medium px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-300">
              <span className="hidden md:inline">Decorațiuni</span>
              <span className="md:hidden">Decor</span>
            </Link>
            <Link href="/categories/mobilier" className="whitespace-nowrap hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-100 transition-all duration-300">
              Mobilier
            </Link>
            <Link href="/offers" className="whitespace-nowrap bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 font-bold px-4 py-2 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
              🔥 <span className="hidden md:inline">Oferte</span>
              <span className="md:hidden">Sale</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
          <nav className="px-2 py-3 space-y-1">
            {/* Categories */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Categorii</h3>
              <Link 
                href="/categories/materiale-constructii" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Materiale construcții
              </Link>
              <Link 
                href="/categories/unelte" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Unelte
              </Link>
              <Link 
                href="/categories/gradina" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Grădină
              </Link>
              <Link 
                href="/categories/instalatii" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Instalații
              </Link>
              <Link 
                href="/categories/decoratiuni" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Decorațiuni
              </Link>
              <Link 
                href="/categories/mobilier" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Mobilier
              </Link>
              <Link 
                href="/offers" 
                className="block px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔥 Oferte speciale
              </Link>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Account Links */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Cont</h3>
              <Link 
                href={user ? "/account" : "/auth/login"}
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4 inline mr-2" />
                {user ? "Contul meu" : "Conectează-te"}
              </Link>
              <Link 
                href="/cart" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Coșul meu
              </Link>
            </div>

            {/* Separator */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Additional Links */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">Ajutor</h3>
              <Link 
                href="/stores" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                Magazine
              </Link>
              <Link 
                href="/help" 
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Ajutor
              </Link>
            </div>

            {/* Contact info at bottom */}
            <div className="pt-3 border-t border-gray-200 mt-3">
              <div className="px-3 py-2 text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span>0800.123.456</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>Livrare în toată România</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

