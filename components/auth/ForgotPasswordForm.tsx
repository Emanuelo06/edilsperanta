"use client";
import * as React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form } from "../ui/form";
import { Label } from "../ui/label";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // TODO: Implement Firebase password reset
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <Form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-2">Recuperare parolă</h1>
      <div>
        <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {sent ? (
        <div className="text-green-600 text-sm">Instrucțiuni trimise pe email.</div>
      ) : (
        <Button type="submit" disabled={loading} className="w-full">{loading ? "Se trimite..." : "Trimite"}</Button>
      )}
      <div className="flex justify-between text-xs mt-2">
        <a href="/login" className="text-blue-600 hover:underline">Înapoi la autentificare</a>
      </div>
    </Form>
  );
}
