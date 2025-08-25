"use client";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../redux/slices/authSlice";
import { AppDispatch, RootState } from "../../lib/store";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Label } from "../ui/label";

export function RegisterForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only pass email and password, as expected by the slice
    dispatch(registerUser({ email, password }));
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-2">Înregistrare</h1>
      <div>
        <Label htmlFor="firstName">Prenume</Label>
  <Input id="firstName" value={firstName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="lastName">Nume</Label>
  <Input id="lastName" value={lastName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="phone">Telefon</Label>
  <Input id="phone" value={phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)} required pattern="^\+40\s?7\d{2}\s?\d{3}\s?\d{3}$" placeholder="+40 7XX XXX XXX" />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="password">Parolă</Label>
  <Input id="password" type="password" value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={loading} className="w-full">{loading ? "Se înregistrează..." : "Înregistrează-te"}</Button>
      <div className="flex justify-between text-xs mt-2">
        <a href="/login" className="text-blue-600 hover:underline">Ai deja cont?</a>
      </div>
    </Form>
  );
}
