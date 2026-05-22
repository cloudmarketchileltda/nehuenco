import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "Comida Rapida" | "Colaciones" | "Especialidades" | "Bebidas y Jugos" | "Cervezas y Vinos";
  image: string;
  badges: string[]; // e.g. ["Popular", "Casero", "XL", "Chef recomienda"]
  prepTime: number; // in minutes
  isAvailable: boolean;
  isFeatured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  items: CartItem[];
  subtotal: number;
  discountPoints: number;
  discountCoupon: number;
  total: number;
  status: "Recibido" | "Preparando" | "Listo" | "Retirado";
  createdAt: string;
  estimatedTime: string;
  notes?: string;
  pointsEarned: number;
  pointsRedeemed: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  points: number;
  tier: "Plata Bosque" | "Oro Cóndor" | "Bronce Semilla";
  nextTierPoints: number;
  nextTierName: string;
  coupons: { code: string; description: string; discountPercent: number }[];
}

export interface StoreConfig {
  isOpen: boolean;
  pointsExchangeRate: number; // $ value per point (e.g. 10 pesos per point)
  welcomeMessage: string;
}

interface State {
  products: Product[];
  cart: CartItem[];
  user: UserProfile;
  orders: Order[];
  config: StoreConfig;
  activeOrderFilter: string;
  isAdminAuthenticated: boolean;
}

