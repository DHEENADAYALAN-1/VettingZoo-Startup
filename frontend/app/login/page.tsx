"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";


export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
  checkSession();
}, []);

const checkSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    router.push("/recruiter");
  }
};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/recruiter");
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/recruiter",
      },
    });

    if (error) {
      alert(error.message);
    }
  };

  return (
    <main
  className="min-h-screen text-white flex items-center justify-center px-6 bg-cover bg-center"
  style={{
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/login-bg.jpg')",
  }}
  
>
      <div className="w-full flex justify-center mb-10">
      <h1
    className="text-8xl text-white leading-none"
    style={{
      fontFamily: "'Dancing Script', cursive",
    }}
  >
    Sign In
  </h1>
        <div className="max-w-3xl mx-auto">
          <label className="block text-2xl mb-4 font-semibold">
            Email address
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-20 px-8 text-2xl rounded-xl bg-white text-black outline-none mb-10"
          />

          <label className="block text-2xl mb-4 font-semibold">
            Password
          </label>

          <div className="relative mb-10">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-20 px-8 pr-20 text-2xl rounded-xl bg-white text-black outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? (
                <EyeOff size={34} />
              ) : (
                <Eye size={34} />
              )}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full h-20 rounded-xl bg-white text-black text-3xl font-black hover:opacity-90 transition"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <div className="flex items-center gap-6 my-12">
            <div className="flex-1 h-[1px] bg-white/20" />
            <span className="text-2xl font-semibold">OR</span>
            <div className="flex-1 h-[1px] bg-white/20" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full h-20 border border-white/30 rounded-xl flex items-center justify-center gap-5 text-2xl font-bold hover:bg-white hover:text-black transition"
          >
            <FcGoogle size={38} />
            CONTINUE WITH GOOGLE
          </button>

          <p className="text-center mt-12 text-2xl text-white/70">
            New recruiter?{" "}
            <Link
              href="/signup"
              className="text-blue-400 font-bold hover:underline"
            >
              CREATE ACCOUNT
            </Link>
            <Link
  href="/"
  className="absolute top-8 left-8 text-white/70 hover:text-white font-semibold"
>
  ← Back to Home
</Link>
          </p>
        </div>
      </div>
    </main>
  );
}