import { Product, Order, CustomerAnalytics, ActivityLog, SiteMediaConfig } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'HF-PAK-001',
    title: 'Royal Embroidered Suit',
    subtitle: 'Heavily embellished tilla & zari work with scalloped organza dupatta',
    category: 'Pakistani Suits',
    price: 3499,
    compareAtPrice: 4499,
    description: 'A regal ensemble crafted in raw silk with intricate antique gold tilla and resham thread embroidery across the front neckline, hem, and sleeves. Paired with a delicate embroidered organza dupatta featuring hand-cut scalloped borders and tailored cigarette trousers.',
    fabric: 'Raw Silk',
    pieces: '3 Piece (Shirt, Dupatta & Trouser)',
    workType: 'Hand-crafted Zari, Tilla & Micro-Sequins',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 14,
    isNew: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Dry clean only. Store in breathable garment bag. Iron on reverse low heat.',
    rating: 4.9,
    reviewsCount: 38
  },
  {
    id: 'prod-2',
    sku: 'HF-KUR-002',
    title: 'Elegant Kurti Set',
    subtitle: 'Artisanal pastel thread embroidery on breathable luxury cotton-silk',
    category: 'Daily Wear',
    price: 1899,
    compareAtPrice: 2499,
    description: 'Graceful ivory and champagne flared kurti detailed with fine multi-color pastel Kashmiri floral motifs along the placket and cuffs. Comes with matching relaxed straight pants with delicate lace insertion at the hem.',
    fabric: 'Cotton',
    pieces: '2 Piece (Kurti & Trouser)',
    workType: 'Subtle Kashmiri Resham Needlework',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 22,
    isNew: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Gentle hand wash in cold water or mild machine cycle. Line dry in shade.',
    rating: 4.8,
    reviewsCount: 27
  },
  {
    id: 'prod-3',
    sku: 'HF-OFF-003',
    title: 'Premium Suit Set',
    subtitle: 'Sophisticated sage green ensemble with subtle pearl & sequin detailing',
    category: 'Office Wear',
    price: 2799,
    compareAtPrice: 3599,
    description: 'Understated elegance designed for formal and executive settings. Features a muted sage green georgette tunic with fine tone-on-tone embroidery, mother-of-pearl button accents, and a flowing lightweight chiffon stole.',
    fabric: 'Georgette',
    pieces: '3 Piece (Shirt, Stole & Cigarette Pants)',
    workType: 'Tone-on-tone Resham & Seed Pearl Work',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 9,
    isNew: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469668-932d44933a3c?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Dry clean recommended. Steam iron only.',
    rating: 4.9,
    reviewsCount: 19
  },
  {
    id: 'prod-4',
    sku: 'HF-NEW-004',
    title: 'Noor-e-Zari Organza Suit',
    subtitle: 'Lustrous ivory festive suit with dabka embroidery and scalloped dupatta',
    category: 'Suits',
    price: 3999,
    compareAtPrice: 4999,
    description: 'A masterpiece from our festive celebration drop. Made of sheer shimmering ivory organza lined with pure silk slip. Laden with intricate gold dabka, sequins, and pearl detailing.',
    fabric: 'Organza',
    pieces: '3 Piece (Embroidered Shirt, Organza Dupatta & Silk Trousers)',
    workType: 'Dabka, Pearls, Cut-Dana & Zari',
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
    stockCount: 7,
    isNew: true,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Strictly dry clean. Preserve in archival cotton wrap.',
    rating: 5.0,
    reviewsCount: 14
  },
  {
    id: 'prod-5',
    sku: 'HF-KUR-005',
    title: 'Gul-e-Mauve Silk Kurti',
    subtitle: 'Dusty mauve flared kurti with hand-cut resham neckline embroidery',
    category: 'Kurtis',
    price: 1599,
    compareAtPrice: 1999,
    description: 'Soft dusty rose and mauve tones on luxurious blended silk. Flattering A-line silhouette with side slits and decorative cord tassel ties.',
    fabric: 'Raw Silk',
    pieces: '1 Piece (Statement Kurti)',
    workType: 'Hand-cut Resham Neckline & Cuff Border',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 18,
    isNew: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Dry clean or gentle hand wash. Do not wring.',
    rating: 4.7,
    reviewsCount: 31
  },
  {
    id: 'prod-6',
    sku: 'HF-NEW-006',
    title: 'Emerald Velvet Festive Ensemble',
    subtitle: 'Deep forest emerald velvet jacket suit with heritage antique zari',
    category: 'New Collection',
    price: 4999,
    compareAtPrice: 6499,
    description: 'Sumptuous plush micro-velvet tailored to perfection. Embellished with heavy traditional marori and gota patti thread embroidery. Paired with a contrast tissue gold dupatta.',
    fabric: 'Velvet',
    pieces: '3 Piece (Velvet Kurta, Gold Tissue Dupatta & Velvet Pants)',
    workType: 'Marori, Gota Patti & Antique Zari',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 5,
    isNew: true,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1610030469668-932d44933a3c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Dry clean only. Store in cool, dry climate.',
    rating: 4.9,
    reviewsCount: 22
  },
  {
    id: 'prod-7',
    sku: 'HF-PAK-007',
    title: 'Chiffon Mehfil 3-Piece Suit',
    subtitle: 'Pure crinkle chiffon with floral shadow work and mirror work borders',
    category: 'Pakistani Suits',
    price: 3699,
    compareAtPrice: 4699,
    description: 'An ethereal creation in dusty teal chiffon adorned with tone-on-tone Chikankari shadow work, tiny silver mukesh dots, and shimmering real mirror embellishments.',
    fabric: 'Chiffon',
    pieces: '3 Piece (Chiffon Shirt, Dupatta & Silk Trouser with Slip)',
    workType: 'Chikankari Shadow Work & Real Mirror Embellishment',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 11,
    isNew: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Dry clean only.',
    rating: 4.8,
    reviewsCount: 16
  },
  {
    id: 'prod-8',
    sku: 'HF-DAI-008',
    title: 'Pure Lawn Schiffli Daily Suit',
    subtitle: 'Premium breathable summer lawn with intricate laser cutwork embroidery',
    category: 'Daily Wear',
    price: 1399,
    compareAtPrice: 1799,
    description: 'Lightweight, ultra-soft combed Pakistani lawn cotton. Features delicate Schiffli eyelet embroidery along the neckline and daman with digital floral printed voil dupatta.',
    fabric: 'Pure Lawn',
    pieces: '3 Piece (Lawn Shirt, Voil Dupatta & Cambric Trouser)',
    workType: 'Schiffli Eyelet Laser Embroidery',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 26,
    isNew: false,
    isFeatured: false,
    images: [
      'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80'
    ],
    careInstructions: 'Machine wash delicate or hand wash. Warm iron.',
    rating: 4.6,
    reviewsCount: 42
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'HF-8941',
    date: '2026-10-16T18:32:00Z',
    customer: {
      fullName: 'Amina Tariq',
      whatsappPhone: '+91 81000 32281',
      email: 'amina.tariq@gmail.com',
      address: 'House 44-B, Sector F-7/2',
      city: 'Islamabad',
      state: 'Federal Capital',
      postalCode: '44000',
      notes: 'Please ensure careful gift packaging for wedding function.'
    },
    items: [
      {
        id: 'cart-1',
        product: INITIAL_PRODUCTS[0],
        selectedSize: 'M',
        isStitched: true,
        quantity: 1
      }
    ],
    subtotal: 3499,
    discount: 349.9,
    couponCode: 'HOOR10',
    shipping: 0,
    total: 3149.1,
    paymentMethod: 'whatsapp',
    status: 'processing',
    trackingNumber: 'TCS-90218402',
    estimatedDelivery: 'Oct 20, 2026'
  },
  {
    id: 'ord-102',
    orderNumber: 'HF-8938',
    date: '2026-10-15T11:15:00Z',
    customer: {
      fullName: 'Zainab Siddiqui',
      whatsappPhone: '+44 7911 123456',
      email: 'zainab.sidd@hotmail.co.uk',
      address: '28 Kensington Church Street',
      city: 'London',
      state: 'Greater London',
      postalCode: 'W8 4EP',
      notes: 'International courier delivery please.'
    },
    items: [
      {
        id: 'cart-2',
        product: INITIAL_PRODUCTS[3],
        selectedSize: 'S',
        isStitched: true,
        quantity: 1
      },
      {
        id: 'cart-3',
        product: INITIAL_PRODUCTS[1],
        selectedSize: 'S',
        isStitched: true,
        quantity: 1
      }
    ],
    subtotal: 5898,
    discount: 0,
    shipping: 0,
    total: 5898,
    paymentMethod: 'card',
    status: 'shipped',
    trackingNumber: 'DHL-847291039',
    estimatedDelivery: 'Oct 19, 2026'
  },
  {
    id: 'ord-103',
    orderNumber: 'HF-8929',
    date: '2026-10-14T14:45:00Z',
    customer: {
      fullName: 'Farah Mehmood',
      whatsappPhone: '+971 50 123 4567',
      email: 'farah.mehmood@outlook.com',
      address: 'Villa 14, Al Safa 2, Jumeirah',
      city: 'Dubai',
      state: 'Dubai',
      postalCode: '00000'
    },
    items: [
      {
        id: 'cart-4',
        product: INITIAL_PRODUCTS[5],
        selectedSize: 'L',
        isStitched: true,
        quantity: 1
      }
    ],
    subtotal: 4999,
    discount: 499.9,
    couponCode: 'HOOR10',
    shipping: 0,
    total: 4499.1,
    paymentMethod: 'upi',
    status: 'delivered',
    trackingNumber: 'ARAMEX-5549021',
    estimatedDelivery: 'Oct 16, 2026'
  },
  {
    id: 'ord-104',
    orderNumber: 'HF-8912',
    date: '2026-10-13T09:20:00Z',
    customer: {
      fullName: 'Sana Qureshi',
      whatsappPhone: '+92 321 9876543',
      email: 'sana.qureshi@yahoo.com',
      address: 'Block 5, Clifton, Marine Drive Apt 302',
      city: 'Karachi',
      state: 'Sindh',
      postalCode: '75600',
      notes: 'Call before delivery on mobile.'
    },
    items: [
      {
        id: 'cart-5',
        product: INITIAL_PRODUCTS[2],
        selectedSize: 'M',
        isStitched: false,
        quantity: 1
      }
    ],
    subtotal: 2799,
    discount: 0,
    shipping: 0,
    total: 2799,
    paymentMethod: 'cod',
    status: 'confirmed',
    trackingNumber: 'LEO-77382910',
    estimatedDelivery: 'Oct 18, 2026'
  }
];

