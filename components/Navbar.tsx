"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  title: string;
  showBackButton?: boolean;
  backUrl?: string;
  className?: string;
}

export default function Navbar({ title, showBackButton = false, backUrl = "/", className = "" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Left: Back button or Menu */}
          <div className="flex items-center gap-2">
            {showBackButton ? (
              <Link href={backUrl} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
                <span className="sr-only">Înapoi</span>
              </Link>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="sm:hidden p-1 h-8 w-8"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            )}
          </div>

          {/* Center: Title */}
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 flex-1 text-center sm:text-left truncate px-2">
            {title}
          </h1>

          {/* Right: Home button */}
          <Link href="/" className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-5 h-5 text-gray-700" />
            <span className="sr-only">Acasă</span>
          </Link>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && !showBackButton && (
          <div className="sm:hidden mt-3 pt-3 border-t border-gray-200">
            <div className="space-y-1">
              <Link
                href="/categories"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Categorii
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Produse
              </Link>
              <Link
                href="/offers"
                className="block px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔥 Oferte
              </Link>
              <Link
                href="/account"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contul meu
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
