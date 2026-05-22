"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore, Product } from "@/store/useStore";
import { ArrowRight, Utensils, Shield, Award, Clock, MapPin, Sparkles, QrCode, Printer, X } from "lucide-react";
import ProductModal from "@/components/features/ProductModal";

// Icons mapping for food categories
const CATEGORY_ICONS = {
  "Comida Rapida": "🌭",
  Colaciones: "🍲",
  Especialidades: "🍣",
  "Bebidas y Jugos": "🥤",
  "Cervezas y Vinos": "🍷",
};

export default function Home() {
  const products = useStore((state) => state.products);
  const config = useStore((state) => state.config);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPrintCoupon, setShowPrintCoupon] = useState(false);

  const handlePrintCoupon = () => {
    document.body.classList.add("printing-coupon");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-coupon");
    }, 500);
  };

  // Get the 4 featured products
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  // Formatter for CLP currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-crema via-vegetal to-aguamarina/30 py-12 md:py-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative foliage overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-salvia/5 rounded-full filter blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-menta/10 rounded-full filter blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-salvia/10 text-verde-profundo border border-salvia/20">
              <Sparkles className="h-3.5 w-3.5 text-salvia animate-spin-slow" />
              Recetas Caseras & Ingredientes Seleccionados
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-verde-profundo leading-tight">
              Comida chilena, <span className="text-salvia italic font-normal">tradicional & moderna</span>
            </h1>
            <p className="text-base sm:text-lg text-verde-oscuro/85 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Descubre los mejores sabores en la ciudad de Cunco. En Restobar Nehuenco fusionamos las recetas típicas con toques modernos en nuestra comida rápida, colaciones y especialidades.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                href="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-verde-profundo text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-salvia transition-all active:scale-95 text-base"
              >
                Hacer mi Pedido
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2 bg-white text-verde-profundo font-bold px-8 py-4 rounded-full shadow hover:bg-vegetal transition-all border border-salvia/20 text-base"
              >
                Unirse al Club
              </Link>
            </div>

            {/* Operating status notice */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-verde-oscuro/85">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-salvia" />
                <span>Lun a Sáb: 12:00 — 22:00</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-salvia" />
                <span>Cunco, La Araucanía</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto lg:ml-auto max-w-md lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 aspect-square max-w-[480px]">
              <img
                src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=1000&q=80"
                alt="Comida chilena y sushi de Restobar Nehuenco"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              {/* Floating promo badge */}
              <div className="absolute top-6 right-6 bg-durazno text-verde-profundo border border-white font-serif font-bold text-center p-3 rounded-2xl shadow-lg rotate-12 max-w-[120px]">
                <span className="block text-[10px] uppercase tracking-wider font-sans">Happy Hour</span>
                <span className="block text-xl font-bold">2x1 Schop</span>
                <span className="block text-[9px] font-sans">de 17:00 a 20:00 hrs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Section */}
      <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-bold text-salvia uppercase tracking-widest font-sans">Nuestra Carta</span>
            <h2 className="font-serif text-3xl font-bold text-verde-profundo">Explora por Categorías</h2>
            <p className="text-sm text-verde-oscuro/80 max-w-md mx-auto">
              Preparaciones al instante con el mejor sabor, ingredientes seleccionados y recetas caseras chilenas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {(["Comida Rapida", "Colaciones", "Especialidades", "Bebidas y Jugos", "Cervezas y Vinos"] as const).map((cat) => (
              <Link
                key={cat}
                href={`/catalog?category=${cat}`}
                className="flex flex-col items-center p-4 sm:p-6 bg-vegetal hover:bg-salvia/10 rounded-2xl border border-salvia/15 hover:border-salvia/40 transition-all text-center group active:scale-95 shadow-sm"
              >
                <span className="text-3xl sm:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                  {CATEGORY_ICONS[cat]}
                </span>
                <span className="font-sans font-bold text-xs sm:text-sm text-verde-profundo group-hover:text-salvia leading-tight">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Showcase */}
      <section className="py-16 bg-vegetal/45 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
            <div className="text-center sm:text-left space-y-2">
              <span className="text-xs font-bold text-salvia uppercase tracking-widest font-sans">Lo más pedido</span>
              <h2 className="font-serif text-3xl font-bold text-verde-profundo">Recomendaciones del Chef</h2>
            </div>
            <Link
              href="/catalog"
              className="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm font-bold text-salvia hover:text-verde-profundo transition-colors group"
            >
              Ver carta completa
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-3xl overflow-hidden border border-salvia/15 hover:border-salvia/30 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.badges.slice(0, 2).map((badge) => (
                      <span
                        key={badge}
                        className="bg-white/90 backdrop-blur text-[10px] font-bold text-verde-profundo px-2.5 py-0.5 rounded-full shadow-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-salvia uppercase tracking-wider block">
                      {product.category}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-verde-profundo mt-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-verde-oscuro/85 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                    <span className="font-sans font-bold text-base text-verde-profundo">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[11px] font-semibold text-salvia bg-salvia/10 px-2 py-0.5 rounded-lg">
                      Detalles
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Loyalty Program Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-verde-profundo to-salvia rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-white border border-white/10">
          {/* Decorative ring */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full border-8 border-white/5"></div>

          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 space-y-4">
              <span className="text-xs font-bold tracking-widest text-durazno uppercase font-sans flex items-center gap-1.5">
                <Award className="h-4 w-4" /> Club de Beneficios Nehuenco
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Acumula puntos y come gratis
              </h2>
              <p className="text-sm text-pastel-green/90 leading-relaxed max-w-md">
                Por cada compra que realices sumas el 1% en pesos de descuento para tus próximos pedidos. Además, recibe cupones exclusivos como miembro de nuestra comunidad.
              </p>
            </div>
            <div className="md:col-span-2 flex flex-col items-center md:items-end justify-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center md:text-right w-full max-w-[280px]">
                <p className="text-xs text-durazno font-bold uppercase tracking-wider">Tu nivel actual</p>
                <h3 className="font-serif text-2xl font-bold mt-1 text-white">Plata Bosque</h3>
                <div className="w-full bg-white/25 rounded-full h-2 mt-3.5 overflow-hidden">
                  <div className="bg-durazno h-full rounded-full" style={{ width: "68%" }}></div>
                </div>
                <p className="text-[10px] text-pastel-green/80 mt-1.5">Faltan 160 pts para Oro Cóndor</p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full justify-center md:justify-end">
                <button
                  onClick={() => setShowPrintCoupon(true)}
                  className="inline-flex items-center gap-2 bg-white text-verde-profundo font-bold px-5 py-3 rounded-full hover:bg-durazno transition-all shadow-lg active:scale-95 text-sm cursor-pointer justify-center"
                >
                  <QrCode className="h-4 w-4 text-salvia" />
                  Cupón QR Local
                </button>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-durazno text-verde-profundo font-bold px-5 py-3 rounded-full hover:bg-white transition-all shadow-lg active:scale-95 text-sm justify-center"
                >
                  Ver Mi Club
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Values banner */}
      <section className="py-12 bg-white border-t border-b border-salvia/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-salvia/10 text-salvia rounded-full shrink-0">
              <Utensils className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-verde-profundo">100% Receta Casera</h3>
              <p className="text-xs text-verde-oscuro/85 mt-1 leading-relaxed">
                Tradición chilena e ingredientes de primer nivel en todas nuestras chorrillanas, colaciones y sushi.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-salvia/10 text-salvia rounded-full shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-verde-profundo">Calidad & Higiene</h3>
              <p className="text-xs text-verde-oscuro/85 mt-1 leading-relaxed">
                Elaboración rigurosa con altos estándares de calidad, garantizando frescura e inocuidad en cada plato.
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-salvia/10 text-salvia rounded-full shrink-0">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-verde-profundo">Listo en Minutos</h3>
              <p className="text-xs text-verde-oscuro/85 mt-1 leading-relaxed">
                Pide en línea y retíralo directamente en caja a la hora señalada, caliente y listo, sin esperas ni demoras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Modal overlay */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Printable Coupon Modal */}
      {showPrintCoupon && (
        <div
          id="printable-coupon-modal"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0 print:static print:bg-transparent"
        >
          {/* Main card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-salvia/20 relative shadow-2xl print:shadow-none print:border-none print:p-0 print:w-full">
            {/* Close button (hides in print) */}
            <button
              onClick={() => setShowPrintCoupon(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-vegetal text-verde-profundo hover:bg-salvia/20 transition-all no-print cursor-pointer"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Coupon content with dashed border */}
            <div className="border-2 border-dashed border-salvia/40 rounded-2xl p-6 bg-crema/20 text-center relative print:border-black print:bg-white print:m-4">
              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Utensils className="h-6 w-6 text-salvia print:text-black" />
                <span className="font-serif text-xl font-bold text-verde-profundo print:text-black">Restobar Nehuenco</span>
              </div>
              <p className="text-[10px] text-salvia uppercase tracking-widest font-bold mb-4 print:text-black">Cunco, La Araucanía</p>

              {/* Discount badge */}
              <div className="bg-durazno/50 border border-durazno rounded-2xl py-4 px-2 mb-6 print:border-black print:bg-transparent">
                <span className="block text-xs uppercase tracking-wider text-verde-profundo/80 font-bold print:text-black">CUPÓN DE DESCUENTO PRESENCIAL</span>
                <span className="block text-4xl font-serif font-black text-verde-profundo my-1 print:text-black">15% OFF</span>
                <span className="block text-[10px] text-verde-oscuro print:text-black font-semibold">VÁLIDO PARA RETIRO O CONSUMO EN EL LOCAL</span>
              </div>

              {/* QR Code SVG */}
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="bg-white p-3 rounded-2xl border border-salvia/10 shadow-sm print:border-black print:shadow-none">
                  {/* Clean SVG QR code representing code "NEHUENCO-15-CUNCO" */}
                  <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    <rect x="5" y="5" width="25" height="25" fill="black" />
                    <rect x="9" y="9" width="17" height="17" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="black" />
                    <rect x="70" y="5" width="25" height="25" fill="black" />
                    <rect x="74" y="9" width="17" height="17" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="black" />
                    <rect x="5" y="70" width="25" height="25" fill="black" />
                    <rect x="9" y="74" width="17" height="17" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="black" />
                    <rect x="55" y="55" width="10" height="10" fill="black" />
                    <rect x="57" y="57" width="6" height="6" fill="white" />
                    <rect x="59" y="59" width="2" height="2" fill="black" />
                    <rect x="35" y="5" width="5" height="5" fill="black" />
                    <rect x="45" y="5" width="5" height="5" fill="black" />
                    <rect x="55" y="5" width="10" height="5" fill="black" />
                    <rect x="35" y="15" width="10" height="5" fill="black" />
                    <rect x="50" y="15" width="5" height="5" fill="black" />
                    <rect x="60" y="15" width="5" height="5" fill="black" />
                    <rect x="35" y="25" width="5" height="10" fill="black" />
                    <rect x="45" y="25" width="15" height="5" fill="black" />
                    <rect x="5" y="35" width="5" height="15" fill="black" />
                    <rect x="15" y="35" width="10" height="5" fill="black" />
                    <rect x="30" y="35" width="5" height="5" fill="black" />
                    <rect x="40" y="35" width="5" height="10" fill="black" />
                    <rect x="50" y="35" width="15" height="5" fill="black" />
                    <rect x="70" y="35" width="10" height="5" fill="black" />
                    <rect x="85" y="35" width="10" height="5" fill="black" />
                    <rect x="10" y="45" width="15" height="5" fill="black" />
                    <rect x="30" y="45" width="5" height="15" fill="black" />
                    <rect x="40" y="50" width="10" height="5" fill="black" />
                    <rect x="55" y="45" width="5" height="10" fill="black" />
                    <rect x="65" y="45" width="25" height="5" fill="black" />
                    <rect x="5" y="55" width="10" height="5" fill="black" />
                    <rect x="20" y="55" width="5" height="10" fill="black" />
                    <rect x="35" y="55" width="15" height="5" fill="black" />
                    <rect x="70" y="55" width="5" height="15" fill="black" />
                    <rect x="80" y="55" width="15" height="5" fill="black" />
                    <rect x="35" y="65" width="5" height="10" fill="black" />
                    <rect x="45" y="65" width="10" height="5" fill="black" />
                    <rect x="80" y="65" width="5" height="15" fill="black" />
                    <rect x="90" y="65" width="5" height="5" fill="black" />
                    <rect x="35" y="80" width="15" height="5" fill="black" />
                    <rect x="55" y="80" width="5" height="10" fill="black" />
                    <rect x="65" y="80" width="10" height="5" fill="black" />
                    <rect x="85" y="80" width="10" height="5" fill="black" />
                    <rect x="35" y="90" width="5" height="5" fill="black" />
                    <rect x="45" y="90" width="15" height="5" fill="black" />
                    <rect x="70" y="90" width="10" height="5" fill="black" />
                    <rect x="90" y="90" width="5" height="5" fill="black" />
                  </svg>
                </div>
                <span className="block text-[11px] font-mono mt-2 tracking-widest text-verde-oscuro/80 print:text-black font-bold">
                  COD: NEHUENCO15CUNCO
                </span>
              </div>

              {/* Terms */}
              <p className="text-[10px] text-verde-oscuro/70 leading-normal max-w-[280px] mx-auto print:text-black">
                Muestra este código QR al cajero en el mesón para validar tu descuento. No acumulable con otras promociones.
              </p>
            </div>

            {/* Print and Close buttons (hidden in print mode) */}
            <div className="mt-6 flex gap-3 no-print">
              <button
                onClick={() => setShowPrintCoupon(false)}
                className="flex-1 border border-salvia/30 text-verde-profundo font-bold py-3 rounded-full hover:bg-vegetal transition-all active:scale-95 text-sm cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={handlePrintCoupon}
                className="flex-1 bg-verde-profundo text-white font-bold py-3 rounded-full hover:bg-salvia transition-all shadow active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
