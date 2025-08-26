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
  Timestamp
} from "firebase/firestore";

export interface Category {
  id?: string;
  name: string;
  description: string;
  slug: string;
  image?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION = 'categories';

export class CategoryService {
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('sortOrder', 'asc'));
      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() } as Category);
      });
      
      return categories;
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  // Get single category
  static async getCategory(id: string): Promise<Category | null> {
    try {
      const docRef = doc(db, COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Category;
      }
      return null;
    } catch (error) {
      console.error('Error getting category:', error);
      throw error;
    }
  }

  // Get category by slug
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const q = query(collection(db, COLLECTION), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Category;
      }
      return null;
    } catch (error) {
      console.error('Error getting category by slug:', error);
      throw error;
    }
  }

  // Create new category
  static async createCategory(category: Omit<Category, 'id'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const categoryData = {
        ...category,
        createdAt: now,
        updatedAt: now,
        productCount: 0,
      };
      
      const docRef = await addDoc(collection(db, COLLECTION), categoryData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  // Update category
  static async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    try {
      const now = Timestamp.now();
      const updateData = { ...updates, updatedAt: now };
      
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Get active categories
  static async getActiveCategories(): Promise<Category[]> {
    try {
      const q = query(
        collection(db, COLLECTION), 
        where('isActive', '==', true),
        orderBy('sortOrder', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({ id: doc.id, ...doc.data() } as Category);
      });
      
      return categories;
    } catch (error) {
      console.error('Error getting active categories:', error);
      throw error;
    }
  }
}
