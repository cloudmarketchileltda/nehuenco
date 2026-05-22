"use client";

import { useState } from "react";
import { useStore, Product, Order } from "@/store/useStore";
import {
  LayoutDashboard,
  ShoppingBag,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Settings,
  DollarSign,
  TrendingUp,
  Clock,
  User,
  Check,
  Percent,
  X,
  FileText,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Utensils
} from "lucide-react";

export default function AdminPage() {
  const {
    products,
    orders,
    config,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    updateConfig,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
  } = useStore();

  // Login form states
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const success = loginAdmin(usernameInput, passwordInput);
    if (!success) {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };

  // Tab control state
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "products" | "settings">("dashboard");

  // Product CRUD states
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for Product
  const [pName, setPName] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pPrice, setPPrice] = useState(0);
  const [pCategory, setPCategory] = useState<Product["category"]>("Comida Rapida");
  const [pPrepTime, setPPrepTime] = useState(10);
  const [pBadges, setPBadges] = useState("");
  const [pImage, setPImage] = useState("");

  // Settings states
  const [couponCode, setCouponCode] = useState("");
  const [couponDesc, setCouponDesc] = useState("");
  const [couponPercent, setCouponPercent] = useState(10);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Formatter for CLP currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val);
  };

  // Metrics calculation
  const totalSalesVal = orders.reduce((sum, o) => sum + o.total, 0);
  // Initial requested values: 8 active orders, $124.700 sales, 12 units of Bowl Proteico
  // We can merge mock defaults with current store updates dynamically
  const activeOrdersCount = orders.filter((o) => o.status !== "Retirado").length;
  const displaySales = Math.max(124700, totalSalesVal);
  const displayActiveCount = Math.max(8, activeOrdersCount);

  // Sales Chart hourly representation (bar heights based on percentages)
  const hourlySales = [
    { hour: "12:00", sales: 12000, height: "30%" },
    { hour: "13:00", sales: 45000, height: "100%" }, // Peak sales hour
    { hour: "14:00", sales: 28000, height: "70%" },
    { hour: "15:00", sales: 8000, height: "20%" },
    { hour: "16:00", sales: 4000, height: "10%" },
    { hour: "17:00", sales: 6000, height: "15%" },
    { hour: "18:00", sales: 15000, height: "40%" },
    { hour: "19:00", sales: 22000, height: "55%" },
    { hour: "20:00", sales: 34000, height: "80%" },
    { hour: "21:00", sales: 18000, height: "45%" },
  ];

  // Helper for status transitions
  const getNextStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "Recibido":
        return "Comenzar Preparación";
      case "Preparando":
        return "Marcar como Listo";
      case "Listo":
        return "Entregar Pedido";
      default:
        return null;
    }
  };

  const handleStatusTransition = (orderId: string, currentStatus: Order["status"]) => {
    if (currentStatus === "Recibido") {
      updateOrderStatus(orderId, "Preparando");
    } else if (currentStatus === "Preparando") {
      updateOrderStatus(orderId, "Listo");
    } else if (currentStatus === "Listo") {
      updateOrderStatus(orderId, "Retirado");
    }
  };

  // Product submit handler
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const badgesArray = pBadges ? pBadges.split(",").map((b) => b.trim()) : [];
    const imageUrl = pImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

    const payload = {
      name: pName,
      description: pDescription,
      price: Number(pPrice),
      category: pCategory,
      prepTime: Number(pPrepTime),
      badges: badgesArray,
      image: imageUrl,
      isAvailable: true,
      isFeatured: false,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
    } else {
      addProduct(payload);
    }

    // Reset forms
    setIsAddingProduct(false);
    setPName("");
    setPDescription("");
    setPPrice(0);
    setPPrepTime(10);
    setPBadges("");
    setPImage("");
  };

  const handleEditProductClick = (product: Product) => {
    setEditingProduct(product);
    setPName(product.name);
    setPDescription(product.description);
    setPPrice(product.price);
    setPCategory(product.category);
    setPPrepTime(product.prepTime);
    setPBadges(product.badges.join(", "));
    setPImage(product.image);
    setIsAddingProduct(true);
  };

  const handleCancelProductEdit = () => {
    setEditingProduct(null);
    setIsAddingProduct(false);
    setPName("");
    setPDescription("");
    setPPrice(0);
    setPPrepTime(10);
    setPBadges("");
    setPImage("");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[315px] w-full space-y-5.5 glass rounded-3xl border border-salvia/20 shadow-2xl p-6 transition-all duration-300">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 bg-salvia text-vegetal p-2 rounded-full shadow-md flex items-center justify-center mb-3">
              <Utensils className="h-5 w-5" />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-verde-profundo">
              Nehuenco
            </h2>
            <p className="mt-1 text-[9px] font-semibold text-verde-oscuro uppercase tracking-widest font-sans">
              Panel de Administración
            </p>
          </div>
          
          <form className="mt-5 space-y-3.5 text-[11px] text-verde-profundo" onSubmit={handleLoginSubmit}>
            {loginError && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-2.5 text-[10px] font-semibold leading-relaxed flex items-center gap-1.5">
                <span className="shrink-0 h-1.5 w-1.5 rounded-full bg-red-500"></span>
                {loginError}
              </div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="username" className="block text-[9px] font-bold uppercase tracking-wider text-verde-oscuro">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-verde-oscuro/60">
                  <User className="h-3.5 w-3.5" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full pl-8.5 pr-3 py-2.5 border border-salvia/20 rounded-lg bg-white text-verde-profundo focus:ring-2 focus:ring-salvia/40 focus:border-salvia outline-none text-xs transition-all shadow-sm"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-[9px] font-bold uppercase tracking-wider text-verde-oscuro">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-verde-oscuro/60">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-8.5 pr-8 py-2.5 border border-salvia/20 rounded-lg bg-white text-verde-profundo focus:ring-2 focus:ring-salvia/40 focus:border-salvia outline-none text-xs transition-all shadow-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-verde-oscuro/60 hover:text-salvia"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="pt-1.5">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2.5 px-3 border border-transparent text-xs font-bold rounded-lg text-white bg-verde-profundo hover:bg-salvia focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-salvia transition-all shadow-md active:scale-[0.98] cursor-pointer"
              >
                Iniciar Sesión
              </button>
            </div>
          </form>

          {/* Demo Credentials Helper Box */}
          <div className="mt-4 p-2.5 bg-salvia/5 border border-salvia/10 rounded-xl text-center">
            <p className="text-[10px] text-verde-oscuro font-bold">
              🔑 Modo Demo (Credenciales):
            </p>
            <p className="text-[10px] font-mono text-verde-profundo mt-0.5 select-all">
              admin / nehuenco2026
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex-1">
      {/* Header Title */}
      <div className="mb-8">
        <span className="text-xs font-bold text-salvia uppercase tracking-widest font-sans">Módulo Operativo</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-verde-profundo mt-1">Panel de Administración</h1>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border border-salvia/10 shadow-sm flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 w-auto lg:w-full ${
              activeTab === "dashboard"
                ? "bg-verde-profundo text-white"
                : "text-verde-oscuro hover:bg-vegetal"
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 w-auto lg:w-full ${
              activeTab === "orders"
                ? "bg-verde-profundo text-white"
                : "text-verde-oscuro hover:bg-vegetal"
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" /> Pedidos Activos
            <span className="ml-auto bg-durazno text-verde-profundo text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
              {orders.filter((o) => o.status !== "Retirado").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 w-auto lg:w-full ${
              activeTab === "products"
                ? "bg-verde-profundo text-white"
                : "text-verde-oscuro hover:bg-vegetal"
            }`}
          >
            <FileText className="h-4.5 w-4.5" /> Inventario Carta
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 w-auto lg:w-full ${
              activeTab === "settings"
                ? "bg-verde-profundo text-white"
                : "text-verde-oscuro hover:bg-vegetal"
            }`}
          >
            <Settings className="h-4.5 w-4.5" /> Configuración
          </button>
          
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-2.5 px-4.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shrink-0 w-auto lg:w-full text-red-500 hover:bg-red-50 lg:mt-auto lg:pt-3 lg:border-t lg:border-salvia/10"
          >
            <LogOut className="h-4.5 w-4.5" /> Cerrar Sesión
          </button>
        </div>

        {/* Content Area (Col span 3) */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Metrics row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-salvia/10 text-salvia rounded-2xl">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ingresos Hoy</span>
                    <strong className="text-xl text-verde-profundo">{formatCurrency(displaySales)}</strong>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-salvia/10 text-salvia rounded-2xl">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pedidos Activos</span>
                    <strong className="text-xl text-verde-profundo">{displayActiveCount}</strong>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm flex items-center gap-4">
                  <div className="p-3.5 bg-salvia/10 text-salvia rounded-2xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">Más Vendido</span>
                    <strong className="text-sm font-bold text-verde-profundo truncate block max-w-[150px]" title="Bowl Proteico Nehuenco">
                      Bowl Proteico (12 u)
                    </strong>
                  </div>
                </div>
              </div>

              {/* Sales graph & order list split */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Sales graph (Col 2) */}
                <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-verde-profundo">Ventas por Hora</h3>
                  <div className="h-48 flex items-end justify-between gap-1 pt-6 border-b border-gray-150 relative">
                    {hourlySales.map((h) => (
                      <div key={h.hour} className="flex flex-col items-center flex-1 group">
                        {/* Interactive tooltip */}
                        <span className="absolute bottom-full text-[9px] bg-verde-profundo text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mb-1 font-mono">
                          {formatCurrency(h.sales)}
                        </span>
                        {/* Bar */}
                        <div
                          className="w-full bg-salvia/70 group-hover:bg-verde-profundo rounded-t-sm transition-all"
                          style={{ height: h.height }}
                        ></div>
                        <span className="text-[9px] text-gray-400 mt-2 font-mono">{h.hour.split(":")[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders feed (Col 3) */}
                <div className="md:col-span-3 bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-bold text-verde-profundo">Pedidos Activos Recientes</h3>
                  <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                    {orders.filter((o) => o.status !== "Retirado").length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">No hay pedidos activos.</p>
                    ) : (
                      orders
                        .filter((o) => o.status !== "Retirado")
                        .map((order) => (
                          <div key={order.id} className="py-2.5 flex justify-between items-center text-xs">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <strong className="text-verde-profundo">{order.customerName}</strong>
                                <span className="font-mono text-[10px] text-gray-400">({order.id.slice(-3)})</span>
                              </div>
                              <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                                {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(", ")}
                              </span>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                order.status === "Recibido"
                                  ? "bg-sky-100 text-sky-800"
                                  : order.status === "Preparando"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE ORDERS MANAGEMENT */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-verde-profundo pb-3 border-b border-gray-100">
                Gestión Operativa de Pedidos
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">No hay registros de órdenes.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[600px] border-collapse">
                    <thead>
                      <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="py-3 px-2">ID Orden</th>
                        <th className="py-3 px-2">Cliente</th>
                        <th className="py-3 px-2">Productos</th>
                        <th className="py-3 px-2">Total</th>
                        <th className="py-3 px-2">Estado</th>
                        <th className="py-3 px-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-verde-profundo">
                      {orders.map((order) => {
                        const nextActionLabel = getNextStatusLabel(order.status);
                        return (
                          <tr key={order.id} className="hover:bg-vegetal/30 transition-colors">
                            <td className="py-4 px-2 font-mono font-bold text-gray-800">{order.id}</td>
                            <td className="py-4 px-2">
                              <span className="block font-bold">{order.customerName}</span>
                              <span className="text-[10px] text-gray-500">{order.phone}</span>
                            </td>
                            <td className="py-4 px-2 max-w-[200px] truncate" title={order.items.map((i) => i.product.name).join(", ")}>
                              {order.items.map((i) => `${i.product.name} (x${i.quantity})`).join(", ")}
                              {order.notes && <span className="block text-[9px] text-salvia italic mt-0.5">"{order.notes}"</span>}
                            </td>
                            <td className="py-4 px-2 font-bold">{formatCurrency(order.total)}</td>
                            <td className="py-4 px-2">
                              <span
                                className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                                  order.status === "Recibido"
                                    ? "bg-sky-100 text-sky-800 border-sky-200"
                                    : order.status === "Preparando"
                                    ? "bg-amber-100 text-amber-800 border-amber-250 animate-pulse"
                                    : order.status === "Listo"
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-250"
                                    : "bg-gray-100 text-gray-700 border-gray-250"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 px-2 text-right">
                              {nextActionLabel ? (
                                <button
                                  onClick={() => handleStatusTransition(order.id, order.status)}
                                  className="bg-salvia hover:bg-verde-profundo text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  {nextActionLabel}
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400 font-semibold italic">Entregado</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS CART INVENTORY (CRUD) */}
          {activeTab === "products" && (
            <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="font-serif text-lg font-bold text-verde-profundo">Carta & Inventario</h3>
                <button
                  onClick={() => setIsAddingProduct(true)}
                  className="bg-verde-profundo hover:bg-salvia text-white font-bold text-xs px-4.5 py-2.5 rounded-full shadow-sm flex items-center gap-1 shrink-0 transition-all active:scale-95"
                >
                  <Plus className="h-4 w-4" /> Añadir Producto
                </button>
              </div>

              {/* CRUD table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px] border-collapse">
                  <thead>
                    <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Producto</th>
                      <th className="py-3 px-2">Categoría</th>
                      <th className="py-3 px-2">Precio</th>
                      <th className="py-3 px-2">Prep.</th>
                      <th className="py-3 px-2">Estado</th>
                      <th className="py-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-verde-profundo">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-vegetal/30 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0"
                            />
                            <div>
                              <strong className="block font-bold">{product.name}</strong>
                              <span className="text-[10px] text-gray-400 line-clamp-1">{product.description}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">{product.category}</td>
                        <td className="py-3 px-2 font-bold">{formatCurrency(product.price)}</td>
                        <td className="py-3 px-2 font-mono">{product.prepTime}m</td>
                        <td className="py-3 px-2">
                          <button
                            onClick={() => toggleProductAvailability(product.id)}
                            className="flex items-center gap-1.5 focus:outline-none"
                            title="Cambiar Disponibilidad"
                          >
                            {product.isAvailable ? (
                              <>
                                <ToggleRight className="h-6 w-6 text-salvia shrink-0" />
                                <span className="text-[10px] text-salvia font-bold uppercase">Disponible</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="h-6 w-6 text-red-400 shrink-0" />
                                <span className="text-[10px] text-red-500 font-bold uppercase">Agotado</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-2 text-right space-x-1.5 shrink-0">
                          <button
                            onClick={() => handleEditProductClick(product)}
                            className="text-xs text-salvia hover:text-verde-profundo font-bold hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-gray-300 hover:text-red-650 transition-colors p-1"
                            title="Eliminar producto de la carta"
                          >
                            <Trash2 className="h-4 w-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add/Edit Product Modal Dialog Overlay */}
              {isAddingProduct && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                  <div className="fixed inset-0 bg-verde-profundo/45 backdrop-blur-sm" onClick={handleCancelProductEdit}></div>
                  <div className="relative bg-vegetal rounded-3xl border border-salvia/20 shadow-2xl p-6 sm:p-8 max-w-md w-full space-y-4">
                    <button onClick={handleCancelProductEdit} className="absolute top-4 right-4 text-verde-oscuro hover:text-red-600">
                      <X className="h-5 w-5" />
                    </button>

                    <h3 className="font-serif text-lg font-bold text-verde-profundo">
                      {editingProduct ? "Editar Producto" : "Nuevo Plato / Bebida"}
                    </h3>

                    <form onSubmit={handleProductSubmit} className="space-y-3.5 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-verde-profundo mb-1">Nombre</label>
                        <input
                          type="text"
                          required
                          value={pName}
                          onChange={(e) => setPName(e.target.value)}
                          placeholder="Ej: Bowl Mediterráneo Deluxe"
                          className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-verde-profundo mb-1">Categoría</label>
                          <select
                            value={pCategory}
                            onChange={(e) => setPCategory(e.target.value as any)}
                            className="w-full text-xs border border-salvia/20 rounded-lg px-2.5 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                          >
                            <option value="Comida Rapida">Comida Rapida</option>
                            <option value="Colaciones">Colaciones</option>
                            <option value="Especialidades">Especialidades</option>
                            <option value="Bebidas y Jugos">Bebidas y Jugos</option>
                            <option value="Cervezas y Vinos">Cervezas y Vinos</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-verde-profundo mb-1">Precio (CLP)</label>
                          <input
                            type="number"
                            required
                            value={pPrice}
                            onChange={(e) => setPPrice(Number(e.target.value))}
                            placeholder="7900"
                            className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-verde-profundo mb-1">Prep. (minutos)</label>
                          <input
                            type="number"
                            required
                            value={pPrepTime}
                            onChange={(e) => setPPrepTime(Number(e.target.value))}
                            placeholder="12"
                            className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-verde-profundo mb-1">Imagen URL (opcional)</label>
                          <input
                            type="text"
                            value={pImage}
                            onChange={(e) => setPImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-verde-profundo mb-1">Etiquetas (separadas por coma)</label>
                        <input
                          type="text"
                          value={pBadges}
                          onChange={(e) => setPBadges(e.target.value)}
                          placeholder="Vegano, Sin Gluten, Orgánico"
                          className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-verde-profundo mb-1">Descripción</label>
                        <textarea
                          required
                          value={pDescription}
                          onChange={(e) => setPDescription(e.target.value)}
                          placeholder="Escribe el detalle del plato e ingredientes principales..."
                          rows={3}
                          className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none resize-none"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleCancelProductEdit}
                          className="flex-1 border border-gray-250 text-gray-600 font-bold py-2.5 rounded-xl hover:bg-zinc-50"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-verde-profundo text-white font-bold py-2.5 rounded-xl hover:bg-salvia"
                        >
                          {editingProduct ? "Actualizar" : "Agregar"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GENERAL RESTOBAR SETTINGS & PROMOS */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Store open status & details */}
              <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-verde-profundo flex items-center gap-2">
                  <Settings className="h-4.5 w-4.5 text-salvia" /> Configuración General Local
                </h3>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs text-verde-profundo">
                  <div className="flex items-center justify-between p-4 bg-vegetal/40 rounded-2xl border border-salvia/10">
                    <div>
                      <span className="block font-bold text-sm">Estado Operacional del Local</span>
                      <span className="text-[10px] text-gray-500">
                        {config.isOpen ? "🟢 El restobar está abierto al público." : "🔴 El restobar está actualmente cerrado."}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateConfig({ isOpen: !config.isOpen })}
                      className="focus:outline-none"
                    >
                      {config.isOpen ? (
                        <ToggleRight className="h-8 w-8 text-salvia" />
                      ) : (
                        <ToggleLeft className="h-8 w-8 text-gray-300" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold mb-1">Conversión Club Puntos (CLP por punto)</label>
                      <input
                        type="number"
                        value={config.pointsExchangeRate}
                        onChange={(e) => updateConfig({ pointsExchangeRate: Number(e.target.value) })}
                        className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                      />
                      <span className="text-[9px] text-gray-400 mt-1 block">
                        Actualmente: 1 punto acumulado equivale a {formatCurrency(config.pointsExchangeRate)} de descuento.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold mb-1">Mensaje de Bienvenida Local</label>
                      <input
                        type="text"
                        value={config.welcomeMessage}
                        onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                        className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo focus:ring-1 focus:ring-salvia outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-verde-profundo hover:bg-salvia text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow active:scale-95"
                    >
                      Guardar Configuración
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons management */}
              <div className="bg-white rounded-3xl p-6 border border-salvia/10 shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-verde-profundo flex items-center gap-2">
                  <Percent className="h-4.5 w-4.5 text-salvia" /> Gestor de Cupones y Descuentos
                </h3>

                <div className="bg-vegetal/30 rounded-2xl p-4.5 border border-salvia/10 space-y-3.5">
                  <span className="block text-[10px] font-bold text-verde-profundo uppercase tracking-wider">Crear Nuevo Cupón</span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Código (Ej: VERDE20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo uppercase outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Descripción corta"
                        value={couponDesc}
                        onChange={(e) => setCouponDesc(e.target.value)}
                        className="w-full text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo outline-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="% Descuento"
                        value={couponPercent}
                        onChange={(e) => setCouponPercent(Number(e.target.value))}
                        className="flex-1 text-xs border border-salvia/20 rounded-lg px-3 py-2 bg-white text-verde-profundo outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!couponCode || !couponDesc) {
                            alert("Por favor ingresa código y descripción.");
                            return;
                          }
                          // Add code to user store coupons for simplicity or global coupons
                          useStore.setState((state) => ({
                            user: {
                              ...state.user,
                              coupons: [
                                ...state.user.coupons,
                                { code: couponCode.toUpperCase(), description: couponDesc, discountPercent: couponPercent },
                              ],
                            },
                          }));
                          setCouponCode("");
                          setCouponDesc("");
                          alert(`¡Cupón ${couponCode.toUpperCase()} creado con éxito!`);
                        }}
                        className="bg-salvia text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-verde-profundo transition-colors"
                      >
                        Crear
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
