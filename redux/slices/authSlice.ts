import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {auth, googleProvider, facebookProvider} from "@/lib/firebase"
import {
   signInWithEmailAndPassword,
   createUserWithEmailAndPassword,
   signInWithPopup,
   signOut,
} from "firebase/auth"
import { User } from "@/types/User"

interface AuthState {
   user : User | null;
   loading: boolean;
   error: string | null;
}


const initialState: AuthState = {
   user: null,
   loading: false,
   error: null,
}

export const registerUser = createAsyncThunk(
   "auth/registerUser",
   async({email, password}: {email:string; password:string}, thunkAPI) => {
      try{
         const userCredential = await createUserWithEmailAndPassword(auth,email,password);
         const user = userCredential.user;
         return {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName,
            name: user.displayName || "",
            role: "customer" as const,
            createdAt: new Date().toISOString(),
         };
      } catch (error: unknown){
         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
         return thunkAPI.rejectWithValue(errorMessage);
      }
   }
);

export const loginUser = createAsyncThunk(
   "auth/loginUser",
   async({email, password}: {email:string; password: string}, thunkAPI) => {
      try{
         const userCredential = await signInWithEmailAndPassword(auth,email,password);
         const user = userCredential.user;
         return {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName,
            name: user.displayName || "",
            role: "customer" as const,
            createdAt: new Date().toISOString(),
         };
      }catch (error: unknown){
         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
         return thunkAPI.rejectWithValue(errorMessage);
      }
   }
);

export const loginWithGoogle = createAsyncThunk(
   "auth/loginWithGoogle",
   async(_, thunkAPI) => {
      try{
         const userCredential = await signInWithPopup(auth, googleProvider);
         const user = userCredential.user;
         return {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName,
            name: user.displayName || "",
            role: "customer" as const,
            createdAt: new Date().toISOString(),
         };
      }catch (error: unknown){
         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
         return thunkAPI.rejectWithValue(errorMessage);
      }
   }
);

export const loginWithFacebook = createAsyncThunk(
   "auth/loginWithFacebook",
   async(_, thunkAPI) => {
      try{
         const userCredential = await signInWithPopup(auth, facebookProvider);
         const user = userCredential.user;
         return {
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName,
            name: user.displayName || "",
            role: "customer" as const,
            createdAt: new Date().toISOString(),
         };
      }catch (error: unknown){
         const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
         return thunkAPI.rejectWithValue(errorMessage);
      }
   }
);

export const logoutUser = createAsyncThunk( "auth/logoutUser", async ()=> {
   await signOut(auth);
});

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      setUser: (state, action: PayloadAction<AuthState["user"]>) => {
         state.user = action.payload;
      },
      clearUser: (state) => {
         state.user = null;
         state.error = null;
      },
   },
   extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
    });

    // Google Login
    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginWithGoogle.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Facebook Login
    builder.addCase(loginWithFacebook.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginWithFacebook.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(loginWithFacebook.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
   },
})

export const {setUser, clearUser} = authSlice.actions;
export default authSlice.reducer;