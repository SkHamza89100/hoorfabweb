import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  getDocs,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Order, CustomerAnalytics, ActivityLog, SiteMediaConfig } from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ACTIVITY, 
  INITIAL_SITE_MEDIA 
} from '../data/initialData';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const CUSTOMERS_COLLECTION = 'customers';
const ACTIVITY_COLLECTION = 'activityLogs';
const SITE_MEDIA_DOC = 'siteMedia/config';
const ADMIN_SETTINGS_DOC = 'adminSettings/credentials';

/**
 * Initializes and seeds Firestore on first launch if empty
 */
export async function initializeFirestoreSeed(): Promise<void> {
  try {
    // 1. Check & Seed Products
    const prodSnap = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (prodSnap.empty) {
      console.log('[Firebase] Seeding initial products to Firestore...');
      const batch = writeBatch(db);
      INITIAL_PRODUCTS.forEach((p) => {
        batch.set(doc(db, PRODUCTS_COLLECTION, p.id), p);
      });
      await batch.commit();
    }

    // 2. Check & Seed Site Media
    const mediaDocRef = doc(db, 'siteMedia', 'config');
    const mediaSnap = await getDoc(mediaDocRef);
    if (!mediaSnap.exists()) {
      console.log('[Firebase] Seeding site media banners to Firestore...');
      await saveSiteMediaToFirestore(INITIAL_SITE_MEDIA);
    }

    // 3. Check & Seed Orders
    const orderSnap = await getDocs(collection(db, ORDERS_COLLECTION));
    if (orderSnap.empty) {
      console.log('[Firebase] Seeding initial orders to Firestore...');
      const batch = writeBatch(db);
      INITIAL_ORDERS.forEach((o) => {
        batch.set(doc(db, ORDERS_COLLECTION, o.id), o);
      });
      await batch.commit();
    }

    // 4. Check & Seed Customers
    const custSnap = await getDocs(collection(db, CUSTOMERS_COLLECTION));
    if (custSnap.empty) {
      console.log('[Firebase] Seeding initial customers to Firestore...');
      const batch = writeBatch(db);
      INITIAL_CUSTOMERS.forEach((c) => {
        batch.set(doc(db, CUSTOMERS_COLLECTION, c.id), c);
      });
      await batch.commit();
    }

    // 5. Check & Seed Activity Logs
    const actSnap = await getDocs(collection(db, ACTIVITY_COLLECTION));
    if (actSnap.empty) {
      console.log('[Firebase] Seeding initial activity logs to Firestore...');
      const batch = writeBatch(db);
      INITIAL_ACTIVITY.forEach((a) => {
        batch.set(doc(db, ACTIVITY_COLLECTION, a.id), a);
      });
      await batch.commit();
    }

    // 6. Check & Seed Admin Settings
    const credRef = doc(db, 'adminSettings', 'credentials');
    const credSnap = await getDoc(credRef);
    if (!credSnap.exists()) {
      await setDoc(credRef, { id: 'admin', pass: 'admin123' });
    }
  } catch (err) {
    console.warn('[Firebase] Seed check notice:', err);
  }
}

/**
 * Real-time listeners for live synchronization across sessions
 */
export function subscribeToProducts(callback: (products: Product[]) => void) {
  return onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const prods = snapshot.docs.map((d) => d.data() as Product);
        callback(prods);
      }
    },
    (err) => console.warn('[Firebase] Products listener notice:', err)
  );
}

export function subscribeToOrders(callback: (orders: Order[]) => void) {
  return onSnapshot(
    collection(db, ORDERS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const ords = snapshot.docs.map((d) => d.data() as Order);
        // Sort newest first
        ords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        callback(ords);
      }
    },
    (err) => console.warn('[Firebase] Orders listener notice:', err)
  );
}

export function subscribeToSiteMedia(callback: (media: SiteMediaConfig) => void) {
  return onSnapshot(
    collection(db, 'siteMedia'),
    (snapshot) => {
      if (!snapshot.empty) {
        let merged: Partial<SiteMediaConfig> = {};
        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (d.id === 'config') {
            merged = { ...merged, ...data };
          } else if (d.id === 'hero') {
            if (data.heroImage) merged.heroImage = data.heroImage;
            if (data.heroImages) merged.heroImages = data.heroImages;
          } else if (d.id === 'presets') {
            if (data.galleryPresets) merged.galleryPresets = data.galleryPresets;
          } else if (d.id === 'categories') {
            if (data.categories) merged.categories = data.categories;
          }
        });

        if (merged.heroImage || merged.categories || merged.galleryPresets) {
          callback({
            ...INITIAL_SITE_MEDIA,
            ...merged
          } as SiteMediaConfig);
        }
      }
    },
    (err) => console.warn('[Firebase] SiteMedia listener notice:', err)
  );
}

export function subscribeToActivityLogs(callback: (logs: ActivityLog[]) => void) {
  return onSnapshot(
    collection(db, ACTIVITY_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const logs = snapshot.docs.map((d) => d.data() as ActivityLog);
        callback(logs);
      }
    },
    (err) => console.warn('[Firebase] Activity listener notice:', err)
  );
}

