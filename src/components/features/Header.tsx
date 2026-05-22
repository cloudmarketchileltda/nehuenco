"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ShoppingBag, Utensils, User, Menu, X, Clock, Settings } from "lucide-react";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const pathname = usePathname();
  const cart = useStore((state) => state.cart);
  const config = useStore((state) => state.config);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/catalog", label: "Carta" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-salvia text-vegetal p-2 rounded-full shadow-md group-hover:bg-verde-profundo transition-colors">
                  <Utensils className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold tracking-tight text-verde-profundo leading-tight">
                    Nehuenco
                  </span>
                  <span className="text-[10px] tracking-widest text-salvia font-sans uppercase -mt-1 font-bold">
                    Restobar
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-sans text-sm font-semibold transition-colors duration-200 py-2 border-b-2 ${
                      isActive
                        ? "text-verde-profundo border-salvia"
                        : "text-verde-oscuro border-transparent hover:text-salvia"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Store Hours/Status */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-sage bg-white/50 text-verde-profundo border border-salvia/30">
                <span className={`h-2.5 w-2.5 rounded-full ${config.isOpen ? "bg-salvia animate-pulse" : "bg-red-400"}`}></span>
                {config.isOpen ? "Abierto" : "Cerrado"} (12:00 - 22:00)
              </div>

              {/* Admin Shortcut */}
              <Link
                href="/admin"
                className="p-2.5 text-verde-oscuro hover:text-salvia hover:bg-salvia/10 rounded-full transition-all"
                title="Administración"
              >
                <Settings className="h-5 w-5" />
              </Link>

              {/* Profile Shortcut */}
              <Link
                href="/profile"
                className="p-2.5 text-verde-oscuro hover:text-salvia hover:bg-salvia/10 rounded-full transition-all"
                title="Mi Perfil"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-verde-profundo text-vegetal hover:bg-salvia rounded-full transition-all shadow-md active:scale-95"
                aria-label="Abrir Carrito"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-durazno text-verde-profundo font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-vegetal shadow">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-verde-oscuro hover:text-salvia rounded-lg focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-salvia/20 absolute left-0 right-0 py-4 px-6 shadow-xl animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block font-sans text-base font-bold py-2 border-l-4 pl-3 ${
                      isActive
                        ? "text-verde-profundo border-salvia bg-salvia/5"
                        : "text-verde-oscuro border-transparent hover:bg-salvia/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-salvia/20 flex justify-between items-center">
                <span className="text-xs text-verde-oscuro flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Lunes a Sábado: 12:00 - 22:00
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${config.isOpen ? "bg-salvia/20 text-verde-profundo" : "bg-red-100 text-red-700"}`}>
                  {config.isOpen ? "🟢 Abierto hoy" : "🔴 Cerrado"}
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Slider Overlay */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
