"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../lib/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Label } from "../ui/label";
import { SocialLoginButtons } from "./SocialLoginButtons";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  // Redirect to home page when user is authenticated
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only pass email and password, as expected by the slice
    dispatch(registerUser({ email, password }));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Înregistrare</h1>
      
      <div>
        <Label htmlFor="firstName" className="text-gray-700 font-medium">Prenume</Label>
        <Input 
          id="firstName" 
          value={firstName} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} 
          required 
          className="border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg"
        />
      </div>
      <div>
        <Label htmlFor="lastName" className="text-gray-700 font-medium">Nume</Label>
        <Input 
          id="lastName" 
          value={lastName} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} 
          required 
          className="border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg"
        />
      </div>
      <div>
        <Label htmlFor="phone" className="text-gray-700 font-medium">Telefon</Label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} 
          required 
          pattern="^\+40\s?7\d{2}\s?\d{3}\s?\d{3}$" 
          placeholder="+40 7XX XXX XXX" 
          className="border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
        <Input 
          id="email" 
          type="email" 
          value={email} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
          required 
          className="border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg"
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
          className="border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg"
        />
      </div>
      {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
      <Button 
        type="submit" 
        disabled={loading} 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300"
      >
        {loading ? "Se înregistrează..." : "Înregistrează-te"}
      </Button>
      
      {/* Social Login Buttons - Now at the bottom */}
      <SocialLoginButtons formBackground="bg-white" />
      
      <div className="flex justify-between text-xs mt-2">
        <Link href="/auth/login" className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 font-medium">Ai deja cont?</Link>
      </div>
    </Form>
  );
}
