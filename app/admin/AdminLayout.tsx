"use client"
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: "/admin", key: "dashboard" },
  { label: "Analytics", href: "/admin/analytics", key: "analytics" },
  { label: "Products", href: "/admin/products", key: "products" },
  { label: "Categories", href: "/admin/categories", key: "categories" },
  { label: "Orders", href: "/admin/orders", key: "orders" },
  { label: "Settings", href: "/admin/settings", key: "settings" },
];

export default function AdminLayout({ children, section }: { children: React.ReactNode; section: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header with Gradient */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/80 px-2 py-2 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Enhanced Title with Logo Space */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 xs:w-8 xs:h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs xs:text-sm font-bold">E</span>
            </div>
            <h1 className="text-sm xs:text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              <span className="hidden xs:inline">EdilSperanța </span>Admin
            </h1>
          </div>
          
          {/* Enhanced Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 rounded-xl hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 border border-transparent hover:border-blue-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? 
              <X className="w-4 h-4 text-gray-600" /> : 
              <Menu className="w-4 h-4 text-gray-600" />
            }
          </button>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden sm:flex gap-1">
            {adminNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-xl font-medium text-sm transition-all duration-300 relative overflow-hidden group",
                  section === item.key
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 hover:scale-105 border border-transparent hover:border-blue-100"
                )}
              >
                <span className="relative z-10">{item.label}</span>
                {section !== item.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-2 pt-3 border-t border-gray-200/50 bg-white/50 backdrop-blur-sm rounded-b-xl">
            <div className="space-y-1 px-2">
              {adminNav.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group relative overflow-hidden",
                    section === item.key
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-md hover:shadow-blue-500/10 border border-transparent hover:border-blue-100"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative z-10">{item.label}</span>
                  {section !== item.key && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Main Content with Better Spacing */}
      <main className="px-2 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8 max-w-7xl mx-auto">
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
