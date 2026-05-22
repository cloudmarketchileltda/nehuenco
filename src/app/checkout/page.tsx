"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore, CartItem } from "@/store/useStore";
import { User, CreditCard, Landmark, Coins, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Leaf } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, user, config, placeOrder, clearCart, redeemPoints } = useStore();

  // URL query params
  const pointsRedeemedParam = Number(searchParams.get("points") || "0");
  const couponAppliedParam = searchParams.get("coupon") || "";

  // Checkout form states
  const [isGuest, setIsGuest] = useState(false);
  const [firstName, setFirstName] = useState(isGuest ? "" : "Ana");
  const [lastName, setLastName] = useState(isGuest ? "" : "Contreras");
  const [phone, setPhone] = useState(isGuest ? "" : "+56 9 8765 4321");
  const [email, setEmail] = useState(isGuest ? "" : "ana@email.com");

  // Payment method states
  const [paymentMethod, setPaymentMethod] = useState<"efectivo" | "transferencia" | "webpay">("webpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webpayStep, setWebpayStep] = useState<"idle" | "loading" | "portal" | "success">("idle");

  // Subtotal calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const pointsDiscount = pointsRedeemedParam > 0 ? Math.min(pointsRedeemedParam * config.pointsExchangeRate, subtotal) : 0;

  // Coupon discount math
  const couponDiscountPercent = couponAppliedParam === "VERDE10" ? 10 : 0;
  const couponDiscount = couponDiscountPercent > 0 ? Math.round((subtotal - pointsDiscount) * (couponDiscountPercent / 100)) : 0;
  const finalTotal = Math.max(0, subtotal - pointsDiscount - couponDiscount);

  // If cart is empty, redirect to catalog (unless we are in the middle of Webpay simulation)
  useEffect(() => {
    if (cart.length === 0 && webpayStep === "idle") {
      router.push("/catalog");
    }
  }, [cart, webpayStep, router]);

  // Form sync when guest toggles
  useEffect(() => {
    if (isGuest) {
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
    } else {
      setFirstName("Ana");
      setLastName("Contreras");
      setPhone("+56 9 8765 4321");
      setEmail("ana@email.com");
    }
  }, [isGuest]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone) {
      alert("Por favor ingresa tu nombre, apellido y teléfono.");
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      customerName: `${firstName} ${lastName}`,
      phone,
      email,
      items: cart,
      subtotal,
      discountPoints: pointsDiscount,
      discountCoupon: couponDiscount,
      total: finalTotal,
      estimatedTime: "13:45", // Mock estimation
      notes: cart.find((i) => i.notes !== "")?.notes || "",
      pointsRedeemed: pointsRedeemedParam,
    };

    if (paymentMethod === "webpay") {
      // Simulate Webpay Portal Redirect & payment approval
      setWebpayStep("loading");
      setTimeout(() => {
        setWebpayStep("portal");
      }, 1500);
    } else {
      // Direct placement for Cash or Transfer
      setTimeout(() => {
        // Apply points deduction
        if (pointsRedeemedParam > 0) {
          redeemPoints(pointsRedeemedParam);
        }

        const newOrder = placeOrder(orderPayload);
        clearCart();
        setIsSubmitting(false);
        router.push(`/ticket/${newOrder.id}`);
      }, 1500);
    }
  };

  const handleWebpayApprove = () => {
    setWebpayStep("success");
    setTimeout(() => {
      // Deduct points
      if (pointsRedeemedParam > 0) {
        redeemPoints(pointsRedeemedParam);
      }

      const orderPayload = {
        customerName: `${firstName} ${lastName}`,
        phone,
        email,
        items: cart,
        subtotal,
        discountPoints: pointsDiscount,
        discountCoupon: couponDiscount,
        total: finalTotal,
        estimatedTime: "13:45",
        notes: cart.find((i) => i.notes !== "")?.notes || "",
        pointsRedeemed: pointsRedeemedParam,
      };

      const newOrder = placeOrder(orderPayload);
      clearCart();
      setIsSubmitting(false);
      router.push(`/ticket/${newOrder.id}`);
    }, 1500);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  // 3. Webpay Portal Simulation Screen
  if (webpayStep === "loading" || webpayStep === "portal" || webpayStep === "success") {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        {webpayStep === "loading" && (
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-gray-100 shadow-xl space-y-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-lg font-bold text-gray-700">Conectando con Transbank...</h3>
            <p className="text-xs text-gray-500">Estamos redirigiéndote al portal seguro de pago en línea.</p>
          </div>
        )}

        {webpayStep === "portal" && (
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full border border-gray-200 shadow-2xl">
            {/* Red Webpay Header */}
            <div className="bg-[#E41F28] p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="bg-white text-[#E41F28] font-bold text-[9px] px-1.5 py-0.5 rounded uppercase font-sans">
                  Webpay
                </span>
                <span className="font-sans font-semibold text-sm tracking-wide">
                  Transbank
                </span>
              </div>
              <span className="text-xs font-mono font-semibold opacity-85">COMERCIO NEHUENCO</span>
            </div>

            {/* Billing details */}
            <div className="p-6 space-y-5">
              <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-150 flex justify-between items-center text-sm">
                <div>
                  <span className="block text-xs text-gray-500 uppercase tracking-wider font-bold">Monto a pagar</span>
                  <span className="text-lg font-bold text-gray-900 mt-0.5">{formatCurrency(finalTotal)}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider font-bold">Orden ID</span>
                  <span className="text-xs font-mono font-medium text-gray-700 mt-0.5">#NEH-2026-TMP</span>
                </div>
              </div>

              {/* Red Card mockup */}
              <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-44">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-red-200 uppercase tracking-widest font-bold">Tarjeta de Crédito / Débito</span>
                    <span className="text-base font-bold mt-1 tracking-wider">Webpay Plus</span>
                  </div>
                  <span className="bg-white/10 px-2.5 py-0.5 rounded text-[10px] uppercase font-bold">Seguro</span>
                </div>
                <div className="font-mono text-lg tracking-widest my-2">
                  ••••  ••••  ••••  4321
                </div>
                <div className="flex justify-between items-end text-xs">
                  <div>
                    <span className="block text-[8px] text-red-200 uppercase">Titular</span>
                    <span className="font-bold">{firstName} {lastName}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-red-200 uppercase">Exp</span>
                    <span className="font-bold">12/29</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                Esta es una interfaz de simulación segura de Webpay Plus. Al hacer clic en "Aprobar Pago" simularás una transacción exitosa.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setWebpayStep("idle")}
                  className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-full text-xs hover:bg-zinc-50 active:scale-95 transition-all text-center"
                >
                  Cancelar Pago
                </button>
                <button
                  onClick={handleWebpayApprove}
                  className="flex-1 bg-[#E41F28] hover:bg-red-700 text-white font-bold py-3 rounded-full text-xs active:scale-95 transition-all shadow-md text-center"
                >
                  Aprobar Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {webpayStep === "success" && (
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center border border-gray-100 shadow-xl space-y-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-pulse mx-auto" />
            <h3 className="text-lg font-bold text-gray-700">¡Pago Transacción Aprobada!</h3>
            <p className="text-xs text-gray-500">
              Estamos procesando tu orden y creando tu ticket digital de retiro. No cierres esta pestaña.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1">
      {/* Page Title */}
      <div className="mb-8">
        <span className="text-xs font-bold text-salvia uppercase tracking-widest font-sans">Finalizar compra</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-verde-profundo mt-1">Checkout</h1>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Forms (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account selector */}
          <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-verde-profundo flex items-center gap-2">
              <User className="h-5 w-5 text-salvia" />
              1. Identificación del Cliente
            </h3>

            <div className="grid grid-cols-2 gap-3 p-1 bg-vegetal rounded-2xl border border-salvia/10">
              <button
                type="button"
                onClick={() => setIsGuest(false)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  !isGuest ? "bg-white text-verde-profundo shadow" : "text-verde-oscuro/80 hover:text-salvia"
                }`}
              >
                Cuenta Club ({user.name})
              </button>
              <button
                type="button"
                onClick={() => setIsGuest(true)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                  isGuest ? "bg-white text-verde-profundo shadow" : "text-verde-oscuro/80 hover:text-salvia"
                }`}
              >
                Comprar como Invitado
              </button>
            </div>

            {/* Input Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-verde-profundo mb-1.5">Nombre</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs border border-salvia/20 rounded-xl px-3.5 py-2.5 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-verde-profundo mb-1.5">Apellido</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs border border-salvia/20 rounded-xl px-3.5 py-2.5 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-verde-profundo mb-1.5">Teléfono móvil</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full text-xs border border-salvia/20 rounded-xl px-3.5 py-2.5 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-verde-profundo mb-1.5">Email (opcional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@email.com"
                  className="w-full text-xs border border-salvia/20 rounded-xl px-3.5 py-2.5 bg-white text-verde-profundo focus:outline-none focus:ring-1 focus:ring-salvia"
                />
              </div>
            </div>

            {!isGuest && (
              <div className="bg-salvia/10 border border-salvia/15 p-4 rounded-2xl flex items-center justify-between text-xs text-verde-profundo">
                <div>
                  <span className="block font-bold">Compra como miembro del Club</span>
                  <span className="text-[10px] text-verde-oscuro/85">
                    Acumulas {formatCurrency(Math.floor(finalTotal * 0.01))} en puntos por este pedido.
                  </span>
                </div>
                <span className="bg-salvia text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  PUNTOS ACUMULABLES
                </span>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-verde-profundo flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-salvia" />
              2. Método de Pago
            </h3>

            <div className="space-y-3">
              {/* Webpay Plus */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "webpay"
                    ? "bg-salvia/5 border-salvia shadow-sm"
                    : "bg-white border-salvia/15 hover:border-salvia/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "webpay"}
                  onChange={() => setPaymentMethod("webpay")}
                  className="mt-1 text-salvia focus:ring-salvia border-salvia/30"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm font-bold text-verde-profundo">Pago Webpay Plus</strong>
                    <span className="bg-[#E41F28] text-white text-[9px] px-1.5 py-0.2 rounded font-sans uppercase font-bold">
                      Redbanc
                    </span>
                  </div>
                  <p className="text-xs text-verde-oscuro/80 mt-1 leading-relaxed">
                    Paga de forma rápida y segura en línea con tu Tarjeta de Débito, Crédito o prepago a través de Transbank.
                  </p>
                </div>
              </label>

              {/* Transfer */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "transferencia"
                    ? "bg-salvia/5 border-salvia shadow-sm"
                    : "bg-white border-salvia/15 hover:border-salvia/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "transferencia"}
                  onChange={() => setPaymentMethod("transferencia")}
                  className="mt-1 text-salvia focus:ring-salvia border-salvia/30"
                />
                <div className="flex-1">
                  <strong className="text-sm font-bold text-verde-profundo flex items-center gap-1.5">
                    <Landmark className="h-4 w-4 text-salvia" /> Transferencia Bancaria Directa
                  </strong>
                  <p className="text-xs text-verde-oscuro/80 mt-1 leading-relaxed">
                    Te proporcionamos los datos de transferencia en el ticket digital. Envía el comprobante para habilitar tu entrega.
                  </p>
                  {paymentMethod === "transferencia" && (
                    <div className="mt-3.5 bg-zinc-50 border border-zinc-150 p-3.5 rounded-xl text-xs space-y-1 font-mono text-verde-profundo">
                      <div><strong>Destinatario:</strong> Restobar Nehuenco SpA</div>
                      <div><strong>Banco:</strong> Banco Estado (Chile)</div>
                      <div><strong>Tipo Cuenta:</strong> Cuenta Corriente</div>
                      <div><strong>Nº Cuenta:</strong> 1234-5678-9</div>
                      <div><strong>RUT:</strong> 76.543.210-K</div>
                      <div><strong>Email:</strong> pagos@nehuenco.cl</div>
                    </div>
                  )}
                </div>
              </label>

              {/* Cash */}
              <label
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                  paymentMethod === "efectivo"
                    ? "bg-salvia/5 border-salvia shadow-sm"
                    : "bg-white border-salvia/15 hover:border-salvia/30"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "efectivo"}
                  onChange={() => setPaymentMethod("efectivo")}
                  className="mt-1 text-salvia focus:ring-salvia border-salvia/30"
                />
                <div className="flex-1">
                  <strong className="text-sm font-bold text-verde-profundo flex items-center gap-1.5">
                    <Coins className="h-4 w-4 text-salvia" /> Pago Presencial al Retirar
                  </strong>
                  <p className="text-xs text-verde-oscuro/80 mt-1 leading-relaxed">
                    Paga en efectivo, tarjeta de débito o crédito directamente en la caja de nuestro local al momento de retirar tu pedido.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary (Col span 1) */}
        <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-5">
          <h3 className="font-serif text-lg font-bold text-verde-profundo pb-3 border-b border-gray-100">
            Resumen del Pedido
          </h3>

          {/* List items brief */}
          <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="py-2.5 flex justify-between items-center gap-4 text-xs">
                <div className="min-w-0">
                  <strong className="text-verde-profundo block truncate">{item.product.name}</strong>
                  <span className="text-[10px] text-gray-500">Cantidad: {item.quantity}</span>
                  {item.notes && <span className="block text-[9px] italic text-salvia truncate">"{item.notes}"</span>}
                </div>
                <span className="font-bold text-verde-profundo shrink-0">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Price breakdowns */}
          <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-verde-oscuro font-sans">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-verde-profundo">{formatCurrency(subtotal)}</span>
            </div>

            {pointsDiscount > 0 && (
              <div className="flex justify-between text-salvia font-semibold">
                <span>Descuento Club ({pointsRedeemedParam} pts)</span>
                <span>-{formatCurrency(pointsDiscount)}</span>
              </div>
            )}

            {couponDiscount > 0 && (
              <div className="flex justify-between text-salvia font-semibold">
                <span>Descuento Cupón ({couponAppliedParam} -10%)</span>
                <span>-{formatCurrency(couponDiscount)}</span>
              </div>
            )}

            <div className="flex justify-between text-xs pb-3 border-b border-dashed border-gray-100">
              <span>Tipo de Entrega</span>
              <span className="text-salvia font-semibold">Retiro en local</span>
            </div>

            <div className="flex justify-between text-sm font-bold text-verde-profundo pt-2">
              <span>Total a pagar</span>
              <span className="text-lg text-verde-profundo">{formatCurrency(finalTotal)}</span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-verde-profundo hover:bg-salvia text-white font-bold py-3.5 rounded-full shadow transition-all active:scale-95 text-center text-sm disabled:bg-gray-400"
          >
            {isSubmitting ? (
              <span>Procesando...</span>
            ) : (
              <>
                Confirmar y Pagar
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-verde-oscuro/85 text-center leading-relaxed">
            <ShieldCheck className="h-4.5 w-4.5 text-salvia" />
            <span>Compra protegida SSL de extremo a extremo.</span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-vegetal text-verde-profundo font-sans">
        <Leaf className="h-10 w-10 text-salvia animate-bounce mb-3" />
        <span className="text-sm font-semibold">Cargando pasarela de pago...</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
