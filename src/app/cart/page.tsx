"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Gift, Tag, CornerDownRight, Check } from "lucide-react";

export default function CartPage() {
  const {
    cart,
    user,
    config,
    updateCartQuantity,
    removeFromCart,
    updateCartNotes,
  } = useStore();

  // Coupon code states
  const [couponInput, setCouponInput] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Points redemption states
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [pointsInput, setPointsInput] = useState<string>("50"); // Defaults to 50 points ($500 discount) per prompt
  const [pointsApplied, setPointsApplied] = useState(true); // Pre-applied per prompt

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Math for discount
  const pointsDiscountVal = pointsApplied ? Math.min(Number(pointsInput) * config.pointsExchangeRate, subtotal) : 0;
  const couponDiscountVal = activeCoupon ? Math.round((subtotal - pointsDiscountVal) * (activeCoupon.percent / 100)) : 0;
  const finalTotal = Math.max(0, subtotal - pointsDiscountVal - couponDiscountVal);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponInput) return;

    // Check if user has this coupon code
    const validCoupon = user.coupons.find((c) => c.code.toLowerCase() === couponInput.toLowerCase());
    if (validCoupon) {
      setActiveCoupon({ code: validCoupon.code, percent: validCoupon.discountPercent });
      setCouponSuccess(`¡Cupón ${validCoupon.code} aplicado! ${validCoupon.discountPercent}% de descuento.`);
      setCouponInput("");
    } else if (couponInput.toUpperCase() === "VERDE10") {
      setActiveCoupon({ code: "VERDE10", percent: 10 });
      setCouponSuccess("¡Cupón VERDE10 aplicado! 10% de descuento.");
      setCouponInput("");
    } else {
      setCouponError("Cupón inválido o expirado.");
    }
  };

  const handleApplyPoints = () => {
    const pts = Number(pointsInput);
    if (isNaN(pts) || pts <= 0) {
      alert("Por favor ingresa un puntaje válido.");
      return;
    }
    if (pts > user.points) {
      alert(`Solo tienes ${user.points} puntos disponibles.`);
      return;
    }
    setPointsToRedeem(pts);
    setPointsApplied(true);
  };

  const handleRemoveCoupon = () => {
    setActiveCoupon(null);
    setCouponSuccess("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-bold text-salvia uppercase tracking-widest font-sans">Tu pedido actual</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-verde-profundo mt-1">Revisión del Carrito</h1>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 bg-white rounded-3xl border border-salvia/10 shadow-sm px-6">
          <div className="bg-salvia/10 p-6 rounded-full text-salvia mb-4">
            <ShoppingBag className="h-16 w-16" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-verde-profundo">Tu carrito está vacío</h2>
          <p className="text-sm text-verde-oscuro/85 mt-2 max-w-sm">
            Explora nuestra carta gastronómica y deleita tu paladar con nuestras opciones saludables.
          </p>
          <Link
            href="/catalog"
            className="mt-8 inline-flex items-center gap-2 bg-verde-profundo text-white font-bold px-8 py-3.5 rounded-full shadow hover:bg-salvia transition-all active:scale-95"
          >
            Ver la Carta
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* List of items (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-3xl p-5 border border-salvia/10 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                {/* Product Photo & Details */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-vegetal shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-salvia uppercase tracking-wider block">
                      {item.product.category}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-verde-profundo mt-0.5">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-verde-oscuro/85 font-bold mt-1">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>
                </div>

                {/* Notes, Quantity, and Subtotal */}
                <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3 shrink-0">
                  {/* Notes inline edit */}
                  <div className="w-full sm:max-w-xs bg-vegetal/40 rounded-xl px-3 py-2 flex items-start gap-1.5 border border-salvia/5">
                    <CornerDownRight className="h-3.5 w-3.5 text-salvia mt-0.5 shrink-0" />
                    <input
                      type="text"
                      value={item.notes}
                      onChange={(e) => updateCartNotes(item.product.id, e.target.value)}
                      placeholder="Instrucción de cocina..."
                      className="w-full text-xs bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-verde-profundo placeholder-gray-400 font-sans"
                    />
                  </div>

                  {/* Quantity and delete controls */}
                  <div className="flex items-center gap-4 justify-between sm:justify-end w-full">
                    <span className="text-xs text-gray-500 font-medium font-sans">
                      Total: {formatCurrency(item.product.price * item.quantity)}
                    </span>
                    <div className="flex items-center gap-3">
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

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing calculations sidebar (Col span 1) */}
          <div className="space-y-6">
            {/* Loyalty club panel */}
            <div className="bg-gradient-to-r from-salvia/10 to-aguamarina/10 border border-salvia/20 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-salvia" />
                <h3 className="font-serif text-lg font-bold text-verde-profundo">Club de Puntos</h3>
              </div>
              <p className="text-xs text-verde-oscuro/85 leading-relaxed">
                ¡Hola <strong className="text-verde-profundo">{user.name}</strong>! Tienes <strong className="text-verde-profundo">{user.points} puntos</strong> acumulados en tu cuenta (Nivel {user.tier}).
              </p>

              {/* Point input form */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={pointsInput}
                    onChange={(e) => {
                      setPointsInput(e.target.value);
                      setPointsApplied(false);
                    }}
                    placeholder="Puntos a usar"
                    className="w-full text-xs border border-salvia/20 rounded-xl pl-3 pr-8 py-2.5 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                  />
                  <span className="absolute right-2.5 top-2.5 text-[9px] font-bold text-verde-oscuro/60 uppercase">
                    Pts
                  </span>
                </div>
                <button
                  onClick={handleApplyPoints}
                  className="bg-verde-profundo text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-salvia transition-colors shrink-0"
                >
                  Aplicar
                </button>
              </div>

              {pointsApplied && pointsInput && (
                <div className="bg-white/80 border border-salvia/10 px-3.5 py-2.5 rounded-xl flex justify-between items-center text-xs text-verde-profundo shadow-sm">
                  <span className="flex items-center gap-1 font-medium">
                    <Check className="h-4 w-4 text-salvia shrink-0" />
                    Puntos aplicados: {pointsInput} pts
                  </span>
                  <span className="font-bold text-salvia">-{formatCurrency(pointsDiscountVal)}</span>
                </div>
              )}
            </div>

            {/* Coupons panel */}
            <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-salvia" />
                <h3 className="font-serif text-lg font-bold text-verde-profundo">Código de Descuento</h3>
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej: VERDE10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 text-xs border border-salvia/20 rounded-xl px-3 py-2.5 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia uppercase"
                />
                <button
                  type="submit"
                  className="bg-salvia text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-verde-profundo transition-colors shrink-0"
                >
                  Validar
                </button>
              </form>

              {couponError && <p className="text-[11px] font-semibold text-red-600">{couponError}</p>}
              {couponSuccess && (
                <div className="bg-salvia/10 text-verde-profundo p-3 rounded-xl flex items-center justify-between text-xs font-semibold">
                  <span>{couponSuccess}</span>
                  <button onClick={handleRemoveCoupon} className="text-red-700 font-bold hover:underline">
                    Quitar
                  </button>
                </div>
              )}

              {/* Display available coupons */}
              {user.coupons.length > 0 && !activeCoupon && (
                <div className="pt-2 border-t border-gray-150">
                  <p className="text-[10px] font-bold text-verde-oscuro uppercase tracking-wider mb-2">Cupón sugerido:</p>
                  {user.coupons.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setActiveCoupon({ code: c.code, percent: c.discountPercent });
                        setCouponSuccess(`¡Cupón ${c.code} aplicado! ${c.discountPercent}% de descuento.`);
                      }}
                      className="w-full text-left bg-vegetal hover:bg-salvia/10 border border-salvia/10 px-3.5 py-2.5 rounded-xl text-xs flex justify-between items-center transition-colors group"
                    >
                      <div>
                        <span className="font-bold text-verde-profundo group-hover:text-salvia">{c.code}</span>
                        <span className="block text-[10px] text-verde-oscuro/85 mt-0.5">{c.description}</span>
                      </div>
                      <span className="text-[10px] font-bold text-salvia uppercase">Usar</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Total calculation board */}
            <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-verde-profundo pb-3 border-b border-gray-100">
                Resumen de Compra
              </h3>

              <div className="space-y-2.5 text-sm text-verde-oscuro font-sans">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-verde-profundo">{formatCurrency(subtotal)}</span>
                </div>

                {pointsApplied && pointsDiscountVal > 0 && (
                  <div className="flex justify-between text-salvia font-semibold">
                    <span>Descuento Puntos ({pointsInput} pts)</span>
                    <span>-{formatCurrency(pointsDiscountVal)}</span>
                  </div>
                )}

                {activeCoupon && couponDiscountVal > 0 && (
                  <div className="flex justify-between text-salvia font-semibold">
                    <span>Cupón ({activeCoupon.code} -{activeCoupon.percent}%)</span>
                    <span>-{formatCurrency(couponDiscountVal)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs pb-3 border-b border-dashed border-gray-100">
                  <span>Retiro en Local</span>
                  <span className="text-salvia font-semibold">Sin Costo</span>
                </div>

                <div className="flex justify-between text-base font-bold text-verde-profundo pt-2.5">
                  <span>Total a pagar</span>
                  <span className="text-xl text-verde-profundo">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <Link
                href={{
                  pathname: "/checkout",
                  query: {
                    points: pointsApplied ? pointsInput : "0",
                    coupon: activeCoupon ? activeCoupon.code : "",
                  },
                }}
                className="w-full flex items-center justify-center gap-2 bg-verde-profundo text-white font-bold py-4 rounded-full shadow hover:bg-salvia transition-all active:scale-95 text-center text-sm"
              >
                Confirmar Pedido
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
