"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created. Now login.");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#050816] flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl">
        <h1 className="text-4xl font-black mb-3">Create Account</h1>

        <p className="text-white/50 mb-8">
          Create your recruiter account for Vetting Zoo.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 rounded-2xl bg-black/40 border border-white/10 p-4 outline-none focus:border-cyan-300/40"
        />

       <div className="relative mb-6">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 pr-14 outline-none focus:border-cyan-300/40"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-full bg-white text-black py-4 font-bold hover:bg-cyan-200 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-6 text-center text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}