"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/recruiter");
    });
  }, [router]);

  const handleLogin = async () => {
    setMessage("");

    if (!isSupabaseConfigured) {
      setMessage("Login is not configured yet: Supabase keys are missing.");
      return;
    }
    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/recruiter");
  };

  const handleGoogleLogin = async () => {
    setMessage("");

    if (!isSupabaseConfigured) {
      setMessage("Login is not configured yet: Supabase keys are missing.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/recruiter` },
    });
    if (error) setMessage(error.message);
  };

  return (
    <main
      className="relative min-h-screen text-white flex items-center justify-center px-6 py-16"
    >
      <Link
        href="/"
        className="absolute top-8 left-8 text-white/70 hover:text-white font-semibold"
      >
        ← Back to Home
      </Link>

      <div className="w-full max-w-md">
        <h1
          className="text-center text-5xl sm:text-6xl font-light leading-none mb-10"
          
        >
          Sign In
        </h1>

        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-4 text-yellow-200 text-sm">
            Supabase keys are missing, so login cannot work yet. Add
            NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-red-200 text-sm">
            {message}
          </div>
        )}

        <label className="block text-lg mb-2 font-semibold">Email address</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full h-14 px-5 text-lg rounded-xl bg-white text-black outline-none mb-6"
        />

        <label className="block text-lg mb-2 font-semibold">Password</label>
        <div className="relative mb-8">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full h-14 px-5 pr-14 text-lg rounded-xl bg-white text-black outline-none"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-14 rounded-xl bg-white text-black text-xl font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "LOGIN"}
        </button>

        <div className="flex items-center gap-4 my-8">
          <div className="flex-1 h-px bg-white/20" />
          <span className="font-semibold">OR</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-14 border border-white/30 rounded-xl flex items-center justify-center gap-3 text-lg font-bold hover:bg-white hover:text-black transition"
        >
          <FcGoogle size={26} />
          CONTINUE WITH GOOGLE
        </button>

        <p className="text-center mt-8 text-white/70">
          New recruiter?{" "}
          <Link href="/signup" className="text-blue-400 font-bold hover:underline">
            CREATE ACCOUNT
          </Link>
        </p>
      </div>
    </main>
  );
}
