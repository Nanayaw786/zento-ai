"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await login({ email, password });
      setAuth({
        token: result.access_token,
        businessId: result.business_id,
        businessName: result.business_name,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zento-surface flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-zento-navy text-lg font-medium">Zento AI</span>
        </div>

        <div className="bg-white rounded-2xl border border-black/5 p-8">
          <h1 className="text-zento-navy text-xl font-medium mb-1">Welcome back</h1>
          <p className="text-black/50 text-sm mb-6">Sign in to your dashboard</p>

          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-black/60 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-black/10 text-sm focus:outline-none focus:ring-2 focus:ring-zento-navy/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full text-sm font-medium text-white bg-zento-navy py-2.5 rounded-lg hover:bg-zento-navy-light transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-black/50 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-zento-navy font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}