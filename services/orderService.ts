import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  writeBatch,
  increment
} from "firebase/firestore";

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'paypal' | 'cash_on_delivery';
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderNumber: string;
  notes?: string;
  trackingNumber?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  completedAt?: Timestamp;
}

const COLLECTION = 'orders';

export class OrderService {
  // Get all orders with pagination
  static async getOrders(
    pageSize = 20,
    filters?: {
      status?: string;
      paymentStatus?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<Order[]> {
    try {
      let q = query(collection(db, COLLECTION));
      
      // Apply filters
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.paymentStatus) {
        q = query(q, where('paymentStatus', '==', filters.paymentStatus));
      }
      if (filters?.userId) {
        q = query(q, where('userId', '==', filters.userId));
      }
      
      // Order by creation date
      q = query(q, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      
      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  // Get single order
  static async getOrder(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  // Get orders by user
  static async getOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      
      return orders;
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  }

  // Create new order
  static async createOrder(orderData: Omit<Order, 'id' | 'orderNumber'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const order: Omit<Order, 'id'> = {
        ...orderData,
        orderNumber,
        createdAt: now,
        updatedAt: now,
      };
      
      const docRef = await addDoc(collection(db, COLLECTION), order);
      
      // Update product sales and stock
      const batch = writeBatch(db);
      orderData.items.forEach(item => {
        const productRef = doc(db, 'products', item.productId);
        batch.update(productRef, {
          sales: increment(item.quantity),
          stock: increment(-item.quantity)
        });
      });
      await batch.commit();
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Update order
  static async updateOrder(id: string, updates: Partial<Order>): Promise<void> {
    try {
      const now = Timestamp.now();
      const updateData: Partial<Order> = { 
        ...updates, 
        updatedAt: now 
      };
      
      // Set completion date if status is delivered
      if (updates.status === 'delivered') {
        updateData.completedAt = now;
      }
      
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(id: string, reason?: string): Promise<void> {
    try {
      const now = Timestamp.now();
      const order = await this.getOrder(id);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      // Only allow cancellation for pending/confirmed orders
      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled at this stage');
      }
      
      // Update order status
      await updateDoc(doc(db, COLLECTION, id), {
        status: 'cancelled',
        updatedAt: now,
        notes: reason ? `${order.notes || ''}\nCancellation reason: ${reason}` : order.notes
      });
      
      // Restore product stock
      const batch = writeBatch(db);
      order.items.forEach(item => {
        const productRef = doc(db, 'products', item.productId);
        batch.update(productRef, {
          stock: increment(item.quantity)
        });
      });
      await batch.commit();
      
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Get order statistics
  static async getOrderStats(): Promise<{
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  }> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION));
      const stats = {
        total: 0,
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
      };
      
      querySnapshot.forEach((doc) => {
        const order = doc.data() as Order;
        stats.total++;
        stats[order.status as keyof typeof stats]++;
        
        if (order.status === 'delivered' && order.paymentStatus === 'paid') {
          stats.totalRevenue += order.total;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw error;
    }
  }
}
