"use client";

import { useEffect, useState } from "react";
import { useStore, Order } from "@/store/useStore";
import { Check, Clock, Printer, MapPin, Coffee, AlertCircle, ArrowLeft, RefreshCw, Utensils } from "lucide-react";
import Link from "next/link";

interface TicketContentProps {
  id: string;
}

export default function TicketContent({ id }: TicketContentProps) {
  const { orders, updateOrderStatus } = useStore();
  const [countdown, setCountdown] = useState(30);

  // Find the specific order in our store
  const order = orders.find((o) => o.id === id);

  // Real-time Simulation Polling
  useEffect(() => {
    if (!order || order.status === "Listo" || order.status === "Retirado") return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Transition status
          if (order.status === "Recibido") {
            updateOrderStatus(order.id, "Preparando");
          } else if (order.status === "Preparando") {
            updateOrderStatus(order.id, "Listo");
          }
          return 30; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [order, updateOrderStatus]);

  // Reset countdown if order status changes manually
  useEffect(() => {
    setCountdown(30);
  }, [order?.status]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-12 px-6 text-center py-16 bg-white rounded-3xl border border-red-100 shadow-xl">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-serif font-bold text-verde-profundo">Ticket no encontrado</h2>
        <p className="text-sm text-verde-oscuro/85 mt-2">
          No pudimos localizar la orden con código <strong className="font-mono text-gray-700">{id}</strong>.
        </p>
        <Link
          href="/catalog"
          className="mt-6 inline-flex bg-verde-profundo text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-salvia"
        >
          Ir al Catálogo
        </Link>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  // Force manual state change for demonstration purposes
  const handleForceNextStatus = () => {
    if (order.status === "Recibido") {
      updateOrderStatus(order.id, "Preparando");
    } else if (order.status === "Preparando") {
      updateOrderStatus(order.id, "Listo");
    } else if (order.status === "Listo") {
      updateOrderStatus(order.id, "Retirado");
    }
  };

  const steps = [
    { label: "Recibido", key: "Recibido", color: "bg-sky-500" },
    { label: "Preparando", key: "Preparando", color: "bg-amber-500" },
    { label: "¡Listo!", key: "Listo", color: "bg-emerald-500" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col items-center">
      {/* 1. Header Toolbar (Hidden on print) */}
      <div className="w-full flex justify-between items-center mb-6 no-print">
        <Link
          href="/profile"
          className="text-xs text-verde-oscuro hover:text-salvia font-bold flex items-center gap-1 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Volver a mi Club
        </Link>
        <button
          onClick={handlePrint}
          className="bg-white hover:bg-vegetal text-verde-profundo border border-salvia/30 font-bold text-xs px-4.5 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 active:scale-95 transition-all"
        >
          <Printer className="h-4 w-4 text-salvia" /> Imprimir Ticket
        </button>
      </div>

      {/* 2. Simulation Status Bar (Hidden on print) */}
      {order.status !== "Listo" && order.status !== "Retirado" && (
        <div className="w-full bg-gradient-to-r from-salvia/10 to-aguamarina/10 border border-salvia/25 p-4 rounded-2xl mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-verde-profundo no-print shadow-sm">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4.5 w-4.5 text-salvia animate-spin-slow shrink-0" />
            <span>
              Simulación de cocina activa. Siguiente paso automático en{" "}
              <strong className="font-mono text-sm">{countdown}s</strong>.
            </span>
          </div>
          <button
            onClick={handleForceNextStatus}
            className="bg-salvia hover:bg-verde-profundo text-white font-bold px-3 py-1.5 rounded-xl shrink-0 transition-colors"
          >
            Avanzar estado manualmente
          </button>
        </div>
      )}

      {order.status === "Listo" && (
        <div className="w-full bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-6 flex items-center justify-between gap-4 text-xs text-emerald-800 no-print shadow-sm">
          <span className="flex items-center gap-1.5 font-bold">
            <Check className="h-5 w-5 text-emerald-600 shrink-0" />
            ¡Tu pedido está listo! Acércate a la caja señalando el ticket #{order.id}.
          </span>
          <button
            onClick={handleForceNextStatus}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-1.5 rounded-xl transition-colors"
          >
            Simular Entrega (Retirado)
          </button>
        </div>
      )}

      {/* 3. Ticket Card (The primary receipt card) */}
      <div className="w-full bg-white rounded-3xl border border-salvia/15 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden print-card">
        {/* Ticket Top decoration */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-salvia via-menta to-salvia"></div>

        {/* Brand details */}
        <div className="text-center pb-4 border-b border-dashed border-gray-200">
          <div className="inline-flex items-center gap-1 text-salvia mb-1">
            <Utensils className="h-5 w-5" />
            <span className="font-serif text-lg font-bold text-verde-profundo">Restobar Nehuenco</span>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Sabor Local & Especialidades</p>
          <span className="block text-2xl font-mono font-bold text-verde-profundo mt-3 tracking-wide">
            {order.id}
          </span>
          <p className="text-[10px] text-gray-400 mt-0.5">Av. Del Bosque 1234, Providencia | +56 2 2345 6789</p>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Cliente</span>
            <strong className="text-verde-profundo">{order.customerName}</strong>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Fecha Pedido</span>
            <strong className="text-verde-profundo">
              {new Date(order.createdAt).toLocaleDateString("es-CL")}
            </strong>
          </div>
          <div>
            <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Contacto</span>
            <strong className="text-verde-profundo">{order.phone}</strong>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Hora Estimada Retiro</span>
            <strong className="text-salvia flex items-center gap-1 justify-end font-bold">
              <Clock className="h-3.5 w-3.5" /> {order.estimatedTime}
            </strong>
          </div>
        </div>

        {/* 4. Order Progress Timeline (Hidden on print) */}
        <div className="no-print pt-2 pb-4">
          <span className="text-gray-400 block text-[9px] uppercase tracking-wider mb-3">Estado del Pedido</span>
          <div className="relative">
            {/* Timeline base track line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
            {/* Colored active path */}
            <div
              className="absolute top-1/2 left-0 h-0.5 bg-salvia -translate-y-1/2 -z-10 transition-all duration-500"
              style={{
                width:
                  order.status === "Recibido"
                    ? "0%"
                    : order.status === "Preparando"
                    ? "50%"
                    : "100%",
              }}
            ></div>

            <div className="flex justify-between items-center">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                        isCompleted
                          ? `${step.color} border-transparent text-white`
                          : "bg-white border-gray-250 text-gray-400"
                      } ${isCurrent ? "ring-4 ring-salvia/20 scale-110" : ""}`}
                    >
                      {isCompleted && idx < currentStepIndex ? <Check className="h-4.5 w-4.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] mt-2 font-bold ${
                        isCompleted ? "text-verde-profundo" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed step info */}
          <div className="mt-5 bg-vegetal/40 border border-salvia/10 p-3 rounded-2xl text-center text-xs text-verde-profundo flex items-center justify-center gap-1.5">
            <Coffee className="h-4.5 w-4.5 text-salvia shrink-0" />
            {order.status === "Recibido" && (
              <span>Pedido recibido en caja. A la espera de confirmación de cocina.</span>
            )}
            {order.status === "Preparando" && (
              <span>🔵 <strong>En preparación</strong>: Tu pedido está siendo elaborado de forma artesanal.</span>
            )}
            {order.status === "Listo" && (
              <span>🟢 <strong>¡Listo para retirar!</strong> Pasa directamente por el mesón de retiro.</span>
            )}
            {order.status === "Retirado" && (
              <span>⚪ <strong>Entregado</strong>: Pedido retirado con éxito. ¡Gracias por preferirnos!</span>
            )}
          </div>
        </div>

        {/* 5. Products List details */}
        <div className="space-y-4">
          <span className="text-gray-400 block text-[9px] uppercase tracking-wider border-b border-gray-150 pb-1">
            Detalle de Consumos
          </span>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.product.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <strong className="text-verde-profundo">{item.product.name}</strong>
                  <span className="text-gray-500 block text-[10px]">Cantidad: {item.quantity} x {formatCurrency(item.product.price)}</span>
                  {item.notes && <span className="block text-[10px] text-salvia italic mt-0.5">Nota: "{item.notes}"</span>}
                </div>
                <span className="font-mono font-bold text-verde-profundo">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Pricing Breakdown */}
        <div className="pt-4 border-t border-dashed border-gray-200 text-xs text-verde-oscuro font-sans space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono font-medium text-verde-profundo">{formatCurrency(order.subtotal)}</span>
          </div>

          {order.discountPoints > 0 && (
            <div className="flex justify-between text-salvia font-semibold">
              <span>Descuento Club Puntos</span>
              <span className="font-mono">-{formatCurrency(order.discountPoints)}</span>
            </div>
          )}

          {order.discountCoupon > 0 && (
            <div className="flex justify-between text-salvia font-semibold">
              <span>Descuento Cupón</span>
              <span className="font-mono">-{formatCurrency(order.discountCoupon)}</span>
            </div>
          )}

          <div className="flex justify-between text-[13px] font-bold text-verde-profundo pt-2.5 border-t border-gray-100">
            <span>Total retirado</span>
            <span className="font-mono text-base text-verde-profundo">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Print only footer */}
        <div className="hidden print:block text-center pt-8 border-t border-dashed border-gray-200 space-y-2">
          <p className="text-[10px] text-gray-500 font-serif">¡Gracias por tu visita a Restobar Nehuenco!</p>
          <div className="flex justify-center mt-2">
            {/* Mock barcode representation using vertical lines */}
            <div className="flex items-center gap-0.5 h-6 opacity-80">
              <div className="w-0.5 bg-black h-full"></div>
              <div className="w-1 bg-black h-full"></div>
              <div className="w-0.5 bg-black h-full"></div>
              <div className="w-0.2 bg-black h-full"></div>
              <div className="w-1 bg-black h-full"></div>
              <div className="w-0.5 bg-black h-full"></div>
              <div className="w-0.5 bg-black h-full"></div>
              <div className="w-1 bg-black h-full"></div>
              <div className="w-0.2 bg-black h-full"></div>
            </div>
          </div>
          <span className="block text-[8px] font-mono text-gray-400">*{order.id}*</span>
        </div>
      </div>
    </div>
  );
}
