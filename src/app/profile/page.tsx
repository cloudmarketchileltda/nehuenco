"use client";

import { useState } from "react";
import { useStore, Order } from "@/store/useStore";
import { Award, Compass, Gift, Clipboard, Clock, Check, User, Mail, Phone, Edit, Calendar } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, orders, updateProfile, config } = useStore();

  // Profile Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [emailInput, setEmailInput] = useState(user.email);
  const [phoneInput, setPhoneInput] = useState(user.phone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Copy coupon code state
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: nameInput,
      email: emailInput,
      phone: phoneInput,
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  // Formatter for CLP currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  // Format dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper for order status styling
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Recibido":
        return "bg-sky-100 text-sky-800 border-sky-200";
      case "Preparando":
        return "bg-amber-100 text-amber-800 border-amber-200 animate-pulse";
      case "Listo":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Retirado":
        return "bg-gray-100 text-gray-800 border-gray-250";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Compute points progress percentage (Ana Contreras: 340 points / 500 max)
  const progressPercent = Math.min((user.points / user.nextTierPoints) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1">
      {/* 1. Header & Greeting */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-salvia uppercase tracking-widest font-sans">Club de Fidelidad Nehuenco</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-verde-profundo mt-1">¡Hola, {user.name}!</h1>
          <p className="text-sm text-verde-oscuro/85 mt-1 font-sans">
            Gestiona tu cuenta, revisa tus puntos acumulados y sigue tus pedidos en curso.
          </p>
        </div>

        {saveSuccess && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Check className="h-4 w-4" /> Datos de perfil guardados.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Points & Club card (Col span 1) */}
        <div className="space-y-6 col-span-1">
          {/* VIP Club card */}
          <div className="bg-gradient-to-br from-verde-profundo via-verde-profundo to-salvia rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-white/10">
            {/* Background design */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/5 rounded-full filter blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border-8 border-white/5"></div>

            <div className="relative space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1">
                  <Award className="h-5 w-5 text-durazno" />
                  <span className="text-xs font-bold uppercase tracking-widest font-sans">CLUB NEHUENCO</span>
                </div>
                <span className="bg-white/15 border border-white/25 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider text-durazno shadow-sm">
                  {user.tier}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-pastel-green/75 uppercase tracking-wider block">Puntos Disponibles</span>
                <span className="text-4xl font-mono font-bold text-white block mt-1">{user.points} pts</span>
                <span className="text-xs text-pastel-green/90 mt-1 block">
                  Valor de descuento: {formatCurrency(user.points * config.pointsExchangeRate)}
                </span>
              </div>

              {/* Progress bar to next tier */}
              <div className="pt-2">
                <div className="flex justify-between text-[10px] text-pastel-green/80 uppercase font-semibold mb-1">
                  <span>Progreso Nivel</span>
                  <span>{user.points} / {user.nextTierPoints} Pts</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-durazno h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-[10px] text-pastel-green/80 mt-1.5 text-right font-medium">
                  Te faltan {user.nextTierPoints - user.points} puntos para alcanzar el nivel <strong>{user.nextTierName}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-serif text-lg font-bold text-verde-profundo flex items-center gap-2">
                <User className="h-4.5 w-4.5 text-salvia" /> Mi Perfil
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-salvia hover:text-verde-profundo font-bold flex items-center gap-1 hover:underline"
                >
                  <Edit className="h-3.5 w-3.5" /> Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-verde-profundo mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-verde-profundo mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-verde-profundo mb-1">Teléfono</label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-gray-200 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-zinc-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-verde-profundo text-white text-xs font-bold py-2 rounded-lg hover:bg-salvia"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs text-verde-oscuro">
                <div className="flex gap-3 items-center">
                  <User className="h-4.5 w-4.5 text-salvia shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase text-gray-400">Nombre</span>
                    <span className="font-bold text-verde-profundo">{user.name}</span>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="h-4.5 w-4.5 text-salvia shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase text-gray-400">Email</span>
                    <span className="font-bold text-verde-profundo">{user.email}</span>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone className="h-4.5 w-4.5 text-salvia shrink-0" />
                  <div>
                    <span className="block text-[9px] uppercase text-gray-400">Teléfono</span>
                    <span className="font-bold text-verde-profundo">{user.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Coupons & Orders (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Coupons section */}
          {user.coupons.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-verde-profundo flex items-center gap-2">
                <Gift className="h-4.5 w-4.5 text-salvia" /> Mis Cupones Disponibles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.coupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="bg-gradient-to-r from-salvia/5 to-aguamarina/5 border border-dashed border-salvia/30 rounded-2xl p-4.5 flex justify-between items-center"
                  >
                    <div>
                      <span className="bg-salvia text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded uppercase">
                        CUPÓN CLUB
                      </span>
                      <strong className="block text-base font-serif font-bold text-verde-profundo mt-1.5">{coupon.code}</strong>
                      <span className="block text-xs text-verde-oscuro/85 mt-0.5">{coupon.description}</span>
                    </div>

                    <button
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className={`text-xs font-bold px-3 py-2 rounded-xl transition-all shadow shrink-0 active:scale-95 flex items-center gap-1 ${
                        copiedCoupon === coupon.code
                          ? "bg-salvia text-white"
                          : "bg-white text-verde-profundo border border-salvia/15 hover:bg-vegetal"
                      }`}
                    >
                      {copiedCoupon === coupon.code ? (
                        <>
                          <Check className="h-3 w-3" /> Copiado
                        </>
                      ) : (
                        "Copiar"
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders History list */}
          <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-verde-profundo flex items-center gap-2">
              <Clipboard className="h-4.5 w-4.5 text-salvia" /> Historial de Pedidos
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-gray-500 font-sans">No tienes pedidos anteriores registrados.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-vegetal/30 rounded-2xl p-5 border border-salvia/5 hover:border-salvia/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="font-mono text-sm text-verde-profundo">{order.id}</strong>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-verde-oscuro/80 font-sans pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(order.createdAt)}
                        </span>
                        <span>{order.items.reduce((sum, i) => sum + i.quantity, 0)} ítems</span>
                      </div>
                      {/* Products brief */}
                      <div className="pt-2 text-xs text-verde-oscuro/70 line-clamp-1 max-w-md">
                        {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(", ")}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed border-gray-150">
                      <span className="text-sm font-bold text-verde-profundo block">
                        {formatCurrency(order.total)}
                      </span>
                      <Link
                        href={`/ticket/${order.id}`}
                        className="text-[11px] font-bold text-salvia hover:text-verde-profundo hover:underline flex items-center gap-0.5 mt-1"
                      >
                        Ver Ticket
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
