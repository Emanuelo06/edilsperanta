import { db, auth } from "@/lib/firebase";
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
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";

export interface UserAddress {
  type: 'shipping' | 'billing';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  id?: string;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  addresses?: UserAddress[];
  preferences?: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastLoginAt?: Timestamp;
}

const COLLECTION = 'users';

export class UserService {
  // Register new user
  static async register(
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    phone?: string
  ): Promise<{user: FirebaseUser, userData: User}> {
    try {
      // Create authentication account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Create user document in Firestore
      const now = Timestamp.now();
      const userData: Omit<User, 'id'> = {
        uid: firebaseUser.uid,
        email,
        firstName,
        lastName,
        phone,
        role: 'customer',
        isActive: true,
        preferences: {
          newsletter: false,
          smsNotifications: false,
          emailNotifications: true,
        },
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
      };
      
      await addDoc(collection(db, COLLECTION), userData);
      
      return { user: firebaseUser, userData: userData as User };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Login user
  static async login(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login time
      const user = await this.getUserByUid(userCredential.user.uid);
      if (user?.id) {
        await this.updateUser(user.id, { lastLoginAt: Timestamp.now() });
      }
      
      return userCredential.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Get all users
  static async getUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() } as User);
      });
      
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Get single user by ID
  static async getUser(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  // Get user by UID
  static async getUserByUid(uid: string): Promise<User | null> {
    try {
      const q = query(collection(db, COLLECTION), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user by UID:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    try {
      const now = Timestamp.now();
      const updateData = { ...updates, updatedAt: now };
      
      const docRef = doc(db, COLLECTION, id);
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Send password reset email
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  // Add address to user
  static async addAddress(userId: string, address: UserAddress): Promise<void> {
    try {
      const user = await this.getUser(userId);
      if (!user) throw new Error('User not found');
      
      const addresses = user.addresses || [];
      
      // If this is set as default, make others non-default
      if (address.isDefault) {
        addresses.forEach(addr => addr.isDefault = false);
      }
      
      addresses.push(address);
      
      await this.updateUser(userId, { addresses });
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  // Update user preferences
  static async updatePreferences(userId: string, preferences: User['preferences']): Promise<void> {
    try {
      await this.updateUser(userId, { preferences });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  // Get customer statistics
  static async getCustomerStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    newThisMonth: number;
  }> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION));
      const stats = {
        total: 0,
        active: 0,
        inactive: 0,
        newThisMonth: 0,
      };
      
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      querySnapshot.forEach((doc) => {
        const user = doc.data() as User;
        if (user.role === 'customer') {
          stats.total++;
          if (user.isActive) {
            stats.active++;
          } else {
            stats.inactive++;
          }
          
          if (user.createdAt && user.createdAt.toDate() > oneMonthAgo) {
            stats.newThisMonth++;
          }
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting customer stats:', error);
      throw error;
    }
  }
}