export const INITIAL_CUSTOMERS: CustomerAnalytics[] = [
  {
    id: 'cust-1',
    fullName: 'Amina Tariq',
    whatsappPhone: '+91 81000 32281',
    email: 'amina.tariq@gmail.com',
    totalOrders: 4,
    totalSpent: 13996,
    lastOrderDate: '2026-10-16',
    segment: 'VIP',
    city: 'Islamabad'
  },
  {
    id: 'cust-2',
    fullName: 'Zainab Siddiqui',
    whatsappPhone: '+44 7911 123456',
    email: 'zainab.sidd@hotmail.co.uk',
    totalOrders: 3,
    totalSpent: 16500,
    lastOrderDate: '2026-10-15',
    segment: 'VIP',
    city: 'London'
  },
  {
    id: 'cust-3',
    fullName: 'Farah Mehmood',
    whatsappPhone: '+971 50 123 4567',
    email: 'farah.mehmood@outlook.com',
    totalOrders: 2,
    totalSpent: 9998,
    lastOrderDate: '2026-10-14',
    segment: 'Repeat',
    city: 'Dubai'
  },
  {
    id: 'cust-4',
    fullName: 'Sana Qureshi',
    whatsappPhone: '+92 321 9876543',
    email: 'sana.qureshi@yahoo.com',
    totalOrders: 1,
    totalSpent: 2799,
    lastOrderDate: '2026-10-13',
    segment: 'New',
    city: 'Karachi'
  },
  {
    id: 'cust-5',
    fullName: 'Mahnoor Khan',
    whatsappPhone: '+92 333 4455667',
    email: 'mahnoor.k@gmail.com',
    totalOrders: 2,
    totalSpent: 7398,
    lastOrderDate: '2026-10-10',
    segment: 'Repeat',
    city: 'Lahore'
  }
];

