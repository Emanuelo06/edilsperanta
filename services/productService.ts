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
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  writeBatch,
  increment,
  Timestamp
} from "firebase/firestore";
import { uploadFile, deleteFile } from "@/lib/storage";

export interface Product {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku: string;
  images: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  rating: number;
  sales: number;
  tags: string[];
  specifications?: Record<string, string>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION = 'products';

export class ProductService {
  // Get all products with pagination
  static async getProducts(
    pageSize = 20, 
    lastDoc?: QueryDocumentSnapshot<DocumentData>,
    filters?: {
      category?: string;
      status?: string;
      minPrice?: number;
      maxPrice?: number;
    }
  ): Promise<{products: Product[], lastDoc?: QueryDocumentSnapshot<DocumentData>}> {
    try {
      let q = query(collection(db, COLLECTION));
      
      // Apply filters
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.minPrice) {
        q = query(q, where('price', '>=', filters.minPrice));
      }
      if (filters?.maxPrice) {
        q = query(q, where('price', '<=', filters.maxPrice));
      }
      
      // Order and paginate
      q = query(q, orderBy('createdAt', 'desc'));
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      q = query(q, limit(pageSize));
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      return { products, lastDoc: newLastDoc };
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  // Get single product
  static async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  // Alias for getProduct
  static async getProductById(id: string): Promise<Product | null> {
    return this.getProduct(id);
  }

  // Create new product
  static async createProduct(product: Omit<Product, 'id'>, imageFiles?: File[]): Promise<string> {
    try {
      const now = Timestamp.now();
      let images: string[] = [];
      
      // Upload images if provided
      if (imageFiles && imageFiles.length > 0) {
        const uploadPromises = imageFiles.map((file, index) => 
          uploadFile(file, `products/${Date.now()}_${index}_${file.name}`)
        );
        images = await Promise.all(uploadPromises);
      }
      
      const productData = {
        ...product,
        images,
        createdAt: now,
        updatedAt: now,
        rating: 0,
        sales: 0,
      };
      
      const docRef = await addDoc(collection(db, COLLECTION), productData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>, newImageFiles?: File[]): Promise<void> {
    try {
      const now = Timestamp.now();
      const updateData: Partial<Product> = { ...updates, updatedAt: now };
      
      // Handle new images
      if (newImageFiles && newImageFiles.length > 0) {
        // Get current product to delete old images if needed
        const currentProduct = await this.getProduct(id);
        
        // Upload new images
        const uploadPromises = newImageFiles.map((file, index) => 
          uploadFile(file, `products/${Date.now()}_${index}_${file.name}`)
        );
        const newImages = await Promise.all(uploadPromises);
        
        updateData.images = newImages;
        
        // Delete old images (optional - you might want to keep them)
        if (currentProduct?.images) {
          // Extract file paths from URLs for deletion
          // This is complex, you might want to store paths separately
        }
      }
      
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      // Get product to delete associated images
      const product = await this.getProduct(id);
      
      if (product?.images) {
        // Delete associated images
        // Note: This requires extracting file paths from URLs
        // You might want to store image paths separately for easier deletion
      }
      
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Search products
  static async searchProducts(searchTerm: string): Promise<Product[]> {
    try {
      // Note: Firestore doesn't have native full-text search
      // This is a simple implementation using array-contains for tags
      const q = query(
        collection(db, COLLECTION),
        where('tags', 'array-contains-any', [searchTerm.toLowerCase()])
      );
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      return products;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Update stock
  static async updateStock(id: string, quantity: number): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, {
        stock: increment(quantity),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('category', '==', category),
        where('status', '==', 'active'),
        orderBy('sales', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      return products;
    } catch (error) {
      console.error('Error getting products by category:', error);
      throw error;
    }
  }

  // Bulk operations
  static async bulkUpdateProducts(updates: Array<{id: string, updates: Partial<Product>}>): Promise<void> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.now();
      
      updates.forEach(({ id, updates: productUpdates }) => {
        const docRef = doc(db, COLLECTION, id);
        batch.update(docRef, { ...productUpdates, updatedAt: now });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error bulk updating products:', error);
      throw error;
    }
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(db, COLLECTION),
        where('status', '==', 'active'),
        orderBy('rating', 'desc'),
        limit(8)
      );
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      return products;
    } catch (error) {
      console.error('Error getting featured products:', error);
      throw error;
    }
  }
}