export function subscribeToCustomers(callback: (customers: CustomerAnalytics[]) => void) {
  return onSnapshot(
    collection(db, CUSTOMERS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const custs = snapshot.docs.map((d) => d.data() as CustomerAnalytics);
        callback(custs);
      }
    },
    (err) => console.warn('[Firebase] Customers listener notice:', err)
  );
}

export function subscribeToAdminSettings(callback: (creds: { id: string; pass: string }) => void) {
  return onSnapshot(
    doc(db, 'adminSettings', 'credentials'),
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.id && data.pass) {
          callback({ id: data.id, pass: data.pass });
        }
      }
    },
    (err) => console.warn('[Firebase] Admin settings listener notice:', err)
  );
}

/**
 * Mutation operations writing directly to Cloud Firestore
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, PRODUCTS_COLLECTION, product.id), product);
  } catch (e) {
    console.error('[Firebase] Failed to save product:', e);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
  } catch (e) {
    console.error('[Firebase] Failed to delete product:', e);
  }
}

export async function updateProductStockInFirestore(productId: string, stockCount: number): Promise<void> {
  try {
    await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
      stockCount,
      inStock: stockCount > 0
    });
  } catch (e) {
    console.error('[Firebase] Failed to update stock:', e);
  }
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, ORDERS_COLLECTION, order.id), order);
  } catch (e) {
    console.error('[Firebase] Failed to save order:', e);
  }
}

export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<void> {
  try {
    await updateDoc(doc(db, ORDERS_COLLECTION, orderId), { status });
  } catch (e) {
    console.error('[Firebase] Failed to update order status:', e);
  }
}

export async function saveSiteMediaToFirestore(siteMedia: SiteMediaConfig): Promise<void> {
  try {
    // 1. Text & layout settings (< 1KB) - replaces previous monolithic doc
    const configData = {
      heroHeadline: siteMedia.heroHeadline || '',
      heroSubtitle: siteMedia.heroSubtitle || '',
      heroBadgeTitle: siteMedia.heroBadgeTitle || '',
      heroBadgeSubtitle: siteMedia.heroBadgeSubtitle || '',
      updatedAt: new Date().toISOString()
    };

    // 2. Hero showcase images (< 100KB)
    const heroData = {
      heroImage: siteMedia.heroImage || '',
      heroImages: siteMedia.heroImages || []
    };

    // 3. Preset photo slots (< 150KB)
    const presetsData = {
      galleryPresets: siteMedia.galleryPresets || []
    };

    // 4. Category collection cards (< 150KB)
    const categoriesData = {
      categories: siteMedia.categories || []
    };

    // Save modular documents in parallel so no single document ever approaches 1MB
    await Promise.all([
      setDoc(doc(db, 'siteMedia', 'config'), configData),
      setDoc(doc(db, 'siteMedia', 'hero'), heroData),
      setDoc(doc(db, 'siteMedia', 'presets'), presetsData),
      setDoc(doc(db, 'siteMedia', 'categories'), categoriesData)
    ]);
  } catch (e) {
    console.error('[Firebase] Failed to save site media:', e);
  }
}

export async function saveAdminCredentialsToFirestore(creds: { id: string; pass: string }): Promise<void> {
  try {
    await setDoc(doc(db, 'adminSettings', 'credentials'), creds);
  } catch (e) {
    console.error('[Firebase] Failed to save admin credentials:', e);
  }
}

export async function saveCustomerToFirestore(customer: CustomerAnalytics): Promise<void> {
  try {
    await setDoc(doc(db, CUSTOMERS_COLLECTION, customer.id), customer);
  } catch (e) {
    console.error('[Firebase] Failed to save customer:', e);
  }
}

export async function addActivityLogToFirestore(log: ActivityLog): Promise<void> {
  try {
    await setDoc(doc(db, ACTIVITY_COLLECTION, log.id), log);
  } catch (e) {
    console.error('[Firebase] Failed to log activity:', e);
  }
}

export async function resetAllFirestoreData(): Promise<void> {
  try {
    console.log('[Firebase] Resetting Firestore demo data...');
    // Reset products
    const prodBatch = writeBatch(db);
    INITIAL_PRODUCTS.forEach((p) => {
      prodBatch.set(doc(db, PRODUCTS_COLLECTION, p.id), p);
    });
    await prodBatch.commit();

    // Reset site media
    await saveSiteMediaToFirestore(INITIAL_SITE_MEDIA);

    // Reset orders
    const orderBatch = writeBatch(db);
    INITIAL_ORDERS.forEach((o) => {
      orderBatch.set(doc(db, ORDERS_COLLECTION, o.id), o);
    });
    await orderBatch.commit();

    // Reset admin credentials
    await setDoc(doc(db, 'adminSettings', 'credentials'), { id: 'admin', pass: 'admin123' });
  } catch (e) {
    console.error('[Firebase] Failed to reset demo data:', e);
  }
}
