"use client";

import { useState, useEffect } from "react";
import { useStore, Product } from "@/store/useStore";
import { X, Clock, Leaf, Plus, Minus, Check, AlertCircle } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const addToCart = useStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setNotes("");
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity, notes);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1000);
  };

  // Formatter for CLP currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  // Mocked rich detail for food descriptions
  const getProductDetails = (prod: Product) => {
    switch (prod.category) {
      case "Comida Rapida":
        return {
          ingredients: "Pan artesanal horneado a diario, vienesas de primera calidad, carne seleccionada picada, papas fritas doradas, palta Hass, tomate, cebolla caramelizada y huevo de campo, acompañado de aderezos caseros.",
          allergens: "Contiene gluten y huevo (en la mayonesa casera).",
        };
      case "Colaciones":
        return {
          ingredients: "Platos tradicionales chilenos preparados diariamente con carnes seleccionadas, verduras de temporada, sofrito casero y aliños típicos nacionales.",
          allergens: "Varía según el plato. Puede contener gluten, huevo o lácteos.",
        };
      case "Especialidades":
        return {
          ingredients: "Arroz de sushi premium aderezado, algas nori, salmón fresco, camarón ecuatoriano, queso crema suave y cebollín fresco, fritos en tempura o envueltos en palta.",
          allergens: "Contiene pescado, mariscos y lácteos (queso crema).",
        };
      case "Bebidas y Jugos":
        return {
          ingredients: "Bebidas gaseosas heladas en lata o jugos naturales preparados al instante con pulpa de fruta seleccionada y hielo molido.",
          allergens: "Naturalmente libre de alérgenos comunes.",
        };
      case "Cervezas y Vinos":
        return {
          ingredients: "Cervezas artesanales seleccionadas heladas, vinos tintos reservas de la zona, o tragos tradicionales como terremoto y pisco sour preparados al instante.",
          allergens: "Las cervezas contienen gluten (cebada). Contiene sulfitos (vinos). Venta exclusiva para mayores de 18 años.",
        };
      default:
        return {
          ingredients: "Ingredientes seleccionados, recetas tradicionales de la casa.",
          allergens: "Revisar con nuestro personal si tiene alergias alimentarias específicas.",
        };
    }
  };

  const details = getProductDetails(product);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-verde-profundo/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-vegetal w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-salvia/20 transform transition-all duration-300 scale-100 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/45 text-white hover:bg-black/60 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Side: Photo */}
        <div className="w-full md:w-1/2 h-48 md:h-auto md:min-h-[350px] relative bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Attributes floating */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="bg-white/90 backdrop-blur text-verde-profundo px-3 py-1 rounded-full text-xs font-bold shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Information & Ordering */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-salvia uppercase tracking-wider">
              {product.category}
            </span>
            <h3 className="text-2xl font-serif font-bold text-verde-profundo mt-1">
              {product.name}
            </h3>

            {/* Price & Prep time */}
            <div className="flex items-center gap-4 mt-3">
              <span className="text-xl font-bold text-verde-profundo">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs text-verde-oscuro font-medium flex items-center gap-1 bg-white border border-salvia/10 px-2 py-1 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-salvia" />
                {product.prepTime} min
              </span>
            </div>

            <p className="text-sm text-verde-oscuro/85 mt-4 leading-relaxed">
              {product.description}
            </p>

            {/* Ingredients & Allergens info */}
            <div className="mt-5 space-y-3.5 bg-white/50 p-4 rounded-2xl border border-salvia/5">
              <div className="text-xs">
                <span className="block font-bold text-verde-profundo mb-0.5">Detalle e Ingredientes:</span>
                <span className="text-verde-oscuro/80">{details.ingredients}</span>
              </div>
              <div className="text-xs flex gap-1.5 items-start">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-amber-800">Alérgenos:</span>
                  <span className="text-amber-700/80">{details.allergens}</span>
                </div>
              </div>
            </div>

            {/* Chef Notes input */}
            <div className="mt-5">
              <label htmlFor="modal-notes" className="block text-xs font-bold text-verde-profundo mb-1.5">
                Instrucciones especiales para cocina (opcional):
              </label>
              <textarea
                id="modal-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Sin sal, aderezo aparte, bien tostado..."
                rows={2}
                className="w-full text-xs border border-salvia/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-salvia bg-white text-verde-profundo resize-none"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-6 border-t border-salvia/10 flex items-center justify-between gap-4">
            {/* Quantity controls */}
            {product.isAvailable ? (
              <>
                <div className="flex items-center border border-salvia/30 rounded-full bg-white shadow-sm overflow-hidden shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-verde-oscuro hover:bg-salvia/10 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-base font-bold text-verde-profundo font-mono select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-verde-oscuro hover:bg-salvia/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add button */}
                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-full shadow transition-all active:scale-95 text-center text-sm ${
                    added
                      ? "bg-salvia text-white"
                      : "bg-verde-profundo text-white hover:bg-salvia"
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="h-4 w-4" />
                      Agregado
                    </>
                  ) : (
                    <>
                      Agregar • {formatCurrency(product.price * quantity)}
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="w-full text-center bg-gray-200 text-gray-500 font-bold py-3.5 px-6 rounded-full">
                Agotado por hoy
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
