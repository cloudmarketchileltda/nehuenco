"use client";

import { useStore } from "@/store/useStore";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clipboard } from "lucide-react";
import { useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateCartQuantity, removeFromCart, updateCartNotes } = useStore();
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState("");

  if (!isOpen) return null;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Formatter for CLP currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  const handleEditNote = (productId: string, currentNote: string) => {
    setEditingNotesId(productId);
    setTempNote(currentNote);
  };

  const handleSaveNote = (productId: string) => {
    updateCartNotes(productId, tempNote);
    setEditingNotesId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      {/* Background backdrop */}
      <div
        className="absolute inset-0 bg-verde-profundo/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out sm:max-w-lg">
          <div className="h-full flex flex-col bg-vegetal shadow-2xl border-l border-salvia/20">
            {/* Header */}
            <div className="px-6 py-5 bg-verde-profundo text-vegetal flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-menta" />
                <h2 className="text-xl font-serif font-bold text-white">Tu Pedido</h2>
                <span className="bg-salvia text-white text-xs px-2.5 py-0.5 rounded-full font-sans font-bold">
                  {totalItems} {totalItems === 1 ? "ítem" : "ítems"}
                </span>
              </div>
              <button
                type="button"
                className="p-1 text-pastel-green hover:text-white rounded-full hover:bg-salvia/30 transition-all"
                onClick={onClose}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="bg-salvia/10 p-6 rounded-full text-salvia mb-4">
                    <ShoppingBag className="h-16 w-16" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-verde-profundo">¿Qué deseas pedir hoy?</h3>
                  <p className="text-sm text-verde-oscuro/85 mt-2 max-w-xs">
                    Tu carrito está vacío. Recorre nuestra carta y encuentra las mejores especialidades, comida rápida y colaciones.
                  </p>
                  <Link
                    href="/catalog"
                    onClick={onClose}
                    className="mt-6 inline-flex items-center gap-2 bg-salvia text-white px-6 py-3 rounded-full font-semibold hover:bg-verde-profundo transition-all shadow active:scale-95"
                  >
                    Ver la Carta
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex flex-col bg-white p-4 rounded-2xl border border-salvia/10 shadow-sm relative group hover:border-salvia/30 transition-all"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-vegetal flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-base text-verde-profundo truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-verde-oscuro/70 mt-0.5">
                          {item.product.category}
                        </p>
                        <span className="block text-sm font-bold text-verde-profundo mt-1.5">
                          {formatCurrency(item.product.price)}
                        </span>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-300 hover:text-red-600 transition-colors p-1.5 self-start"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Note section */}
                    <div className="mt-3 pt-3 border-t border-dashed border-gray-100 flex flex-col bg-vegetal/30 p-2.5 rounded-xl">
                      {editingNotesId === item.product.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            placeholder="Sin cebolla, aderezo aparte..."
                            className="flex-1 text-xs border border-salvia/30 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-salvia bg-white text-verde-profundo"
                          />
                          <button
                            onClick={() => handleSaveNote(item.product.id)}
                            className="bg-salvia text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-verde-profundo"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-verde-oscuro">
                          <span className="flex items-center gap-1 font-medium italic overflow-hidden pr-2">
                            <Clipboard className="h-3.5 w-3.5 flex-shrink-0 text-salvia" />
                            {item.notes ? (
                              <span className="truncate text-verde-profundo font-sans">"{item.notes}"</span>
                            ) : (
                              <span className="text-gray-400">Agregar nota para cocina...</span>
                            )}
                          </span>
                          <button
                            onClick={() => handleEditNote(item.product.id, item.notes)}
                            className="text-[10px] text-salvia font-bold hover:underline shrink-0"
                          >
                            {item.notes ? "Editar" : "Agregar"}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quantity controls */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Subtotal: {formatCurrency(item.product.price * item.quantity)}</span>
                      <div className="flex items-center border border-salvia/20 rounded-full bg-white shadow-sm overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-verde-oscuro hover:bg-salvia/10 active:bg-salvia/20 transition-all"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 text-sm font-bold text-verde-profundo font-mono select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-verde-oscuro hover:bg-salvia/10 active:bg-salvia/20 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Section */}
            {cart.length > 0 && (
              <div className="border-t border-salvia/20 bg-white p-6 space-y-4 shadow-inner">
                {/* Price calculations */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-verde-oscuro">
                    <span>Subtotal</span>
                    <span className="font-medium text-verde-profundo">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-verde-oscuro pb-2 border-b border-dashed border-gray-100">
                    <span>Retiro en local</span>
                    <span className="text-salvia font-semibold">Gratis</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-verde-profundo pt-2">
                    <span>Total estimado</span>
                    <span className="text-lg text-verde-profundo">{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/checkout"
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 bg-verde-profundo text-white font-bold py-3.5 rounded-full shadow hover:bg-salvia transition-all active:scale-95 text-center"
                  >
                    Proceder al Pago
                    <ArrowRight className="h-4.5 w-4.5" />
                  </Link>

                  <Link
                    href="/cart"
                    onClick={onClose}
                    className="w-full text-center text-xs font-semibold text-verde-oscuro hover:text-salvia py-2 hover:underline transition-all"
                  >
                    Ver detalles del Carrito
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
