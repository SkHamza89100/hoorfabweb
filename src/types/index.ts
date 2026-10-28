export type ProductCategory = 
  | 'New Collection'
  | 'Daily Wear'
  | 'Office Wear'
  | 'Pakistani Suits'
  | 'Kurtis'
  | 'Suits'
  | 'Festive Formals';

export type FabricType = 
  | 'Chiffon'
  | 'Pure Lawn'
  | 'Organza'
  | 'Raw Silk'
  | 'Velvet'
  | 'Cotton'
  | 'Georgette';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export interface Product {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  description: string;
  fabric: FabricType;
  pieces: string; // e.g., "3 Piece: Kurti, Dupatta & Trouser"
  workType: string; // e.g., "Zari, Tilla & Resham Embroidery"
  sizes: ProductSize[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  images: string[];
  careInstructions: string;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string; // unique item id in cart (product id + size + stitched)
  product: Product;
  selectedSize: ProductSize;
  isStitched: boolean;
  quantity: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'whatsapp';

export interface OrderCustomer {
  fullName: string;
  whatsappPhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface CustomerAnalytics {
  id: string;
  fullName: string;
  whatsappPhone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  segment: 'VIP' | 'Repeat' | 'New';
  city: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'order_created' | 'order_status' | 'inventory_update' | 'product_added';
  description: string;
  amount?: number;
}

export interface CategoryMediaItem {
  id: string;
  name: ProductCategory;
  label: string;
  image: string;
  subtitle?: string;
}

export interface GalleryPresetSlot {
  id: string;
  label: string;
  url: string;
}

export interface SiteMediaConfig {
  heroImage: string;
  heroImages?: string[];
  galleryPresets?: GalleryPresetSlot[];
  heroHeadline: string;
  heroSubtitle: string;
  heroBadgeTitle: string;
  heroBadgeSubtitle: string;
  categories: CategoryMediaItem[];
}