interface Actions {
  // Cart Actions
  addToCart: (product: Product, quantity?: number, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  updateCartNotes: (productId: string, notes: string) => void;
  clearCart: () => void;

  // User Actions
  redeemPoints: (pointsToRedeem: number) => void;
  addPoints: (pointsToAdd: number) => void;
  useCoupon: (code: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Order Actions
  placeOrder: (order: Omit<Order, "id" | "createdAt" | "status" | "pointsEarned">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  simulateOrderTransitions: () => void;

  // Admin Product CRUD
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;

  // Admin Config
  updateConfig: (config: Partial<StoreConfig>) => void;

  // Admin Auth Actions
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
}

// Initial items representing Chilean comfort food and Sushi
const INITIAL_PRODUCTS: Product[] = [
  // Comida Rapida
  {
    id: "completo-tradicional",
    name: "Completos",
    description: "Vienesa tradicional chilena, chucrut, salsa americana, tomate picado y mayonesa casera en pan artesanal.",
    price: 3000,
    category: "Comida Rapida",
    image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80",
    badges: ["Tradicional", "Casero"],
    prepTime: 8,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "completo-italiano",
    name: "Italianos",
    description: "Vienesa tradicional chilena, tomate fresco picado en cubos, palta molida cremosa y abundante mayonesa casera.",
    price: 3200,
    category: "Comida Rapida",
    image: "https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&w=800&q=80",
    badges: ["Popular", "El Favorito"],
    prepTime: 8,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "sandwich-queso",
    name: "Sándwich Queso",
    description: "Abundante queso mantecoso fundido caliente en pan crujiente. Elige tu proteína: pollo o carne.",
    price: 4800,
    category: "Comida Rapida",
    image: "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=800&q=80",
    badges: ["Queso Derretido"],
    prepTime: 10,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "sandwich-italiano",
    name: "Sándwich italiano",
    description: "Delicioso sándwich en pan artesanal con tomate fresco, palta molida cremosa y mayonesa casera. Elige tu proteína: pollo o carne.",
    price: 5500,
    category: "Comida Rapida",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
    badges: ["Popular", "Tradicional"],
    prepTime: 12,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "sandwich-chacarero",
    name: "Sándwich Chacarero",
    description: "Sándwich clásico chileno con porotos verdes crujientes, ají verde picado, tomate fresco y mayonesa. Elige tu proteína: pollo o carne.",
    price: 5800,
    category: "Comida Rapida",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    badges: ["Típico Chileno", "Destacado"],
    prepTime: 12,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "sandwich-solo",
    name: "Sándwich Solo",
    description: "Sándwich sencillo en pan artesanal crujiente calentado a la plancha. Elige tu proteína: pollo o carne.",
    price: 4200,
    category: "Comida Rapida",
    image: "https://images.unsplash.com/photo-1549611016-3a70d82b5040?auto=format&fit=crop&w=800&q=80",
    badges: ["Simple"],
    prepTime: 10,
    isAvailable: true,
    isFeatured: false,
  },

  // Colaciones
  {
    id: "colacion-pollo",
    name: "Colación de Pollo",
    description: "Pollo desmenuzado con salsa suave, papas fritas doradas, ensalada fresca y pan artesanal de la casa.",
    price: 5200,
    category: "Colaciones",
    image: "/images/colacion-pollo.svg",
    badges: ["Proteína", "Casera"],
    prepTime: 12,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: "colacion-carne",
    name: "Colación de Carne",
    description: "Carne a la plancha con vegetales salteados, arroz con cebollín y ensalada fresca de la casa.",
    price: 5600,
    category: "Colaciones",
    image: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=800&q=80",
    badges: ["Carne", "Equilibrada"],
    prepTime: 14,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: "milanesa",
    name: "Milanesa",
    description: "Milanesa crujiente acompañada de puré casero, ensalada chilena y cebolla caramelizada.",
    price: 6500,
    category: "Colaciones",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
    badges: ["Crocante", "Clásica"],
    prepTime: 15,
    isAvailable: true,
    isFeatured: false,
  },

  // Especialidades
  {
    id: "chorrillana",
    name: "Chorrillana",
    description: "Porción generosa de papas fritas caseras, carne salteada, cebolla caramelizada y huevos fritos.",
    price: 10500,
    category: "Especialidades",
    image: "/images/chorrillana.svg",
    badges: ["Compartir", "Tradicional"],
    prepTime: 18,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: "handroll",
    name: "HandRoll",
    description: "Roll de sushi envuelto a mano con arroz premium, salmón fresco, aguacate y mayonesa teriyaki.",
    price: 8900,
    category: "Especialidades",
    image: "/images/handroll.svg",
    badges: ["Fresco", "Premium"],
    prepTime: 12,
    isAvailable: true,
    isFeatured: false,
  },

  // Bebidas y Jugos
  {
    id: "coca-cola-lata",
    name: "Coca-Cola Original (Lata)",
    description: "Bebida gaseosa helada en lata de 350ml.",
    price: 1800,
    category: "Bebidas y Jugos",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    badges: ["Helada"],
    prepTime: 2,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: "coca-zero-lata",
    name: "Coca-Cola Zero (Lata)",
    description: "Bebida gaseosa helada sin azúcar en lata de 350ml.",
    price: 1800,
    category: "Bebidas y Jugos",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    badges: ["Helada", "Sin Azúcar"],
    prepTime: 2,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: "jugo-natural-frambuesa",
    name: "Jugo Natural de Frambuesa",
    description: "Pulpa de frambuesas frescas licuada en el momento con agua purificada y hielo, endulzado a elección.",
    price: 3200,
    category: "Bebidas y Jugos",
    image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&w=800&q=80",
    badges: ["Refrescante"],
    prepTime: 4,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "jugo-natural-durazno",
    name: "Jugo Natural de Durazno",
    description: "Suave licuado de pulpa de durazno seleccionada, servido muy frío en copa grande.",
    price: 3200,
    category: "Bebidas y Jugos",
    image: "https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&w=800&q=80",
    badges: ["Fresco"],
    prepTime: 4,
    isAvailable: true,
    isFeatured: false,
  },

  // Cervezas y Vinos
  {
    id: "cerveza-golden-ale",
    name: "Cerveza Golden Ale Artesanal",
    description: "Cerveza rubia de la casa, refrescante con notas malteadas suaves, servida en shop helado.",
    price: 4200,
    category: "Cervezas y Vinos",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
    badges: ["Artesanal", "Shop"],
    prepTime: 3,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: "cerveza-ipa",
    name: "Cerveza IPA Patagónica",
    description: "Cerveza artesanal de lúpulo amargo marcado, intenso aroma a pino y notas cítricas frescas.",
    price: 4800,
    category: "Cervezas y Vinos",
    image: "https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?auto=format&fit=crop&w=800&q=80",
    badges: ["Artesanal"],
    prepTime: 3,
    isAvailable: true,
    isFeatured: false,
  },
  {
    id: "terremoto-tradicional",
    name: "Terremoto Chileno Típico",
    description: "El trago más tradicional: vino pipeño blanco, abundante helado de piña y un toque de granadina o fernet en vaso de medio litro.",
    price: 3900,
    category: "Cervezas y Vinos",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    badges: ["Tradicional", "Popular"],
    prepTime: 4,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "pisco-sour-casero",
    name: "Pisco Sour de la Casa",
    description: "Pisco chileno de 35°, jugo natural de limón sutil fresco y jarabe de goma batido con clara de huevo.",
    price: 4500,
    category: "Cervezas y Vinos",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    badges: ["2x1 Happy Hour", "Chef recomienda"],
    prepTime: 4,
    isAvailable: true,
    isFeatured: true,
  },
  {
    id: "copa-vino-carmenere",
    name: "Copa de Vino Carménère Reserva",
    description: "Vino tinto chileno Carménère reserva, de aroma intenso a moras y especias, con cuerpo medio y final redondo.",
    price: 4900,
    category: "Cervezas y Vinos",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    badges: ["Reserva", "Copa"],
    prepTime: 2,
    isAvailable: true,
    isFeatured: false,
  },
];

const DEFAULT_USER: UserProfile = {
  name: "Ana Contreras",
  email: "ana@email.com",
  phone: "+56 9 8765 4321",
  points: 340,
  tier: "Plata Bosque",
  nextTierPoints: 500,
  nextTierName: "Oro Cóndor",
  coupons: [
    { code: "NEHUENCO10", description: "10% off en tu próxima compra", discountPercent: 10 },
  ],
};

const MOCK_ORDER: Order = {
  id: "NEH-20240518-042",
  customerName: "Ana Contreras",
  phone: "+56 9 8765 4321",
  email: "ana@email.com",
  items: [
    {
      product: INITIAL_PRODUCTS[0], // Completo Italiano Gigante
      quantity: 1,
      notes: "Sin cebolla en el completo, por favor",
    },
    {
      product: INITIAL_PRODUCTS[7], // Cazuela de Vacuno Casera
      quantity: 2,
      notes: "",
    },
    {
      product: INITIAL_PRODUCTS[11], // Promo Sushi Box (30 piezas)
      quantity: 1,
      notes: "",
    },
  ],
  subtotal: 34100,
  discountPoints: 500,
  discountCoupon: 0,
  total: 33600,
  status: "Preparando",
  createdAt: new Date().toISOString(),
  estimatedTime: "13:45",
  pointsEarned: 336,
  pointsRedeemed: 50,
};

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      cart: [
        // Cart pre-populated according to the prompt
        { product: INITIAL_PRODUCTS[0], quantity: 1, notes: "Sin cebolla en el completo, por favor" },
        { product: INITIAL_PRODUCTS[7], quantity: 2, notes: "" },
        { product: INITIAL_PRODUCTS[11], quantity: 1, notes: "" },
      ],
      user: DEFAULT_USER,
      orders: [MOCK_ORDER],
      config: {
        isOpen: true,
        pointsExchangeRate: 10, // 1 point = 10 CLP discount
        welcomeMessage: "¡Bienvenido a Restobar Nehuenco! La mejor comida tradicional chilena, sushi y tragos.",
      },
      activeOrderFilter: "todos",
      isAdminAuthenticated: false,

      // Cart Actions
      addToCart: (product, quantity = 1, notes = "") => {
        const cart = get().cart;
        const existingItem = cart.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            cart: cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                : item
            ),
          });
        } else {
          set({ cart: [...cart, { product, quantity, notes }] });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.product.id !== productId) });
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      updateCartNotes: (productId, notes) => {
        set({
          cart: get().cart.map((item) =>
            item.product.id === productId ? { ...item, notes } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      // User Actions
      redeemPoints: (pointsToRedeem) => {
        const user = get().user;
        const safePoints = Math.min(pointsToRedeem, user.points);
        set({
          user: {
            ...user,
            points: user.points - safePoints,
          },
        });
      },

      addPoints: (pointsToAdd) => {
        const user = get().user;
        const newPoints = user.points + pointsToAdd;
        // Simple tier calculation
        let tier = user.tier;
        if (newPoints >= 500) {
          tier = "Oro Cóndor";
        }
        set({
          user: {
            ...user,
            points: newPoints,
            tier,
          },
        });
      },

      useCoupon: (code) => {
        const user = get().user;
        set({
          user: {
            ...user,
            coupons: user.coupons.filter((c) => c.code !== code),
          },
        });
      },

      updateProfile: (profile) => {
        set({ user: { ...get().user, ...profile } });
      },

      // Order Actions
      placeOrder: (orderData) => {
        const newId = `NEH-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
          100 + Math.random() * 900
        )}`;
        const pointsEarned = Math.floor(orderData.total * 0.01); // 1% points earned

        const newOrder: Order = {
          ...orderData,
          id: newId,
          status: "Recibido",
          createdAt: new Date().toISOString(),
          pointsEarned,
        };

        // Add to orders list
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));

        // Add points earned to user
        get().addPoints(pointsEarned);

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
      },

      simulateOrderTransitions: () => {
        // Automatic state transition simulation
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.status === "Recibido") {
              return { ...order, status: "Preparando" };
            } else if (order.status === "Preparando") {
              return { ...order, status: "Listo" };
            }
            return order;
          }),
        }));
      },

      // Admin CRUD
      addProduct: (p) => {
        const newProduct: Product = {
          ...p,
          id: `product-${Date.now()}`,
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      updateProduct: (id, p) => {
        set((state) => ({
          products: state.products.map((prod) => (prod.id === id ? { ...prod, ...p } : prod)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((prod) => prod.id !== id),
        }));
      },

      toggleProductAvailability: (id) => {
        set((state) => ({
          products: state.products.map((prod) =>
            prod.id === id ? { ...prod, isAvailable: !prod.isAvailable } : prod
          ),
        }));
      },

      // Admin Config
      updateConfig: (configUpdates) => {
        set((state) => ({ config: { ...state.config, ...configUpdates } }));
      },

      // Admin Auth Actions
      loginAdmin: (username, password) => {
        const expectedUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
        const expectedPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "nehuenco2026";
        if (username === expectedUser && password === expectedPass) {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },

      logoutAdmin: () => {
        set({ isAdminAuthenticated: false });
      },
    }),
    {
      name: "nehuenco-store",
      partialize: (state) => {
        const { isAdminAuthenticated, ...rest } = state;
        return rest as any;
      },
    }
  )
);
