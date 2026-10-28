import React, { useState, useMemo, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, OrderStatus, ProductCategory, FabricType, ProductSize, CategoryMediaItem } from '../types';
import { HoorFabLogo } from './HoorFabLogo';
import { WhatsAppIcon } from './WhatsAppIcon';
import { compressImageFile } from '../utils/imageCompressor';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ExternalLink, 
  ArrowLeft, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Key,
  ShieldCheck,
  X, 
  Lock, 
  LogOut, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Sparkles,
  Camera
} from 'lucide-react';

const PRESET_ETHNIC_IMAGES = [
  {
    label: 'Royal Maroon Embroidered Suit',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Ivory Floral Kurti Set',
    url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Sage Green Formal Suit',
    url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Dusty Rose Silk Kurti',
    url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Emerald Velvet Festive Ensemble',
    url: 'https://images.unsplash.com/photo-1610030469668-932d44933a3c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    label: 'Ivory Organza Zari Suit',
    url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
  }
];

export const AdminPanel: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    orders,
    updateOrderStatus,
    deleteOrder,
    customers,
    activityLogs,
    setActiveView,
    resetToDemoData,
    isAdminAuthenticated,
    adminCredentials,
    updateAdminCredentials,
    adminLogin,
    adminLogout,
    siteMedia,
    updateHeroImage,
    updateHeroSlideImage,
    updateHeroDetails,
    updateGalleryPresetPhoto,
    updateCategoryMedia,
    resetSiteMedia
  } = useStore();

  // Authentication State
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Security Credentials Management Modal State
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [newAdminIdInput, setNewAdminIdInput] = useState('');
  const [newAdminPasswordInput, setNewAdminPasswordInput] = useState('');
  const [confirmAdminPasswordInput, setConfirmAdminPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [securityModalError, setSecurityModalError] = useState('');
  const [securityModalSuccess, setSecurityModalSuccess] = useState('');

  // Admin Tab Navigation (Inventory, Website Media)
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'inventory' | 'orders' | 'customers' | 'media'>('media');
  
  // Media & Storefront Images State
  const [editingCategoryMedia, setEditingCategoryMedia] = useState<CategoryMediaItem | null>(null);
  const [categoryPhotoInput, setCategoryPhotoInput] = useState('');
  const [categoryLabelInput, setCategoryLabelInput] = useState('');
  const [categorySubtitleInput, setCategorySubtitleInput] = useState('');
  const [categoryEditTabMode, setCategoryEditTabMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const categoryModalFileInputRef = useRef<HTMLInputElement>(null);

  // Hero section editing state
  const [heroPhotoInput, setHeroPhotoInput] = useState('');
  const [heroHeadlineInput, setHeroHeadlineInput] = useState('');
  const [heroSubtitleInput, setHeroSubtitleInput] = useState('');
  const [heroBadgeTitleInput, setHeroBadgeTitleInput] = useState('');
  const [heroBadgeSubtitleInput, setHeroBadgeSubtitleInput] = useState('');
  const [heroPhotoTabMode, setHeroPhotoTabMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // Inventory state
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState<string>('All');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Add Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('Pakistani Suits');
  const [newPrice, setNewPrice] = useState<number>(2499);
  const [newComparePrice, setNewComparePrice] = useState<number>(3299);
  const [newFabric, setNewFabric] = useState<FabricType>('Raw Silk');
  const [newPieces, setNewPieces] = useState('3 Piece (Shirt, Dupatta & Trouser)');
  const [newWorkType, setNewWorkType] = useState('Zari & Tilla Resham Handwork');
  const [newStock, setNewStock] = useState<number>(15);
  const [newDescription, setNewDescription] = useState('');
  const [newCare, setNewCare] = useState('Dry clean only.');
  const [newImageUrl, setNewImageUrl] = useState<string>(PRESET_ETHNIC_IMAGES[0].url);
  const [imageTabMode, setImageTabMode] = useState<'upload' | 'preset' | 'url'>('upload');

  const addFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Quick Change Active Product Photo State
  const [quickChangePhotoProduct, setQuickChangePhotoProduct] = useState<Product | null>(null);
  const [quickPhotoUrl, setQuickPhotoUrl] = useState<string>('');
  const [quickPhotoMode, setQuickPhotoMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenPhotoChanger = (p: Product) => {
    setQuickChangePhotoProduct(p);
    setQuickPhotoUrl(p.images[0] || PRESET_ETHNIC_IMAGES[0].url);
    setQuickPhotoMode('upload');
  };

  const handleSaveQuickPhoto = () => {
    if (!quickChangePhotoProduct) return;
    const finalUrl = quickPhotoUrl.trim() || PRESET_ETHNIC_IMAGES[0].url;
    const updated: Product = {
      ...quickChangePhotoProduct,
      images: [finalUrl, ...quickChangePhotoProduct.images.slice(1)]
    };
    updateProduct(updated);
    setQuickChangePhotoProduct(null);
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = adminLogin(loginId, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    }
  };

  const handleFillDemoCredentials = () => {
    setLoginId(adminCredentials.id || 'admin');
    setLoginPassword('');
    setLoginError('');
  };

  const handleOpenSecurityModal = () => {
    setNewAdminIdInput(adminCredentials.id);
    setNewAdminPasswordInput('');
    setConfirmAdminPasswordInput('');
    setSecurityModalError('');
    setSecurityModalSuccess('');
    setShowNewPassword(false);
    setIsSecurityModalOpen(true);
  };

  const handleSaveSecurityCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityModalError('');
    setSecurityModalSuccess('');

    const cleanId = newAdminIdInput.trim();
    const cleanPass = newAdminPasswordInput.trim();
    const cleanConfirm = confirmAdminPasswordInput.trim();

    if (!cleanId || cleanId.length < 3) {
      setSecurityModalError('Admin ID / Email must be at least 3 characters.');
      return;
    }

    if (!cleanPass || cleanPass.length < 4) {
      setSecurityModalError('New Password must be at least 4 characters long.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setSecurityModalError('Passwords do not match. Please verify both fields.');
      return;
    }

    const res = updateAdminCredentials(cleanId, cleanPass);
    if (res.success) {
      setSecurityModalSuccess('Admin ID and Password saved successfully! Please remember them for your next login.');
      setTimeout(() => {
        setIsSecurityModalOpen(false);
      }, 1500);
    } else {
      setSecurityModalError(res.message);
    }
  };

  // Handle File Upload from device (converts to base64 data URL)
  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit' | 'quick') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (target === 'new') {
          setNewImageUrl(dataUrl);
        } else if (target === 'edit' && editingProduct) {
          setEditingProduct({
            ...editingProduct,
            images: [dataUrl, ...editingProduct.images.slice(1)]
          });
        } else if (target === 'quick') {
          setQuickPhotoUrl(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Real-time Store Media (Hero & Category Photos) Handlers
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        alert('File size exceeds 12MB. Please choose an image under 12MB.');
        return;
      }
      const compressedDataUrl = await compressImageFile(file);
      if (compressedDataUrl) {
        updateHeroImage(compressedDataUrl);
      }
    }
    e.target.value = '';
  };

  const handleHeroSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        alert('File size exceeds 12MB. Please choose an image under 12MB.');
        return;
      }
      const compressedDataUrl = await compressImageFile(file);
      if (compressedDataUrl) {
        updateHeroSlideImage(slideIndex, compressedDataUrl);
      }
    }
    e.target.value = '';
  };

  const handlePresetSlotUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        alert('File size exceeds 12MB. Please choose an image under 12MB.');
        return;
      }
      const compressedDataUrl = await compressImageFile(file);
      if (compressedDataUrl) {
        updateGalleryPresetPhoto(slotIndex, compressedDataUrl);
      }
    }
    e.target.value = '';
  };

  const handleCategoryDirectFileUpload = (e: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        updateCategoryMedia(categoryId, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryModalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('File size exceeds 8MB. Please choose an image under 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCategoryPhotoInput(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCategoryEditor = (cat: CategoryMediaItem) => {
    setEditingCategoryMedia(cat);
    setCategoryPhotoInput(cat.image);
    setCategoryLabelInput(cat.label);
    setCategorySubtitleInput(cat.subtitle || '');
    setCategoryEditTabMode('upload');
  };

  const handleSaveCategoryEditor = () => {
    if (!editingCategoryMedia) return;
    updateCategoryMedia(
      editingCategoryMedia.id,
      categoryPhotoInput.trim() || editingCategoryMedia.image,
      categoryLabelInput.trim() || editingCategoryMedia.label
    );
    setEditingCategoryMedia(null);
  };

  // Analytics Calculations
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
    const totalOrdersCount = orders.length;
    const aov = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;
    const pendingOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
    const lowStockCount = products.filter((p) => p.stockCount <= 5).length;
    const totalItemsInStock = products.reduce((sum, p) => sum + p.stockCount, 0);

    // Sales by category
    const categoryRevenueMap: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const cat = item.product.category;
        categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + item.product.price * item.quantity;
      });
    });

    return {
      totalRevenue,
      totalOrdersCount,
      aov,
      pendingOrdersCount,
      lowStockCount,
      totalItemsInStock,
      categoryRevenueMap
    };
  }, [orders, products]);

  // Filtered inventory
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (inventoryCategoryFilter !== 'All' && p.category !== inventoryCategoryFilter) return false;
      if (inventorySearch.trim()) {
        const q = inventorySearch.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, inventoryCategoryFilter, inventorySearch]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'All' && o.status !== orderStatusFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.whatsappPhone.includes(q) ||
          o.customer.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Handle Add Product submit
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const finalImage = newImageUrl.trim() || PRESET_ETHNIC_IMAGES[0].url;
    const skuCode = `HF-${newCategory.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    addProduct({
      sku: skuCode,
      title: newTitle,
      subtitle: newSubtitle || 'Exclusive designer ethnic creation',
      category: newCategory,
      price: Number(newPrice),
      compareAtPrice: newComparePrice ? Number(newComparePrice) : undefined,
      fabric: newFabric,
      pieces: newPieces,
      workType: newWorkType,
      sizes: ['S', 'M', 'L', 'XL'],
      inStock: newStock > 0,
      stockCount: Number(newStock),
      isNew: true,
      images: [finalImage],
      description: newDescription || 'Crafted with premium authentic textiles and heritage embellishments.',
      careInstructions: newCare,
      rating: 5.0,
      reviewsCount: 1
    });

    setIsAddProductOpen(false);
    // Reset form
    setNewTitle('');
    setNewSubtitle('');
    setNewImageUrl(PRESET_ETHNIC_IMAGES[0].url);
  };

  // Handle Edit Product save
  const handleUpdateProductSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct);
    setEditingProduct(null);
  };

  const handleWhatsAppCustomer = (order: Order) => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customer.fullName}! This is HOOR FAB regarding your order #${order.orderNumber}. Your order is currently "${order.status.toUpperCase()}". Tracking ID: ${order.trackingNumber}. Let us know if you need any assistance!`
    );
    window.open(`https://wa.me/${order.customer.whatsappPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  // ==========================================
  // VIEW 1: SECURE ADMIN LOGIN SCREEN
  // ==========================================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#382d23] via-[#2f251c] to-[#251d16] text-[#f5ede2] flex flex-col justify-center items-center p-4 sm:p-6">
        
        {/* Top Back link */}
        <div className="w-full max-w-md flex justify-start mb-6">
          <button
            onClick={() => setActiveView('storefront')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#dec8b2] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>

        {/* Login Box */}
        <div className="w-full max-w-md bg-[#fcf9f5] text-[#342a20] rounded-3xl p-8 border border-[#ded0bf] shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <HoorFabLogo size="md" variant="dark" layout="stacked" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4ebe0] text-[#786550] text-[11px] font-bold uppercase tracking-widest border border-[#d8c7b4]">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#342a20]">
              Restricted Security Access
            </h2>
            <p className="text-xs text-[#7e6d5d]">
              Authorized store managers only. Please provide your administrative credentials to continue.
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e5b4b] mb-1.5">
                Admin ID / Email
              </label>
              <input
                type="text"
                required
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="admin@hoorfab.com"
                className="w-full p-3 bg-white border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e5b4b]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="text-[11px] text-[#786550] hover:underline flex items-center gap-1"
                >
                  {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showLoginPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <input
                type={showLoginPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 bg-white border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl text-sm font-semibold tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Sign In to Admin Panel</span>
            </button>
          </form>

          {/* Quick Demo Helper Box */}
          <div className="p-4 bg-[#f6eee2] rounded-2xl border border-[#e2d5c4] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#4c3d2e] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8f745a]" />
                <span>Admin Login Hint:</span>
              </span>
              <button
                type="button"
                onClick={handleFillDemoCredentials}
                className="text-[11px] font-bold text-[#786550] hover:underline"
              >
                Auto Fill ID
              </button>
            </div>
            <div className="text-[11px] text-[#6d5b4a] space-y-0.5">
              <p>Active Admin ID: <span className="font-bold font-mono text-[#342a20]">{adminCredentials.id}</span></p>
              <p className="text-[10px] text-[#8a7664]">Default password: <span className="font-mono font-bold">admin123</span> (or your custom password set via Security settings).</p>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN CONSOLE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f5ede2] text-[#342a20] pb-20">
      
      {/* Admin Top Navigation Bar */}
      <div className="bg-[#382d23] text-white border-b border-[#292017] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('storefront')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold tracking-wide transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg sm:text-xl text-[#f3e5d3] tracking-wide">
                HOOR FAB Backend
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Live Real-Time
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Security ID & Password Button */}
            <button
              onClick={handleOpenSecurityModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-amber-200 hover:text-white rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 transition-colors shadow-sm cursor-pointer"
              title="Change Admin ID & Password"
            >
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>Change ID & Password</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset catalog and orders to original default demo data?')) {
                  resetToDemoData();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#dec8b2] hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              title="Reset all products and orders to original state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            {/* Admin Logout button */}
            <button
              onClick={adminLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Sign out of Admin Panel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-4 overflow-x-auto text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveAdminTab('media')}
            className={`py-3 px-3 sm:px-5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === 'media'
                ? 'border-[#dec8b2] text-[#dec8b2] font-semibold'
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#dec8b2]" />
            <span>Store Media & Photos</span>
            <span className="bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Live Real-Time
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('inventory')}
            className={`py-3 px-3 sm:px-5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeAdminTab === 'inventory'
                ? 'border-[#dec8b2] text-[#dec8b2] font-semibold'
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory & Products ({products.length})</span>
            {analytics.lowStockCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {analytics.lowStockCount}
              </span>
            )}
          </button>

          {/* Tab action for Admin Security */}
          <button
            onClick={handleOpenSecurityModal}
            className="py-3 px-3 sm:px-4 border-b-2 border-transparent text-amber-200/90 hover:text-amber-100 flex items-center gap-2 transition-colors whitespace-nowrap ml-auto cursor-pointer"
            title="Update Admin Login ID and Password"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Admin Security & Password</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* TAB 1: ANALYTICS DASHBOARD */}
        {activeAdminTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white rounded-2xl p-5 border border-[#dfd2c1] shadow-sm">
                <div className="flex items-center justify-between text-[#85715f] mb-2 text-xs font-semibold uppercase tracking-wider">
                  <span>Gross Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#342a20] tabular-nums">
                  ₹{Math.round(analytics.totalRevenue).toLocaleString('en-IN')}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% this month</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#dfd2c1] shadow-sm">
                <div className="flex items-center justify-between text-[#85715f] mb-2 text-xs font-semibold uppercase tracking-wider">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#786550]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#342a20] tabular-nums">
                  {analytics.totalOrdersCount}
                </div>
                <div className="text-xs text-[#7e6d5d] mt-2">
                  {analytics.pendingOrdersCount} orders currently in fulfillment
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#dfd2c1] shadow-sm">
                <div className="flex items-center justify-between text-[#85715f] mb-2 text-xs font-semibold uppercase tracking-wider">
                  <span>Average Order (AOV)</span>
                  <BarChart3 className="w-4 h-4 text-[#786550]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#342a20] tabular-nums">
                  ₹{Math.round(analytics.aov).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-2">
                  High luxury basket value
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-[#dfd2c1] shadow-sm">
                <div className="flex items-center justify-between text-[#85715f] mb-2 text-xs font-semibold uppercase tracking-wider">
                  <span>Catalog Inventory</span>
                  <Package className="w-4 h-4 text-[#786550]" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-[#342a20] tabular-nums">
                  {analytics.totalItemsInStock} units
                </div>
                <div className="text-xs text-[#9b3a30] font-medium mt-2">
                  {analytics.lowStockCount} items below safe stock threshold
                </div>
              </div>

            </div>

            {/* Charts & Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sales by Category Bars */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#dfd2c1] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-[#342a20]">
                    Sales by Ethnic Category
                  </h3>
                  <span className="text-xs text-[#887463]">Live Volume</span>
                </div>

                <div className="space-y-3 pt-2">
                  {Object.entries(analytics.categoryRevenueMap).map(([category, amount]) => {
                    const pct = analytics.totalRevenue > 0 ? (amount / analytics.totalRevenue) * 100 : 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-[#483a2d]">{category}</span>
                          <span className="font-bold text-[#342a20] tabular-nums">
                            ₹{Math.round(amount).toLocaleString('en-IN')} ({pct.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-[#f3eae0] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#786550] h-full rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(8, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Activity Feed */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#dfd2c1] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-lg text-[#342a20]">
                    Live Activity Stream
                  </h3>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Listening
                  </span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activityLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-[#faf5ee] rounded-xl border border-[#ede1d3] text-xs space-y-1">
                      <div className="flex justify-between text-[#8b7766]">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">
                          {log.type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px]">{log.timestamp}</span>
                      </div>
                      <p className="text-[#342a20] font-medium">{log.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeAdminTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Top Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#dfd2c1] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#8a7563] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search SKU, title, or fabric..."
                    className="w-full pl-9 pr-3 py-2 bg-[#faf6f0] border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] focus:outline-none"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={inventoryCategoryFilter}
                  onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                  className="py-2 px-3 bg-[#faf6f0] border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] focus:outline-none"
                >
                  <option value="All">All Categories</option>
                  <option value="Pakistani Suits">Pakistani Suits</option>
                  <option value="Kurtis">Kurtis</option>
                  <option value="Suits">Suits</option>
                  <option value="Daily Wear">Daily Wear</option>
                  <option value="Office Wear">Office Wear</option>
                  <option value="New Collection">New Collection</option>
                </select>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => {
                  setNewImageUrl(PRESET_ETHNIC_IMAGES[0].url);
                  setIsAddProductOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Design + Photo</span>
              </button>

            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-[#dfd2c1] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f7efe6] text-[#4d3e30] border-b border-[#ebdcca] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3.5">Product & Photo</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock Level</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede2d4]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#faf6f0] transition-colors">
                        {/* Title, Photo & SKU with Direct Click-to-Change Photo */}
                        <td className="p-3.5 flex items-center gap-3">
                          <div
                            onClick={() => handleOpenPhotoChanger(p)}
                            className="relative group/photo cursor-pointer shrink-0 rounded-lg overflow-hidden border border-[#dfd1bf] shadow-xs"
                            title="Click to Change Active Catalog Photo"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-12 h-14 object-cover object-top bg-[#ebd8c5] group-hover/photo:scale-105 transition-transform"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = PRESET_ETHNIC_IMAGES[0].url;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity text-white text-[9px] font-bold">
                              <Camera className="w-3.5 h-3.5 mb-0.5" />
                              <span>Change</span>
                            </div>
                          </div>
                          <div>
                            <p className="font-bold text-[#342a20] text-sm">{p.title}</p>
                            <p className="font-mono text-[11px] text-[#85715f]">{p.sku} • {p.fabric}</p>
                            <button
                              type="button"
                              onClick={() => handleOpenPhotoChanger(p)}
                              className="text-[10px] text-[#786550] hover:text-[#342a20] font-semibold underline flex items-center gap-1 mt-0.5"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Change Photo</span>
                            </button>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3.5 font-medium text-[#48392b]">
                          {p.category}
                        </td>

                        {/* Price */}
                        <td className="p-3.5 font-bold text-[#342a20] tabular-nums">
                          ₹{p.price.toLocaleString('en-IN')}
                          {p.compareAtPrice && (
                            <span className="text-[11px] text-[#9a8674] line-through ml-1.5 font-normal">
                              ₹{p.compareAtPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>

                        {/* Stock Counter with inline adjustments */}
                        <td className="p-3.5">
                          <div className="inline-flex items-center border border-[#d8c8b6] rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              onClick={() => updateStock(p.id, p.stockCount - 1)}
                              className="px-2 py-1 text-xs text-[#524131] hover:bg-[#f6eee3] font-bold"
                              title="Decrease stock by 1"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 font-bold text-xs text-[#342a20] tabular-nums">
                              {p.stockCount}
                            </span>
                            <button
                              onClick={() => updateStock(p.id, p.stockCount + 1)}
                              className="px-2 py-1 text-xs text-[#524131] hover:bg-[#f6eee3] font-bold"
                              title="Increase stock by 1"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="p-3.5">
                          {p.stockCount > 5 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                              In Stock
                            </span>
                          ) : p.stockCount > 0 ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                              Low Stock ({p.stockCount})
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-800 border border-red-200">
                              Sold Out
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleOpenPhotoChanger(p)}
                            className="p-1.5 text-[#786550] hover:text-[#382d22] hover:bg-[#f4ebe0] rounded-lg transition-colors"
                            title="Change Active Catalog Photo"
                          >
                            <Camera className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="p-1.5 text-[#786550] hover:text-[#382d22] hover:bg-[#f4ebe0] rounded-lg transition-colors"
                            title="Edit Product & Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${p.title}" from catalog?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 text-[#9e382b] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-[#dfd2c1] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#8a7563] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID, name, or phone..."
                    className="w-full pl-9 pr-3 py-2 bg-[#faf6f0] border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] focus:outline-none"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="py-2 px-3 bg-[#faf6f0] border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="text-xs text-[#7d6b59]">
                Showing {filteredOrders.length} live orders
              </div>

            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-[#dfd2c1] shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f7efe6] text-[#4d3e30] border-b border-[#ebdcca] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3.5">Order ID & Date</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total & Method</th>
                      <th className="p-3.5">Fulfillment Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede2d4]">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#faf6f0] transition-colors">
                        {/* Order ID */}
                        <td className="p-3.5">
                          <p className="font-mono font-bold text-sm text-[#342a20]">#{ord.orderNumber}</p>
                          <p className="text-[10px] text-[#887463]">
                            {new Date(ord.date).toLocaleDateString()}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="p-3.5">
                          <p className="font-bold text-[#342a20]">{ord.customer.fullName}</p>
                          <p className="text-[11px] text-[#6d5c4c]">{ord.customer.city} • {ord.customer.whatsappPhone}</p>
                        </td>

                        {/* Items */}
                        <td className="p-3.5">
                          <div className="space-y-0.5 max-w-xs">
                            {ord.items.map((it, idx) => (
                              <p key={idx} className="line-clamp-1 text-[#48392b]">
                                {it.quantity}x {it.product.title} ({it.selectedSize})
                              </p>
                            ))}
                          </div>
                        </td>

                        {/* Total & Method */}
                        <td className="p-3.5">
                          <p className="font-bold text-[#342a20] tabular-nums text-sm">
                            ₹{Math.round(ord.total).toLocaleString('en-IN')}
                          </p>
                          <span className="text-[10px] uppercase font-semibold text-[#8a7258] bg-[#f5ede2] px-1.5 py-0.5 rounded border border-[#dfd2c1]">
                            {ord.paymentMethod.toUpperCase()}
                          </span>
                        </td>

                        {/* Status Dropdown */}
                        <td className="p-3.5">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider border focus:outline-none ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.status === 'shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : ord.status === 'processing'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : ord.status === 'confirmed'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : ord.status === 'cancelled'
                                ? 'bg-red-50 text-red-800 border-red-300'
                                : 'bg-gray-50 text-gray-800 border-gray-300'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setSelectedOrderDetails(ord)}
                            className="p-1.5 text-[#5e4c3c] hover:text-[#342a20] hover:bg-[#ede2d4] rounded-lg transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleWhatsAppCustomer(ord)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="WhatsApp Customer"
                          >
                            <WhatsAppIcon size={16} color="#25D366" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete order #${ord.orderNumber}?`)) {
                                deleteOrder(ord.id);
                              }
                            }}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: CUSTOMER ANALYTICS */}
        {activeAdminTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-2xl border border-[#dfd2c1] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#ebdcca] flex justify-between items-center">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#342a20]">
                    Customer Lifetime Database
                  </h3>
                  <p className="text-xs text-[#7e6d5d]">
                    Track highest spending clients, repeat purchasing loyalty, and contact details.
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-[#f5ede2] text-[#786550] rounded-full border border-[#ded0bf]">
                  {customers.length} Profiles Recorded
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f7efe6] text-[#4d3e30] border-b border-[#ebdcca] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">WhatsApp / Email</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5">Orders Count</th>
                      <th className="p-3.5">Lifetime Spend</th>
                      <th className="p-3.5">Tier Segment</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ede2d4]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-[#faf6f0] transition-colors">
                        <td className="p-3.5 font-bold text-[#342a20] text-sm">
                          {c.fullName}
                        </td>
                        <td className="p-3.5 text-[#5e4c3c]">
                          <p>{c.whatsappPhone}</p>
                          <p className="text-[10px] text-[#8e7a68]">{c.email}</p>
                        </td>
                        <td className="p-3.5 text-[#4e3f31]">
                          {c.city}
                        </td>
                        <td className="p-3.5 font-bold text-[#342a20] tabular-nums">
                          {c.totalOrders}
                        </td>
                        <td className="p-3.5 font-bold text-[#342a20] tabular-nums">
                          ₹{Math.round(c.totalSpent).toLocaleString('en-IN')}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              c.segment === 'VIP'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : c.segment === 'Repeat'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : 'bg-gray-100 text-gray-800 border border-gray-300'
                            }`}
                          >
                            {c.segment}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              const msg = encodeURIComponent(
                                `Assalam-o-Alaikum ${c.fullName}! HOOR FAB is offering an exclusive preview of our upcoming festive formals collection just for you.`
                              );
                              window.open(`https://wa.me/${c.whatsappPhone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ede2d4] hover:bg-[#dfd0be] text-[#3e3023] rounded-lg text-xs font-semibold transition-colors"
                          >
                            <WhatsAppIcon size={14} color="#25D366" />
                            <span>WhatsApp</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WEBSITE MEDIA & BANNERS (REAL-TIME STOREFRONT CUSTOMIZATION) */}
        {activeAdminTab === 'media' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Header / Intro Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ded0bf] shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4ebe0] text-[#786550] text-xs font-bold uppercase tracking-wider border border-[#d8c7b4]">
                    <Sparkles className="w-3.5 h-3.5 text-[#886e53]" />
                    <span>Real-time Live Storefront Photos</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#342a20]">
                    Website Media & Banners Manager
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7e6d5d] max-w-2xl">
                    Admin panel se jo bhi photo aap upload karenge, wo turant aapki website par real-time dikhegi! You can upload from your mobile gallery, take a photo from camera, or use designer presets.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset all website banner and category photos to original defaults?')) {
                        resetSiteMedia();
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#f6eee2] hover:bg-[#ede2d4] text-[#4d3d2e] rounded-xl text-xs font-semibold border border-[#d8c8b6] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Media Defaults</span>
                  </button>

                  <button
                    onClick={() => setActiveView('storefront')}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Live Storefront</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 1: HERO TOP BANNER PHOTO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ded0bf] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#ebdcca] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#886e53]">
                      Zone 1: Homepage Top Showcase
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active on Storefront
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#342a20]">
                    Hero Showcase Model Photo
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Live Preview */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-xs aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#cbb398] shadow-lg relative bg-[#f6eee2]">
                    <img
                      src={siteMedia.heroImage}
                      alt="Hero Live Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-[#ded0bf] text-xs">
                      <p className="font-serif font-bold text-[#342a20] text-xs">{siteMedia.heroBadgeTitle || 'Festive Formals Drop'}</p>
                      <p className="text-[10px] text-[#7d6b57]">{siteMedia.heroBadgeSubtitle || 'Raw Silk & Organza Tilla'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#786550] mt-2">
                    Current Homepage Top Photo
                  </span>

                  {/* 3-Image Auto-Slider Controls */}
                  <div className="w-full max-w-xs mt-4 p-3.5 bg-[#faf5ee] rounded-2xl border border-[#ded0bf] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#63503f]">
                        1-Sec Auto Slider (3 Photos)
                      </span>
                      <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                        1s Cycle
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map((sIdx) => {
                        const currentSlides = siteMedia.heroImages || [
                          siteMedia.heroImage,
                          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
                          'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85'
                        ];
                        const slideImg = currentSlides[sIdx] || siteMedia.heroImage;

                        return (
                          <div key={sIdx} className="flex flex-col items-center gap-1 bg-white p-1.5 rounded-xl border border-[#e5d8c7] shadow-2xs">
                            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-[#eadecd]">
                              <img src={slideImg} alt={`Slide ${sIdx + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute top-1 left-1 bg-black/60 text-white text-[8px] font-bold px-1 rounded">
                                S{sIdx + 1}
                              </span>
                            </div>
                            <label className="w-full py-1 bg-[#786550] hover:bg-[#62513f] text-white rounded text-[9px] font-bold text-center cursor-pointer flex items-center justify-center gap-0.5 shadow-2xs">
                              <Upload className="w-2.5 h-2.5" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleHeroSlideUpload(e, sIdx)}
                                className="hidden"
                              />
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right: Upload and Control Panel */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="bg-[#faf5ee] p-5 rounded-2xl border border-[#e2d5c4] space-y-4">
                    <label className="font-bold uppercase tracking-wider text-xs text-[#524131] flex items-center justify-between">
                      <span>Change Hero Photo</span>
                      <span className="text-[11px] font-normal text-[#786550]">Instantly updates storefront</span>
                    </label>

                    {/* Mode selector */}
                    <div className="flex gap-1.5 p-1 bg-[#ede2d4] rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setHeroPhotoTabMode('upload')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          heroPhotoTabMode === 'upload' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Phone / PC</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroPhotoTabMode('preset')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          heroPhotoTabMode === 'preset' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>6 Photo Slots & Upload</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroPhotoTabMode('url')}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          heroPhotoTabMode === 'url' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Web URL</span>
                      </button>
                    </div>

                    {/* Hero Upload option */}
                    {heroPhotoTabMode === 'upload' && (
                      <div className="space-y-3">
                        <input
                          type="file"
                          ref={heroFileInputRef}
                          accept="image/*"
                          onChange={handleHeroFileUpload}
                          className="hidden"
                        />
                        <div
                          onClick={() => heroFileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#cbb7a2] hover:border-[#786550] bg-white rounded-2xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#f4ebe0] text-[#786550] flex items-center justify-center">
                            <Upload className="w-6 h-6" />
                          </div>
                          <p className="font-bold text-xs sm:text-sm text-[#342a20]">
                            Select Photo from your Mobile Gallery or Computer
                          </p>
                          <p className="text-[11px] text-[#8e7a68]">
                            Apne phone se photo select karein — yeh foran upload ho kar live lag jayegi.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hero Presets & 6 Uploadable Photo Slots */}
                    {heroPhotoTabMode === 'preset' && (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-[#524131]">
                            6 Showcase Photo Slots — Apne phone ya PC se photo upload karein:
                          </p>
                          <span className="text-[11px] text-[#8e7a68]">
                            Click "Upload Photo" to select from gallery
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                          {((siteMedia.galleryPresets && siteMedia.galleryPresets.length > 0)
                            ? siteMedia.galleryPresets
                            : PRESET_ETHNIC_IMAGES.map((p, idx) => ({ id: `slot-${idx + 1}`, label: p.label, url: p.url }))
                          ).map((slot, idx) => {
                            const isMainHero = siteMedia.heroImage === slot.url;
                            const currentSlides = siteMedia.heroImages || [
                              siteMedia.heroImage,
                              'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
                              'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85'
                            ];
                            const slideIndex = currentSlides.indexOf(slot.url);

                            return (
                              <div
                                key={idx}
                                className={`group relative rounded-xl overflow-hidden border-2 bg-[#f0e6d8] transition-all flex flex-col shadow-xs ${
                                  isMainHero
                                    ? 'border-[#786550] ring-2 ring-[#786550]/40'
                                    : 'border-[#ded0bf] hover:border-[#8f7863]'
                                }`}
                              >
                                {/* Photo Container */}
                                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#e5d8c7]">
                                  <img
                                    src={slot.url}
                                    alt={slot.label || `Photo Slot ${idx + 1}`}
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 select-none"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                                  {/* Top Slot Badge */}
                                  <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-white">
                                    #{idx + 1}
                                  </div>

                                  {/* Status indicator badges */}
                                  <div className="absolute top-1 right-1 flex flex-col gap-0.5 items-end">
                                    {isMainHero && (
                                      <div className="bg-[#786550] text-white rounded-full p-1 shadow-xs" title="Currently Main Hero">
                                        <Check className="w-2.5 h-2.5" />
                                      </div>
                                    )}
                                    {slideIndex !== -1 && (
                                      <span className="bg-amber-600 text-white text-[8px] font-bold px-1 py-0.2 rounded shadow-xs">
                                        Slide {slideIndex + 1}
                                      </span>
                                    )}
                                  </div>

                                  {/* Direct Upload button overlay on card */}
                                  <label
                                    className="absolute bottom-1.5 inset-x-1.5 py-1 px-1 bg-[#786550]/95 hover:bg-[#62513f] text-white rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer shadow-md transition-all active:scale-95"
                                    title="Click to upload from phone or computer"
                                  >
                                    <Camera className="w-3 h-3" />
                                    <span>Upload</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handlePresetSlotUpload(e, idx)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>

                                {/* Quick selection actions */}
                                <div className="p-1.5 bg-white flex flex-col gap-1 border-t border-[#ded0bf]">
                                  <button
                                    type="button"
                                    onClick={() => updateHeroImage(slot.url)}
                                    className={`w-full py-1 px-1 text-[9px] font-semibold rounded transition-colors cursor-pointer text-center ${
                                      isMainHero
                                        ? 'bg-[#786550] text-white'
                                        : 'bg-[#f4ece1] hover:bg-[#e9ded0] text-[#473a2e]'
                                    }`}
                                  >
                                    {isMainHero ? '✓ Active Hero' : 'Set as Hero'}
                                  </button>

                                  {/* Quick assign to 1-sec slider */}
                                  <div className="flex items-center justify-between gap-1 pt-0.5 border-t border-[#f0e6d8]">
                                    <span className="text-[8px] text-[#7d6b57] font-semibold">Slider:</span>
                                    <div className="flex gap-0.5">
                                      <button
                                        type="button"
                                        onClick={() => updateHeroSlideImage(0, slot.url)}
                                        title="Assign to Slider 1"
                                        className="px-1 py-0.5 text-[8px] font-bold bg-[#ede2d4] hover:bg-[#ded0bf] text-[#483a2d] rounded cursor-pointer"
                                      >
                                        S1
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => updateHeroSlideImage(1, slot.url)}
                                        title="Assign to Slider 2"
                                        className="px-1 py-0.5 text-[8px] font-bold bg-[#ede2d4] hover:bg-[#ded0bf] text-[#483a2d] rounded cursor-pointer"
                                      >
                                        S2
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => updateHeroSlideImage(2, slot.url)}
                                        title="Assign to Slider 3"
                                        className="px-1 py-0.5 text-[8px] font-bold bg-[#ede2d4] hover:bg-[#ded0bf] text-[#483a2d] rounded cursor-pointer"
                                      >
                                        S3
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Hero URL option */}
                    {heroPhotoTabMode === 'url' && (
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-[#6e5b4b]">
                          Online Image URL (https://...)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={heroPhotoInput}
                            onChange={(e) => setHeroPhotoInput(e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="flex-1 p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-xs text-[#342a20]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (heroPhotoInput.trim()) {
                                updateHeroImage(heroPhotoInput.trim());
                                setHeroPhotoInput('');
                              }
                            }}
                            className="px-4 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hero Badge & Floating Tag Customization */}
                  <div className="bg-[#faf5ee] p-5 rounded-2xl border border-[#e2d5c4] space-y-3">
                    <label className="font-bold uppercase tracking-wider text-xs text-[#524131]">
                      Hero Overlay Badge Text
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[11px] text-[#786550] block mb-1">Badge Title:</span>
                        <input
                          type="text"
                          defaultValue={siteMedia.heroBadgeTitle}
                          placeholder="e.g. Festive Formals Drop"
                          onChange={(e) => setHeroBadgeTitleInput(e.target.value)}
                          className="w-full p-2 bg-white border border-[#d8c8b6] rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-[#786550] block mb-1">Badge Subtitle:</span>
                        <input
                          type="text"
                          defaultValue={siteMedia.heroBadgeSubtitle}
                          placeholder="e.g. Raw Silk & Organza Tilla"
                          onChange={(e) => setHeroBadgeSubtitleInput(e.target.value)}
                          className="w-full p-2 bg-white border border-[#d8c8b6] rounded-xl text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          updateHeroDetails({
                            badgeTitle: heroBadgeTitleInput || siteMedia.heroBadgeTitle,
                            badgeSubtitle: heroBadgeSubtitleInput || siteMedia.heroBadgeSubtitle
                          });
                        }}
                        className="px-4 py-2 bg-[#786550] text-white rounded-xl text-xs font-medium cursor-pointer"
                      >
                        Save Badge Text
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: 6 CATEGORY CATALOG CARDS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ded0bf] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ebdcca] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#886e53]">
                      Zone 2: "Our Collection" Catalog Grid
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      6 Categories
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#342a20]">
                    Category Collection Cards Photos
                  </h3>
                  <p className="text-xs text-[#7e6d5d]">
                    Click "Upload Photo" on any category card to instantly change its photo on the live website.
                  </p>
                </div>
              </div>

              {/* 6 Category Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {siteMedia.categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="bg-[#fcf9f5] rounded-2xl border border-[#ded0bf] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Image Preview Container */}
                    <div className="relative aspect-[4/3] bg-[#eadecd] overflow-hidden group">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                      
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white border border-white/20">
                        Card #{idx + 1}
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-xs text-[#e5d5c3] font-serif uppercase tracking-wider">
                          {cat.name}
                        </span>
                        <h4 className="font-serif font-bold text-lg leading-tight whitespace-pre-line">
                          {cat.label}
                        </h4>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="text-xs text-[#6e5b4b] flex items-center justify-between">
                        <span className="font-semibold text-[#342a20]">{cat.name}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200">
                          Live Sync
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {/* Direct File Upload button for this specific card */}
                        <label className="py-2 px-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleCategoryDirectFileUpload(e, cat.id)}
                            className="hidden"
                          />
                        </label>

                        {/* Open full editor modal with presets and URL */}
                        <button
                          type="button"
                          onClick={() => handleOpenCategoryEditor(cat)}
                          className="py-2 px-2.5 bg-[#ede2d4] hover:bg-[#dfd0be] text-[#483a2d] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Change & Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: ADD NEW PRODUCT WITH FULL MULTI-CHOICE PHOTO UPLOADER */}
      {/* ======================================================== */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative bg-[#fcf9f5] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#ded0bf] shadow-2xl">
            <button
              onClick={() => setIsAddProductOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#5e4d3c] hover:text-[#342a20]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-[#342a20] mb-1">
              Add New Ethnic Outfit & Photo
            </h3>
            <p className="text-xs text-[#7e6d5d] mb-5">
              Upload from your phone/computer, choose a designer preset, or enter an image link.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs sm:text-sm">
              
              {/* PHOTO UPLOADER SECTION (DIRECT FIX FOR USER REQUEST) */}
              <div className="bg-[#f6eee2] p-4 rounded-2xl border border-[#ded0bf] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold uppercase tracking-wider text-xs text-[#524131] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#786550]" />
                    <span>Product Catalog Photo *</span>
                  </label>
                  
                  {/* Photo Mode Switcher */}
                  <div className="flex gap-1 p-0.5 bg-[#ede2d4] rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageTabMode('upload')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        imageTabMode === 'upload' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#5a4837]'
                      }`}
                    >
                      Device Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTabMode('preset')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        imageTabMode === 'preset' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#5a4837]'
                      }`}
                    >
                      Preset Photos
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTabMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        imageTabMode === 'url' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#5a4837]'
                      }`}
                    >
                      Web Link
                    </button>
                  </div>
                </div>

                {/* Sub-view: Upload from Device */}
                {imageTabMode === 'upload' && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={addFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleDeviceFileUpload(e, 'new')}
                      className="hidden"
                    />
                    <div 
                      onClick={() => addFileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#cbb7a2] hover:border-[#786550] bg-white rounded-xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#f4ebe0] text-[#786550] flex items-center justify-center">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-xs text-[#342a20]">
                        Click to select photo from your phone or PC
                      </p>
                      <p className="text-[10px] text-[#8e7a68]">
                        Supports JPG, PNG, WEBP (Instant upload, no server required)
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-view: Preset Ethnic Photos */}
                {imageTabMode === 'preset' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-[#786550]">Choose any high-definition ethnic wear sample photo:</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_ETHNIC_IMAGES.map((preset, idx) => (
                        <div
                          key={idx}
                          onClick={() => setNewImageUrl(preset.url)}
                          className={`relative aspect-[3/4] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                            newImageUrl === preset.url ? 'border-[#786550] ring-2 ring-[#786550]/40' : 'border-[#d8c8b6] opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.label}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          {newImageUrl === preset.url && (
                            <div className="absolute top-1 right-1 bg-[#786550] text-white rounded-full p-0.5">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-view: Direct Web URL */}
                {imageTabMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Paste image URL (https://images.unsplash.com/...)"
                      className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs focus:outline-none"
                    />
                  </div>
                )}

                {/* Live Preview Box */}
                {newImageUrl && (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#ded0bf]">
                    <img
                      src={newImageUrl}
                      alt="Selected Preview"
                      referrerPolicy="no-referrer"
                      className="w-12 h-14 object-cover object-top rounded-lg bg-[#ede2d4] shrink-0 border border-[#cbb7a2]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#342a20] truncate">Active Catalog Photo</p>
                      <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                        <Check className="w-3 h-3" /> Photo ready to publish
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                    Outfit Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Zari Velvet Anarkali"
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                  >
                    <option value="Pakistani Suits">Pakistani Suits</option>
                    <option value="Kurtis">Kurtis</option>
                    <option value="Suits">Suits</option>
                    <option value="Daily Wear">Daily Wear</option>
                    <option value="Office Wear">Office Wear</option>
                    <option value="New Collection">New Collection</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                    Compare At (₹)
                  </label>
                  <input
                    type="number"
                    value={newComparePrice}
                    onChange={(e) => setNewComparePrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Fabric & Pieces */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                    Fabric Type
                  </label>
                  <select
                    value={newFabric}
                    onChange={(e) => setNewFabric(e.target.value as FabricType)}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                  >
                    <option value="Raw Silk">Raw Silk</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Organza">Organza</option>
                    <option value="Velvet">Velvet</option>
                    <option value="Pure Lawn">Pure Lawn</option>
                    <option value="Georgette">Georgette</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                    Pieces Breakdown
                  </label>
                  <input
                    type="text"
                    value={newPieces}
                    onChange={(e) => setNewPieces(e.target.value)}
                    placeholder="3 Piece (Shirt, Dupatta & Trouser)"
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Artisanal hand-embroidered suit..."
                  className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20] text-xs sm:text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#ebdcca]">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-5 py-2.5 bg-[#ede2d4] text-[#4d3e30] rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl font-semibold shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish to Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT EXISTING PRODUCT WITH PHOTO CHANGER */}
      {/* ======================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative bg-[#fcf9f5] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#ded0bf] shadow-2xl">
            <button
              onClick={() => setEditingProduct(null)}
              className="absolute top-4 right-4 p-2 text-[#5e4d3c] hover:text-[#342a20]"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif font-bold text-2xl text-[#342a20] mb-4">
              Edit Product & Photo: {editingProduct.title}
            </h3>

            <form onSubmit={handleUpdateProductSave} className="space-y-4 text-xs sm:text-sm">
              
              {/* Photo Change Section */}
              <div className="bg-[#f6eee2] p-4 rounded-2xl border border-[#ded0bf] space-y-3">
                <label className="font-bold uppercase tracking-wider text-xs text-[#524131] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#786550]" />
                  <span>Update Outfit Photo</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={editingProduct.images[0]}
                    alt={editingProduct.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover object-top rounded-xl border border-[#cbb7a2] bg-[#ede2d4]"
                  />
                  
                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={(e) => handleDeviceFileUpload(e, 'edit')}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="w-full py-2 px-3 bg-white hover:bg-[#faf5ee] border border-[#d8c8b6] rounded-xl text-xs font-semibold text-[#48392c] flex items-center justify-center gap-2 transition-colors"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#786550]" />
                      <span>Upload New Image from Device</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#786550] shrink-0">Or Preset:</span>
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {PRESET_ETHNIC_IMAGES.slice(0, 4).map((pr, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setEditingProduct({
                                ...editingProduct,
                                images: [pr.url, ...editingProduct.images.slice(1)]
                              });
                            }}
                            className="w-8 h-8 rounded-lg overflow-hidden border border-[#d8c8b6] shrink-0"
                          >
                            <img src={pr.url} alt="preset" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20]"
                  >
                    <option value="Pakistani Suits">Pakistani Suits</option>
                    <option value="Kurtis">Kurtis</option>
                    <option value="Suits">Suits</option>
                    <option value="Daily Wear">Daily Wear</option>
                    <option value="Office Wear">Office Wear</option>
                    <option value="New Collection">New Collection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount}
                    onChange={(e) => setEditingProduct({ 
                      ...editingProduct, 
                      stockCount: Number(e.target.value),
                      inStock: Number(e.target.value) > 0 
                    })}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">Fabric</label>
                  <select
                    value={editingProduct.fabric}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value as FabricType })}
                    className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20]"
                  >
                    <option value="Raw Silk">Raw Silk</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Organza">Organza</option>
                    <option value="Velvet">Velvet</option>
                    <option value="Pure Lawn">Pure Lawn</option>
                    <option value="Georgette">Georgette</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-xs text-[#6e5b4b] mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-[#342a20]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#ebdcca]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 bg-[#ede2d4] text-[#4d3e30] rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl font-semibold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: VIEW ORDER DETAILS */}
      {/* ======================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#fcf9f5] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#ded0bf] shadow-2xl space-y-4">
            <button
              onClick={() => setSelectedOrderDetails(null)}
              className="absolute top-4 right-4 p-2 text-[#5e4d3c] hover:text-[#342a20]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] uppercase font-mono text-[#8a7664]">LIVE RECORD</span>
              <h3 className="font-serif font-bold text-2xl text-[#342a20]">
                Order #{selectedOrderDetails.orderNumber}
              </h3>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#ebdcca] space-y-2 text-xs">
              <p><span className="text-[#887463]">Customer:</span> <span className="font-bold">{selectedOrderDetails.customer.fullName}</span></p>
              <p><span className="text-[#887463]">WhatsApp Phone:</span> <span className="font-bold">{selectedOrderDetails.customer.whatsappPhone}</span></p>
              <p><span className="text-[#887463]">Email:</span> {selectedOrderDetails.customer.email}</p>
              <p><span className="text-[#887463]">Shipping Address:</span> {selectedOrderDetails.customer.address}, {selectedOrderDetails.customer.city}, {selectedOrderDetails.customer.state} ({selectedOrderDetails.customer.postalCode})</p>
              {selectedOrderDetails.customer.notes && (
                <p><span className="text-[#887463]">Notes:</span> <span className="italic">{selectedOrderDetails.customer.notes}</span></p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase text-[#6d5b4a]">Ordered Items:</h4>
              <div className="divide-y divide-[#ede2d4] border border-[#ebdcca] bg-white rounded-xl p-3 max-h-48 overflow-y-auto">
                {selectedOrderDetails.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex justify-between text-xs">
                    <div>
                      <p className="font-semibold text-[#342a20]">{it.product.title}</p>
                      <p className="text-[11px] text-[#786550]">
                        Size: {it.selectedSize} • {it.isStitched ? 'Stitched' : 'Unstitched'} x{it.quantity}
                      </p>
                    </div>
                    <span className="font-bold tabular-nums">
                      ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-sm font-bold border-t border-[#ebdcca]">
              <span>Total Amount:</span>
              <span className="tabular-nums">₹{Math.round(selectedOrderDetails.total).toLocaleString('en-IN')} ({selectedOrderDetails.paymentMethod.toUpperCase()})</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleWhatsAppCustomer(selectedOrderDetails)}
                className="flex-1 py-2.5 px-4 bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <WhatsAppIcon size={18} color="#ffffff" />
                <span>Notify Customer on WhatsApp</span>
              </button>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="py-2.5 px-4 bg-[#ede2d4] text-[#3e3124] rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: DIRECT QUICK CHANGE ACTIVE CATALOG PHOTO */}
      {/* ======================================================== */}
      {quickChangePhotoProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative bg-[#fcf9f5] rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#ded0bf] shadow-2xl space-y-5 animate-in fade-in duration-200">
            <button
              onClick={() => setQuickChangePhotoProduct(null)}
              className="absolute top-4 right-4 p-2 text-[#5e4d3c] hover:text-[#342a20]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-[#786550] font-semibold uppercase tracking-wider mb-1">
                <Camera className="w-4 h-4" />
                <span>Catalog Photo Manager</span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#342a20]">
                Change Photo: {quickChangePhotoProduct.title}
              </h3>
              <p className="text-xs text-[#786550]">
                SKU: <span className="font-mono font-bold">{quickChangePhotoProduct.sku}</span> • {quickChangePhotoProduct.category}
              </p>
            </div>

            {/* Current vs New Comparison Preview */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#f6eee2] rounded-2xl border border-[#ded0bf]">
              <div className="text-center space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#786550]">
                  Current Active Photo
                </p>
                <div className="relative aspect-[3/4] max-h-36 mx-auto rounded-xl overflow-hidden bg-white border border-[#d8c8b6]">
                  <img
                    src={quickChangePhotoProduct.images[0]}
                    alt="Current"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="text-center space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800 font-bold">
                  New Selected Photo
                </p>
                <div className="relative aspect-[3/4] max-h-36 mx-auto rounded-xl overflow-hidden bg-white border-2 border-emerald-600 ring-2 ring-emerald-500/20">
                  <img
                    src={quickPhotoUrl || quickChangePhotoProduct.images[0]}
                    alt="New Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PRESET_ETHNIC_IMAGES[0].url;
                    }}
                  />
                  <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="space-y-3">
              <div className="flex bg-[#ede2d4] p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setQuickPhotoMode('upload')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    quickPhotoMode === 'upload' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPhotoMode('preset')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    quickPhotoMode === 'preset' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preset Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuickPhotoMode('url')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    quickPhotoMode === 'url' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Web Link</span>
                </button>
              </div>

              {/* Upload from device tab */}
              {quickPhotoMode === 'upload' && (
                <div>
                  <input
                    type="file"
                    ref={quickFileInputRef}
                    accept="image/*"
                    onChange={(e) => handleDeviceFileUpload(e, 'quick')}
                    className="hidden"
                  />
                  <div
                    onClick={() => quickFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#cbb7a2] hover:border-[#786550] bg-white rounded-2xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f4ebe0] text-[#786550] flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-[#342a20]">
                      Click to choose photo from your Mobile or Laptop
                    </p>
                    <p className="text-[10px] text-[#8e7a68]">
                      Supports JPG, PNG, WEBP (Instantly uploads and saves)
                    </p>
                  </div>
                </div>
              )}

              {/* Preset Gallery tab */}
              {quickPhotoMode === 'preset' && (
                <div className="space-y-1.5">
                  <p className="text-[11px] text-[#786550]">Click any ready-to-use luxury ethnic photo:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_ETHNIC_IMAGES.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setQuickPhotoUrl(preset.url)}
                        className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          quickPhotoUrl === preset.url
                            ? 'border-[#786550] ring-2 ring-[#786550]/40'
                            : 'border-[#d8c8b6] opacity-75 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {quickPhotoUrl === preset.url && (
                          <div className="absolute top-1 right-1 bg-[#786550] text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Web URL tab */}
              {quickPhotoMode === 'url' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#6e5b4b] mb-1">
                    Enter Online Image URL
                  </label>
                  <input
                    type="url"
                    value={quickPhotoUrl}
                    onChange={(e) => setQuickPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-white border border-[#d8c8b6] rounded-xl text-xs text-[#342a20] focus:outline-none focus:ring-1 focus:ring-[#786550]"
                  />
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#ebdcca]">
              <button
                type="button"
                onClick={() => setQuickChangePhotoProduct(null)}
                className="px-5 py-2.5 bg-[#ede2d4] text-[#4d3e30] rounded-xl font-medium text-xs sm:text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveQuickPhoto}
                className="px-6 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl font-semibold shadow-sm text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save New Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 4: CATEGORY PHOTO & LABEL REAL-TIME EDITOR */}
      {/* ======================================================== */}
      {editingCategoryMedia && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative bg-[#fcf9f5] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#ded0bf] shadow-2xl">
            <button
              onClick={() => setEditingCategoryMedia(null)}
              className="absolute top-4 right-4 p-2 text-[#5e4d3c] hover:text-[#342a20] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#786550] text-white">
                Category #{siteMedia.categories.findIndex(c => c.id === editingCategoryMedia.id) + 1}
              </span>
              <span className="text-xs text-[#786550] font-semibold">{editingCategoryMedia.name}</span>
            </div>

            <h3 className="font-serif font-bold text-2xl text-[#342a20] mb-4">
              Update Category Photo in Real-Time
            </h3>

            {/* Current Photo Preview */}
            <div className="mb-4 bg-[#f6eee2] p-3 rounded-2xl border border-[#ded0bf] flex items-center gap-4">
              <img
                src={categoryPhotoInput || editingCategoryMedia.image}
                alt={editingCategoryMedia.name}
                referrerPolicy="no-referrer"
                className="w-24 h-20 object-cover rounded-xl border border-[#cbb7a2] bg-[#ede2d4]"
              />
              <div className="flex-1 text-xs space-y-1">
                <p className="font-bold text-[#342a20]">{categoryLabelInput || editingCategoryMedia.label}</p>
                <p className="text-[11px] text-emerald-700 font-medium">✓ Changes will sync instantly to Homepage "Our Collection"</p>
              </div>
            </div>

            {/* Photo Mode Switcher */}
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex gap-1.5 p-1 bg-[#ede2d4] rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCategoryEditTabMode('upload')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    categoryEditTabMode === 'upload' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryEditTabMode('preset')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    categoryEditTabMode === 'preset' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryEditTabMode('url')}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    categoryEditTabMode === 'url' ? 'bg-[#786550] text-white shadow-xs' : 'text-[#483a2d]'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Web URL</span>
                </button>
              </div>

              {/* Upload tab */}
              {categoryEditTabMode === 'upload' && (
                <div>
                  <input
                    type="file"
                    ref={categoryModalFileInputRef}
                    accept="image/*"
                    onChange={handleCategoryModalFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => categoryModalFileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#cbb7a2] hover:border-[#786550] bg-white rounded-2xl p-5 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f4ebe0] text-[#786550] flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-xs text-[#342a20]">
                      Click to choose photo from Mobile or Laptop
                    </p>
                    <p className="text-[10px] text-[#8e7a68]">
                      Supports JPG, PNG, WEBP (Instantly updates live)
                    </p>
                  </div>
                </div>
              )}

              {/* Preset tab */}
              {categoryEditTabMode === 'preset' && (
                <div className="space-y-1.5">
                  <p className="text-[11px] text-[#786550]">Click any ready-to-use luxury ethnic photo:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_ETHNIC_IMAGES.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCategoryPhotoInput(preset.url)}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          categoryPhotoInput === preset.url
                            ? 'border-[#786550] ring-2 ring-[#786550]/40'
                            : 'border-[#d8c8b6] opacity-75 hover:opacity-100'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        {categoryPhotoInput === preset.url && (
                          <div className="absolute top-1 right-1 bg-[#786550] text-white rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URL tab */}
              {categoryEditTabMode === 'url' && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#6e5b4b] mb-1">
                    Image Link URL
                  </label>
                  <input
                    type="url"
                    value={categoryPhotoInput}
                    onChange={(e) => setCategoryPhotoInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 bg-white border border-[#d8c8b6] rounded-xl text-xs text-[#342a20]"
                  />
                </div>
              )}

              {/* Category Label Input */}
              <div>
                <label className="block text-[11px] font-semibold text-[#6e5b4b] mb-1">
                  Card Display Text / Label
                </label>
                <input
                  type="text"
                  value={categoryLabelInput}
                  onChange={(e) => setCategoryLabelInput(e.target.value)}
                  placeholder="e.g. Pakistani Suits"
                  className="w-full p-2.5 bg-white border border-[#d8c8b6] rounded-xl text-xs text-[#342a20]"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#ebdcca]">
                <button
                  type="button"
                  onClick={() => setEditingCategoryMedia(null)}
                  className="px-5 py-2.5 bg-[#ede2d4] text-[#4d3e30] rounded-xl font-medium text-xs sm:text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCategoryEditor}
                  className="px-6 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl font-semibold shadow-sm text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Update Photo in Real-Time</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Security & Credentials Customization Modal */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#fcf9f5] border border-[#d8c8b6] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#382d23] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#f5ede2]">
                    Admin Security & Login Credentials
                  </h3>
                  <p className="text-xs text-[#dec8b2]">
                    Change Admin ID and Password for security
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSecurityCredentials} className="p-6 space-y-4">
              {/* Alert Status */}
              {securityModalError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{securityModalError}</span>
                </div>
              )}
              {securityModalSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{securityModalSuccess}</span>
                </div>
              )}

              {/* Current Active ID Notice */}
              <div className="p-3.5 bg-[#f4ebe0] rounded-xl border border-[#ded0bf] flex items-center justify-between text-xs">
                <span className="text-[#6d5b4a] font-medium">Currently Active Admin ID:</span>
                <span className="font-mono font-bold text-[#342a20] bg-white px-2.5 py-1 rounded-md border border-[#d8c8b6]">
                  {adminCredentials.id}
                </span>
              </div>

              {/* New Admin ID Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e5b4b] mb-1.5">
                  New Admin ID / Username / Email
                </label>
                <input
                  type="text"
                  required
                  value={newAdminIdInput}
                  onChange={(e) => setNewAdminIdInput(e.target.value)}
                  placeholder="e.g. skhamza89100@gmail.com or admin_hoor"
                  className="w-full p-3 bg-white border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550]"
                />
                <p className="text-[11px] text-[#8c7866] mt-1">
                  Aap next time login karne ke liye is naye ID ka istemaal karenge.
                </p>
              </div>

              {/* New Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e5b4b]">
                    New Password (Naya Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-[11px] text-[#786550] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showNewPassword ? 'Hide Password' : 'Show Password'}</span>
                  </button>
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newAdminPasswordInput}
                  onChange={(e) => setNewAdminPasswordInput(e.target.value)}
                  placeholder="Enter strong new password (min. 4 characters)"
                  className="w-full p-3 bg-white border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550]"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e5b4b] mb-1.5">
                  Confirm New Password (Dobara Likhein)
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmAdminPasswordInput}
                  onChange={(e) => setConfirmAdminPasswordInput(e.target.value)}
                  placeholder="Confirm matching password"
                  className="w-full p-3 bg-white border border-[#d8c8b6] rounded-xl text-xs sm:text-sm text-[#342a20] placeholder-[#a69585] focus:outline-none focus:ring-1 focus:ring-[#786550]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#ebdcca]">
                <button
                  type="button"
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#d8c8b6] text-xs font-semibold text-[#6e5b4b] hover:bg-[#efe4d6] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#786550] hover:bg-[#62513f] text-white rounded-xl text-xs font-semibold tracking-wide shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save ID & Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
