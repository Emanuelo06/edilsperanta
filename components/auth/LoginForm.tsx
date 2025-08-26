"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../lib/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);

  // Redirect to home page when user is authenticated
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only pass email and password, as expected by the slice
    dispatch(loginUser({ email, password }));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Autentificare</h1>
      
      <div>
        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          required 
          autoFocus 
          className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
        />
      </div>
      <div>
        <Label htmlFor="password" className="text-gray-700 font-medium">Parolă</Label>
        <Input 
          id="password" 
          type="password" 
          value={password} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
          required 
          className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg"
        />
      </div>
      <div className="flex items-center gap-2">
        <input 
          id="remember" 
          type="checkbox" 
          checked={remember} 
          onChange={e => setRemember(e.target.checked)} 
          className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
        />
        <Label htmlFor="remember" className="text-gray-600">Ține-mă minte</Label>
      </div>
      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        {loading ? "Se autentifică..." : "Autentifică-te"}
      </Button>
      
      {/* Social Login Buttons - Now at the bottom */}
      <SocialLoginButtons formBackground="bg-white" />
      
      <div className="flex justify-between text-xs mt-2">
        <Link href="/auth/forgot-password" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 font-medium">Ai uitat parola?</Link>
        <Link href="/auth/register" className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 font-medium">Creează cont</Link>
      </div>
    </Form>
  );
}