export const INITIAL_ACTIVITY: ActivityLog[] = [
  {
    id: 'act-1',
    timestamp: 'Just now',
    type: 'order_created',
    description: 'New Order #HF-8941 placed by Amina Tariq via WhatsApp Checkout',
    amount: 3149.1
  },
  {
    id: 'act-2',
    timestamp: '1 hour ago',
    type: 'order_status',
    description: 'Order #HF-8938 marked as Shipped via DHL Express'
  },
  {
    id: 'act-3',
    timestamp: '3 hours ago',
    type: 'inventory_update',
    description: 'Stock updated for Royal Embroidered Suit (14 units remaining)'
  },
  {
    id: 'act-4',
    timestamp: 'Yesterday',
    type: 'product_added',
    description: 'New product added: Emerald Velvet Festive Ensemble'
  }
];

export const INITIAL_SITE_MEDIA: SiteMediaConfig = {
  heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
  heroHeadline: 'Made for the HOOR',
  heroSubtitle: 'Elegant styles for every occasion — from everyday grace to timeless charm. Handcrafted Pakistani suits, pure lawn, organza, and artisanal embroideries.',
  heroBadgeTitle: 'Festive Formals Drop',
  heroBadgeSubtitle: 'Raw Silk & Organza Tilla',
  categories: [
    {
      id: 'cat-new',
      name: 'New Collection',
      label: 'New\nCollection',
      image: 'https://images.unsplash.com/photo-1610030469668-932d44933a3c?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Fresh seasonal arrivals'
    },
    {
      id: 'cat-daily',
      name: 'Daily Wear',
      label: 'Daily\nWear',
      image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Comfortable everyday elegance'
    },
    {
      id: 'cat-office',
      name: 'Office Wear',
      label: 'Office\nWear',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Sophisticated professional sets'
    },
    {
      id: 'cat-pak',
      name: 'Pakistani Suits',
      label: 'Pakistani\nSuits',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Artisanal hand embroidery'
    },
    {
      id: 'cat-kurti',
      name: 'Kurtis',
      label: 'Kurtis',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Chic ready to wear kurtis'
    },
    {
      id: 'cat-suit',
      name: 'Suits',
      label: 'Suits',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      subtitle: 'Timeless luxury ensembles'
    }
  ]
};
