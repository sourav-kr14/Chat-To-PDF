"use client";
import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import AuthCard from "@/components/AuthCard";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created. Please sign in.");
    } catch (err) {
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <AuthCard>
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">
          Create account
        </h1>

        <div className="space-y-4">
          <input
            className="w-full rounded-lg bg-white/10 px-4 py-3 
              outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-lg bg-white/10 px-4 py-3 
              outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-cyan-400"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-3 font-medium 
              text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-cyan-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
