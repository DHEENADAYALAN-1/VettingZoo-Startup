"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Account created successfully");

      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#7c3aed33,transparent_35%),radial-gradient(circle_at_bottom_right,#06b6d433,transparent_35%)]" />

      <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-2xl p-8 shadow-2xl">
        <p className="text-cyan-300 tracking-[0.25em] uppercase text-sm font-semibold mb-4">
          Vetting Zoo
        </p>

        <h1 className="text-5xl font-black leading-tight">
          Create Recruiter Account
        </h1>

        <p className="mt-4 text-white/55 leading-7">
          Create your recruiter account to access AI candidate ranking and hiring insights.
        </p>

        <div className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Recruiter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-300/40"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-300/40"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-full bg-white text-black py-4 font-black hover:bg-cyan-200 transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        <p className="mt-6 text-center text-white/45">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-300 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}