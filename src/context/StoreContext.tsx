import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  ProductCategory, 
  ProductSize, 
  FabricType, 
  CartItem, 
  Order, 
  OrderStatus, 
  CustomerAnalytics, 
  ActivityLog,
  SiteMediaConfig
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ACTIVITY,
  INITIAL_SITE_MEDIA
} from '../data/initialData';
import { 
  initializeFirestoreSeed,
  subscribeToProducts,
  subscribeToOrders,
  subscribeToSiteMedia,
  subscribeToActivityLogs,
  subscribeToCustomers,
  subscribeToAdminSettings,
  saveProductToFirestore,
  deleteProductFromFirestore,
  updateProductStockInFirestore,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  saveSiteMediaToFirestore,
  saveAdminCredentialsToFirestore,
  saveCustomerToFirestore,
  addActivityLogToFirestore,
  resetAllFirestoreData
} from '../services/firebaseDb';
import { compressDataUrl } from '../utils/imageCompressor';

interface CouponInfo {
  code: string;
  discountPercent: number;
}

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateStock: (productId: string, count: number) => void;
  
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  customers: CustomerAnalytics[];
  activityLogs: ActivityLog[];

  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, isStitched: boolean, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  
  appliedCoupon: CouponInfo | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  activeView: 'storefront' | 'catalog' | 'admin' | 'tracking';
  setActiveView: (view: 'storefront' | 'catalog' | 'admin' | 'tracking') => void;
  
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  
  selectedFabric: FabricType | 'All';
  setSelectedFabric: (f: FabricType | 'All') => void;
  
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  sortBy: 'popular' | 'price-low' | 'price-high' | 'newest';
  setSortBy: (s: 'popular' | 'price-low' | 'price-high' | 'newest') => void;

  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;

  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;

  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (o: Order | null) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  isAdminAuthenticated: boolean;
  adminCredentials: { id: string };
  updateAdminCredentials: (newId: string, newPass: string) => { success: boolean; message: string };
  adminLogin: (id: string, pass: string) => { success: boolean; error?: string };
  adminLogout: () => void;

  siteMedia: SiteMediaConfig;
  updateHeroImage: (imageUrl: string) => void;
  updateHeroSlideImage: (slideIndex: number, imageUrl: string) => void;
  updateHeroDetails: (updates: { headline?: string; subtitle?: string; badgeTitle?: string; badgeSubtitle?: string }) => void;
  updateGalleryPresetPhoto: (slotIndex: number, newUrl: string, newLabel?: string) => void;
  updateCategoryMedia: (categoryId: string, image: string, label?: string) => void;
  resetSiteMedia: () => void;

  resetToDemoData: () => void;
  isFirebaseConnected: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state with Cloud Firestore real-time sync + local fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('hoor_fab_products_v2_inr');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('hoor_fab_orders_v2_inr');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Customers state
  const [customers, setCustomers] = useState<CustomerAnalytics[]>(() => {
    try {
      const saved = localStorage.getItem('hoor_fab_customers_v2_inr');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_CUSTOMERS;
  });

  // Activity logs state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('hoor_fab_activity_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ACTIVITY;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hoor_fab_cart_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<CouponInfo | null>(null);
  const [activeView, setActiveView] = useState<'storefront' | 'catalog' | 'admin' | 'tracking'>('storefront');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedFabric, setSelectedFabric] = useState<FabricType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'newest'>('popular');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('hoor_fab_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Persistent Admin Credentials for ID and Password customization
  const [adminCredentials, setAdminCredentials] = useState<{ id: string; pass: string }>(() => {
    try {
      const saved = localStorage.getItem('hoor_fab_admin_creds_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.id && parsed.pass) return parsed;
      }
    } catch {
      // fallback
    }
    return { id: 'admin', pass: 'admin123' };
  });

  // Site Media (Hero image + 6 Category images)
  const [siteMedia, setSiteMedia] = useState<SiteMediaConfig>(() => {
    try {
      const saved = localStorage.getItem('hoor_fab_site_media_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SITE_MEDIA;
  });

  // ==========================================
  // REAL-TIME CLOUD FIRESTORE SUBSCRIPTIONS
  // ==========================================
  useEffect(() => {
    // Seed Firestore on startup if empty
    initializeFirestoreSeed().catch((err) => {
      console.warn('[Firebase] Init seed note:', err);
    });

    const unsubProducts = subscribeToProducts((cloudProds) => {
      if (cloudProds && cloudProds.length > 0) {
        setProducts(cloudProds);
        setIsFirebaseConnected(true);
      }
    });

    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    const unsubMedia = subscribeToSiteMedia((cloudMedia) => {
      if (cloudMedia && cloudMedia.heroImage) {
        setSiteMedia(cloudMedia);
      }
    });

    const unsubActivity = subscribeToActivityLogs((cloudLogs) => {
      if (cloudLogs && cloudLogs.length > 0) {
        setActivityLogs(cloudLogs);
      }
    });

    const unsubCustomers = subscribeToCustomers((cloudCustomers) => {
      if (cloudCustomers && cloudCustomers.length > 0) {
        setCustomers(cloudCustomers);
      }
    });

    const unsubSettings = subscribeToAdminSettings((cloudCreds) => {
      if (cloudCreds && cloudCreds.id) {
        setAdminCredentials(cloudCreds);
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubMedia();
      unsubActivity();
      unsubCustomers();
      unsubSettings();
    };
  }, []);

  // Defensive sanitization: Automatically compress and shrink any oversized base64 images
  // from previous uploads so memory, localStorage, and Firestore payloads remain ultra-light
  useEffect(() => {
    const isOversized = (url?: string) => typeof url === 'string' && url.startsWith('data:image') && url.length > 120000;
    
    const hasBloat = 
      isOversized(siteMedia.heroImage) ||
      siteMedia.heroImages?.some(isOversized) ||
      siteMedia.galleryPresets?.some((p) => isOversized(p.url)) ||
      siteMedia.categories.some((c) => isOversized(c.image));

    if (hasBloat) {
      (async () => {
        try {
          const cleanHero = isOversized(siteMedia.heroImage)
            ? await compressDataUrl(siteMedia.heroImage)
            : siteMedia.heroImage;

          const cleanHeroImages = await Promise.all(
            (siteMedia.heroImages || []).map(async (img) => (isOversized(img) ? await compressDataUrl(img) : img))
          );

          const cleanPresets = await Promise.all(
            (siteMedia.galleryPresets || []).map(async (p) => ({
              ...p,
              url: isOversized(p.url) ? await compressDataUrl(p.url) : p.url
            }))
          );

          const cleanCategories = await Promise.all(
            siteMedia.categories.map(async (c) => ({
              ...c,
              image: isOversized(c.image) ? await compressDataUrl(c.image) : c.image
            }))
          );

          const sanitized: SiteMediaConfig = {
            ...siteMedia,
            heroImage: cleanHero,
            heroImages: cleanHeroImages,
            galleryPresets: cleanPresets,
            categories: cleanCategories
          };

          setSiteMedia(sanitized);
          saveSiteMediaToFirestore(sanitized);
        } catch (e) {
          console.warn('[SiteMedia] Sanitization notice:', e);
        }
      })();
    }
  }, []);

  // Sync to localStorage as high-performance offline cache
  useEffect(() => {
    try {
      localStorage.setItem('hoor_fab_products_v2_inr', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('hoor_fab_orders_v2_inr', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('hoor_fab_customers_v2_inr', JSON.stringify(customers));
    } catch {
      // ignore
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem('hoor_fab_activity_v1', JSON.stringify(activityLogs));
    } catch {
      // ignore
    }
  }, [activityLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('hoor_fab_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('hoor_fab_site_media_v1', JSON.stringify(siteMedia));
    } catch {
      // ignore
    }
  }, [siteMedia]);

  const updateAdminCredentials = (newId: string, newPass: string) => {
    const cleanId = newId.trim();
    const cleanPass = newPass.trim();
    if (!cleanId || cleanId.length < 3) {
      return { success: false, message: 'Admin ID must be at least 3 characters long.' };
    }
    if (!cleanPass || cleanPass.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }
    const updated = { id: cleanId, pass: cleanPass };
    setAdminCredentials(updated);
    saveAdminCredentialsToFirestore(updated);
    try {
      localStorage.setItem('hoor_fab_admin_creds_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('Admin credentials synced to Cloud Firestore!');
    return { success: true, message: 'Admin credentials updated successfully in Cloud Firestore!' };
  };

  const adminLogin = (id: string, pass: string) => {
    const cleanId = id.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check against custom credentials
    const matchesCustom = 
      cleanId === adminCredentials.id.trim().toLowerCase() && 
      cleanPass === adminCredentials.pass.trim();

    // Default aliases allowed if still default
    const matchesDefault = 
      (cleanId === 'admin' || cleanId === 'admin@hoorfab.com' || cleanId === 'hoorfab') &&
      (cleanPass === 'admin123' || cleanPass === 'hoorfab123' || cleanPass === 'hooradmin');

    if (matchesCustom || (adminCredentials.id === 'admin' && matchesDefault)) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('hoor_fab_admin_auth', 'true');
      } catch {
        // ignore
      }
      showToast('Welcome, Administrator! (Firebase Live Backend Active)');
      return { success: true };
    }
    return { 
      success: false, 
      error: 'Invalid Admin ID or Password. Please check your credentials.' 
    };
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('hoor_fab_admin_auth');
    } catch {
      // ignore
    }
    setActiveView('storefront');
    showToast('Logged out of Admin Panel');
  };

  const updateHeroImage = (imageUrl: string) => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;
    const currentHeroImages = siteMedia.heroImages && siteMedia.heroImages.length > 0
      ? [...siteMedia.heroImages]
      : (INITIAL_SITE_MEDIA.heroImages || [trimmed]);
    currentHeroImages[0] = trimmed;

    const updatedMedia: SiteMediaConfig = {
      ...siteMedia,
      heroImage: trimmed,
      heroImages: currentHeroImages
    };
    setSiteMedia(updatedMedia);
    saveSiteMediaToFirestore(updatedMedia);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'inventory_update',
      description: 'Hero showcase photo updated in Cloud Firestore'
    };
    setActivityLogs((prev) => [log, ...prev]);
    addActivityLogToFirestore(log);
    showToast('Hero banner photo updated & saved to Firebase!');
  };

  const updateHeroSlideImage = (slideIndex: number, imageUrl: string) => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;
    const currentHeroImages = siteMedia.heroImages && siteMedia.heroImages.length > 0
      ? [...siteMedia.heroImages]
      : (INITIAL_SITE_MEDIA.heroImages || [siteMedia.heroImage]);
    
    currentHeroImages[slideIndex] = trimmed;

    const updatedMedia: SiteMediaConfig = {
      ...siteMedia,
      heroImage: slideIndex === 0 ? trimmed : siteMedia.heroImage,
      heroImages: currentHeroImages
    };
    setSiteMedia(updatedMedia);
    saveSiteMediaToFirestore(updatedMedia);

    showToast(`Hero Slide #${slideIndex + 1} photo updated in live showcase!`);
  };

  const updateGalleryPresetPhoto = (slotIndex: number, newUrl: string, newLabel?: string) => {
    const trimmed = newUrl.trim();
    if (!trimmed) return;
    const defaultPresets = INITIAL_SITE_MEDIA.galleryPresets || [];
    const currentPresets = siteMedia.galleryPresets && siteMedia.galleryPresets.length > 0
      ? [...siteMedia.galleryPresets]
      : [...defaultPresets];

    if (slotIndex >= 0 && slotIndex < currentPresets.length) {
      currentPresets[slotIndex] = {
        ...currentPresets[slotIndex],
        url: trimmed,
        ...(newLabel ? { label: newLabel } : {})
      };
    } else {
      currentPresets.push({
        id: `slot-${Date.now()}`,
        label: newLabel || `Uploaded Photo ${currentPresets.length + 1}`,
        url: trimmed
      });
    }

    const updatedMedia: SiteMediaConfig = {
      ...siteMedia,
      galleryPresets: currentPresets
    };
    setSiteMedia(updatedMedia);
    saveSiteMediaToFirestore(updatedMedia);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'inventory_update',
      description: `Photo slot #${slotIndex + 1} updated in Cloud Firestore`
    };
    setActivityLogs((prev) => [log, ...prev]);
    addActivityLogToFirestore(log);
    showToast(`Photo #${slotIndex + 1} uploaded & saved in Admin Panel!`);
  };

  const updateHeroDetails = (updates: { headline?: string; subtitle?: string; badgeTitle?: string; badgeSubtitle?: string }) => {
    const updatedMedia: SiteMediaConfig = {
      ...siteMedia,
      ...updates
    };
    setSiteMedia(updatedMedia);
    saveSiteMediaToFirestore(updatedMedia);
    showToast('Hero section details saved to Cloud Firestore!');
  };

  const updateCategoryMedia = (categoryId: string, image: string, label?: string) => {
    const trimmedImage = image.trim();
    const updatedMedia: SiteMediaConfig = {
      ...siteMedia,
      categories: siteMedia.categories.map((c) =>
        c.id === categoryId
          ? { ...c, image: trimmedImage || c.image, ...(label ? { label } : {}) }
          : c
      )
    };
    setSiteMedia(updatedMedia);
    saveSiteMediaToFirestore(updatedMedia);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'inventory_update',
      description: `Category photo updated for "${categoryId}" in Cloud Firestore`
    };
    setActivityLogs((prev) => [log, ...prev]);
    addActivityLogToFirestore(log);
    showToast('Category photo updated & saved to Firebase!');
  };

  const resetSiteMedia = () => {
    setSiteMedia(INITIAL_SITE_MEDIA);
    saveSiteMediaToFirestore(INITIAL_SITE_MEDIA);
    showToast('Reset all website photos and banners in Cloud Firestore');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`
    };
    setProducts((prev) => [newProduct, ...prev]);
    saveProductToFirestore(newProduct);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'product_added',
      description: `New catalog item added: "${newProduct.title}" (${newProduct.category})`
    };
    setActivityLogs((prev) => [log, ...prev]);
    addActivityLogToFirestore(log);
    showToast(`Added "${newProduct.title}" to Firebase database`);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    saveProductToFirestore(updated);

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'inventory_update',
      description: `Product details updated in Firebase: "${updated.title}"`
    };
    setActivityLogs((prev) => [log, ...prev]);
    addActivityLogToFirestore(log);
    showToast(`Product "${updated.title}" updated in Firebase`);
  };

  const deleteProduct = (productId: string) => {
    const item = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    deleteProductFromFirestore(productId);

    if (item) {
      const log: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        type: 'inventory_update',
        description: `Removed "${item.title}" from catalog in Firebase`
      };
      setActivityLogs((prev) => [log, ...prev]);
      addActivityLogToFirestore(log);
      showToast(`Removed "${item.title}" from Firebase`);
    }
  };

  const updateStock = (productId: string, count: number) => {
    const newStock = Math.max(0, count);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stockCount: newStock, inStock: newStock > 0 }
          : p
      )
    );
    updateProductStockInFirestore(productId, newStock);

    const prod = products.find((p) => p.id === productId);
    if (prod) {
      const log: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        type: 'inventory_update',
        description: `Stock adjusted for "${prod.title}" to ${newStock} units in Firebase`
      };
      setActivityLogs((prev) => [log, ...prev]);
      addActivityLogToFirestore(log);
      showToast(`Stock updated: ${prod.title} (${newStock} units)`);
    }
  };

  const addToCart = (product: Product, selectedSize: ProductSize, isStitched: boolean, qty = 1) => {
    const cartItemId = `${product.id}-${selectedSize}-${isStitched ? 'stitched' : 'unstitched'}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedSize,
          isStitched,
          quantity: qty
        }
      ];
    });
    setIsCartOpen(true);
    showToast(`Added "${product.title}" (${selectedSize}) to bag`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: qty } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'HOOR10') {
      setAppliedCoupon({ code: 'HOOR10', discountPercent: 10 });
      showToast('10% discount applied with HOOR10!');
      return { success: true, message: '10% discount applied!' };
    }
    if (cleanCode === 'HOOR15') {
      setAppliedCoupon({ code: 'HOOR15', discountPercent: 15 });
      showToast('15% luxury festive discount applied!');
      return { success: true, message: '15% discount applied!' };
    }
    if (cleanCode === 'FREESHIP') {
      setAppliedCoupon({ code: 'FREESHIP', discountPercent: 5 });
      showToast('Special shipping waiver applied!');
      return { success: true, message: 'Shipping perk applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try HOOR10' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => {
    const orderNum = `HF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString(),
      trackingNumber: `HF-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      estimatedDelivery: '3 - 5 Business Days'
    };

    // 1. Deduct stock from products in inventory & sync to Firestore
    setProducts((prev) => {
      const updated = [...prev];
      for (const item of orderData.items) {
        const prodIndex = updated.findIndex((p) => p.id === item.product.id);
        if (prodIndex !== -1) {
          const newStock = Math.max(0, updated[prodIndex].stockCount - item.quantity);
          updated[prodIndex] = {
            ...updated[prodIndex],
            stockCount: newStock,
            inStock: newStock > 0
          };
          updateProductStockInFirestore(item.product.id, newStock);
        }
      }
      return updated;
    });

    // 2. Append Order & save to Cloud Firestore
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder);

    // 3. Upsert Customer Analytics & sync to Firestore
    setCustomers((prev) => {
      const existingIndex = prev.findIndex(
        (c) =>
          c.whatsappPhone === orderData.customer.whatsappPhone ||
          c.email.toLowerCase() === orderData.customer.email.toLowerCase()
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newTotalSpend = existing.totalSpent + orderData.total;
        const newOrdersCount = existing.totalOrders + 1;
        const updatedCust: CustomerAnalytics = {
          ...existing,
          fullName: orderData.customer.fullName,
          totalOrders: newOrdersCount,
          totalSpent: newTotalSpend,
          lastOrderDate: new Date().toISOString().split('T')[0],
          segment: newOrdersCount >= 3 || newTotalSpend > 10000 ? 'VIP' : 'Repeat',
          city: orderData.customer.city
        };
        updated[existingIndex] = updatedCust;
        saveCustomerToFirestore(updatedCust);
        return updated;
      } else {
        const newCustomer: CustomerAnalytics = {
          id: `cust-${Date.now()}`,
          fullName: orderData.customer.fullName,
          whatsappPhone: orderData.customer.whatsappPhone,
          email: orderData.customer.email,
          totalOrders: 1,
          totalSpent: orderData.total,
          lastOrderDate: new Date().toISOString().split('T')[0],
          segment: orderData.total > 5000 ? 'VIP' : 'New',
          city: orderData.customer.city
        };
        saveCustomerToFirestore(newCustomer);
        return [newCustomer, ...prev];
      }
    });

    // 4. Log Activity in Cloud Firestore
    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      type: 'order_created',
      description: `Order #${orderNum} placed by ${orderData.customer.fullName} (₹${orderData.total.toLocaleString('en-IN')})`,
      amount: orderData.total
    };
    setActivityLogs((prev) => [log, ...prev]);
    addActivityLogToFirestore(log);

    // 5. Clear Cart & Store Last Confirmed Order
    clearCart();
    setLastConfirmedOrder(newOrder);
    showToast(`Order #${orderNum} saved to Cloud Firestore backend!`);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    updateOrderStatusInFirestore(orderId, status);

    const ord = orders.find((o) => o.id === orderId);
    if (ord) {
      const log: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        type: 'order_status',
        description: `Order #${ord.orderNumber} status changed to "${status}" in Firebase`
      };
      setActivityLogs((prev) => [log, ...prev]);
      addActivityLogToFirestore(log);
      showToast(`Order #${ord.orderNumber} status updated in Firebase`);
    }
  };

  const deleteOrder = (orderId: string) => {
    const ord = orders.find((o) => o.id === orderId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    if (ord) {
      showToast(`Deleted order #${ord.orderNumber}`);
    }
  };

  const resetToDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomers(INITIAL_CUSTOMERS);
    setActivityLogs(INITIAL_ACTIVITY);
    setSiteMedia(INITIAL_SITE_MEDIA);
    setCart([]);
    setAppliedCoupon(null);
    resetAllFirestoreData();
    showToast('Reset all data & website photos to default in Cloud Firestore');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        customers,
        activityLogs,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        selectedFabric,
        setSelectedFabric,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        toastMessage,
        showToast,
        isAdminAuthenticated,
        adminCredentials: { id: adminCredentials.id },
        updateAdminCredentials,
        adminLogin,
        adminLogout,
        siteMedia,
        updateHeroImage,
        updateHeroSlideImage,
        updateHeroDetails,
        updateGalleryPresetPhoto,
        updateCategoryMedia,
        resetSiteMedia,
        resetToDemoData,
        isFirebaseConnected
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
