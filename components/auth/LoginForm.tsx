"use client";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../lib/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Label } from "../ui/label";

export function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only pass email and password, as expected by the slice
    dispatch(loginUser({ email, password }));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-2">Autentificare</h1>
      <div>
        <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required autoFocus />
      </div>
      <div>
        <Label htmlFor="password">Parolă</Label>
  <Input id="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
      </div>
      <div className="flex items-center gap-2">
        <input id="remember" type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
        <Label htmlFor="remember">Ține-mă minte</Label>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Se autentifică..." : "Autentifică-te"}</Button>
      <div className="flex justify-between text-xs mt-2">
        <a href="/forgot-password" className="text-blue-600 hover:underline">Ai uitat parola?</a>
        <a href="/register" className="text-blue-600 hover:underline">Creează cont</a>
      </div>
    </Form>
  );
}
