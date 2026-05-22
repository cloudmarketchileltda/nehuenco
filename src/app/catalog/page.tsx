"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStore, Product } from "@/store/useStore";
import { Search, Clock, Plus, Info, Leaf, Sparkles } from "lucide-react";
import ProductModal from "@/components/features/ProductModal";

// Category list
const CATEGORIES = ["Todos", "Comida Rapida", "Colaciones", "Especialidades", "Bebidas y Jugos", "Cervezas y Vinos"] as const;

function CatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const products = useStore((state) => state.products);
  const addToCart = useStore((state) => state.addToCart);

  // States
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [successBadgeId, setSuccessBadgeId] = useState<string | null>(null);

  // Sync category state from URL query parameters
  useEffect(() => {
    const catQuery = searchParams.get("category");
    if (catQuery && CATEGORIES.includes(catQuery as any)) {
      setSelectedCategory(catQuery);
    } else {
      setSelectedCategory("Todos");
    }
  }, [searchParams]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams.toString());
    if (cat === "Todos") {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    router.replace(`/catalog?${newParams.toString()}`);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); // Avoid opening the modal
    if (!product.isAvailable) return;
    addToCart(product, 1, "");
    setSuccessBadgeId(product.id);
    setTimeout(() => setSuccessBadgeId(null), 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col">
      {/* 1. Title & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold text-salvia uppercase tracking-widest font-sans">Nuestra Carta</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-verde-profundo mt-1">Nuestra Carta</h1>
          <p className="text-sm text-verde-oscuro/85 mt-1 font-sans">
            Comida tradicional chilena, sushi y tragos. Elige tus favoritos para retirar en caja.
          </p>
        </div>

        {/* Live Search */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            placeholder="Buscar por nombre o ingrediente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm pl-10 pr-4 py-3 bg-white border border-salvia/25 rounded-2xl focus:outline-none focus:ring-2 focus:ring-salvia text-verde-profundo shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-salvia" />
        </div>
      </div>

      {/* 2. Category Filters (Horizontal scroll on mobile) */}
      <div className="w-full overflow-x-auto pb-4 mb-8 flex gap-2 scrollbar-none snap-x">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 snap-start active:scale-95 shadow-sm border ${
                isActive
                  ? "bg-verde-profundo text-white border-verde-profundo"
                  : "bg-white text-verde-oscuro hover:text-salvia border-salvia/20 hover:border-salvia/30"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-salvia/20">
          <Search className="h-12 w-12 text-salvia/40 mb-3" />
          <h3 className="text-lg font-serif font-bold text-verde-profundo">No se encontraron productos</h3>
          <p className="text-xs text-verde-oscuro/80 mt-1 max-w-xs">
            Intenta buscando otra palabra o seleccionando una categoría diferente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const isSuccess = successBadgeId === product.id;
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`bg-white rounded-3xl overflow-hidden border transition-all flex flex-col justify-between shadow-sm relative group cursor-pointer ${
                  product.isAvailable
                    ? "border-salvia/15 hover:border-salvia/40 hover:shadow-xl"
                    : "border-gray-200 bg-gray-50/50 opacity-80"
                }`}
              >
                {/* Product Image */}
                <div className="relative aspect-video w-full bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      product.isAvailable ? "group-hover:scale-105" : "filter grayscale-[40%]"
                    }`}
                  />

                  {/* Attributes floating */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {product.badges.map((badge) => (
                      <span
                        key={badge}
                        className="bg-white/90 backdrop-blur text-[9px] font-bold text-verde-profundo px-2.5 py-0.5 rounded-full shadow-sm"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Unavailable tag */}
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-red-600 text-white font-sans text-xs font-bold px-4 py-1.5 rounded-full shadow">
                        Agotado por hoy
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-salvia uppercase tracking-wider">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-verde-oscuro font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3 text-salvia" />
                        {product.prepTime} min
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-verde-profundo mt-1 group-hover:text-salvia transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-verde-oscuro/85 mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="font-sans font-bold text-base text-verde-profundo">
                      {formatCurrency(product.price)}
                    </span>

                    {product.isAvailable ? (
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`p-2.5 rounded-full shadow transition-all active:scale-90 ${
                          isSuccess
                            ? "bg-salvia text-white"
                            : "bg-verde-profundo text-vegetal hover:bg-salvia"
                        }`}
                        title="Agregar al carro"
                      >
                        <Plus className="h-4.5 w-4.5" />
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-gray-400 italic">No disponible</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Detail Modal Overlay */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-vegetal text-verde-profundo font-sans">
        <Leaf className="h-10 w-10 text-salvia animate-bounce mb-3" />
        <span className="text-sm font-semibold">Cargando nuestra carta...</span>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
