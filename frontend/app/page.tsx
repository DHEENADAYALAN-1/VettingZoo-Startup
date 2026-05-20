"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  FileSearch,
  ShieldCheck,
  Sparkles,
  Users,
  Layers,
  Route,
  SearchCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { Smooch_Sans } from "next/font/google";

const smooch = Smooch_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
      <section
  id="home"
  className="relative min-h-screen flex items-center justify-center overflow-hidden"
>
       <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/bg.jpg')",
  }}
/>

<div className="absolute inset-0 bg-[#020617]/65" />

       <nav className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-16 py-7 border-b border-white/10 bg-[#050816]/80 backdrop-blur-xl">
  <Link href="/" className="flex items-center gap-5">
    <img
      src="/logo.png"
      alt="Vetting Zoo"
      className="h-16 w-16 rounded-2xl object-cover"
    />

    <h1 className="text-6xl font-black text-white tracking-tight">
      Vetting Zoo
    </h1>
  </Link>
<div className="hidden md:flex items-center gap-16 text-2xl font-semibold">
  <a href="#home" className="text-white/75 hover:text-white transition">
    Home
  </a>

  <a href="#features" className="text-white/75 hover:text-white transition">
    Features
  </a>

  <Link href="/demo" className="text-white/75 hover:text-white transition">
    Resume Analyzer
  </Link>

  <Link href="/recruiter" className="text-white/75 hover:text-white transition">
    Recruiter Dashboard
  </Link>
</div>
  <Link
    href="/login"
    className="px-10 py-4 rounded-full border border-cyan-300/25 bg-cyan-300/10 text-cyan-200 text-xl font-bold hover:bg-white hover:text-black hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] transition"
  >
    Login
  </Link>
</nav>

        <div className="relative z-10 w-full pl-10 md:pl-20 pr-10 grid lg:grid-cols-2 gap-24 items-center pt-44">
          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm text-cyan-200 mb-7">
              <Sparkles className="h-4 w-4" />
              AI Hiring Intelligence Platform
            </div>

            <h2
  className={`${smooch.className} text-8xl md:text-[10rem] font-black leading-[1] tracking-[0.02em]`}
>
  Recruit smarter with
  <span className="block animate-pulse bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
    AI precision.
  </span>
</h2>

            <p className="mt-7 text-xl text-white/65 max-w-2xl leading-9">
              Vetting Zoo helps recruiters screen resumes, rank candidates,
              explain hiring fit, and generate interview insights using ATS
              logic, semantic AI, and recruiter intelligence.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/demo"
                className="group rounded-full bg-white text-black px-8 py-4 font-bold flex items-center justify-center gap-2 hover:bg-cyan-200 transition"
              >
                Try AI Screening
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="/recruiter"
                className="rounded-full border border-white/15 px-8 py-4 font-bold hover:bg-white/10 transition text-center"
              >
                View Recruiter Dashboard
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-5 max-w-xl">
              {[
                ["92%", "Match accuracy"],
                ["10x", "Faster screening"],
                ["AI", "Recruiter agent"],
              ].map((item) => (
                <div
                  key={item[1]}
                  className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"
                >
                  <h3 className="text-4xl font-black">{item[0]}</h3>
                  <p className="text-sm text-white/50 mt-2">{item[1]}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
  id="recruiters"
  className="relative flex items-center"
  initial={{ opacity: 0, x: 40 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
  <div className="w-full max-w-2xl">

    <p className="text-cyan-300 tracking-[0.3em] text-sm font-semibold uppercase mb-5">
      AI Recruitment Flow
    </p>

    <h2 className="text-6xl md:text-6xl font-extrabold leading-tight tracking-tight">
      Vetting Zoo what it does?
    </h2>

    <p className="mt-6 text-white/60 text-xl leading-9 max-w-2xl">
      Upload resumes, compare candidates against job descriptions,
      and receive AI-powered recruiter insights instantly.
    </p>

    <div className="mt-14 space-y-12">

      <motion.div
  whileHover={{
    x: 10,
    scale: 1.02,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 15,
  }}
  className="flex gap-6 cursor-pointer"
>
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full border border-cyan-300/30 bg-cyan-300/10 flex items-center justify-center text-cyan-300 font-bold text-lg">
            01
          </div>

          <div className="w-px h-full bg-white/10 mt-4" />
        </div>

        <div>
          <h3 className="text-2xl font-bold">
            Upload Candidate Resumes
          </h3>

          <p className="mt-3 text-white/55 leading-8 text-lg">
            Upload one or multiple PDF resumes directly into the recruiter dashboard.
          </p>
        </div>
      </motion.div>

      <motion.div
  whileHover={{
    x: 10,
    scale: 1.02,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 15,
  }}
  className="flex gap-6 cursor-pointer"
>
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full border border-purple-300/30 bg-purple-300/10 flex items-center justify-center text-purple-300 font-bold text-lg">
            02
          </div>

          <div className="w-px h-full bg-white/10 mt-4" />
        </div>

        <div>
          <h3 className="text-2xl font-bold">
            AI Skill & ATS Analysis
          </h3>

          <p className="mt-3 text-white/55 leading-8 text-lg">
            Vetting Zoo extracts skills, compares job relevance, and calculates semantic match scores.
          </p>
        </div>
      </motion.div>

     <motion.div
  whileHover={{
    x: 10,
    scale: 1.02,
  }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 15,
  }}
  className="flex gap-6 cursor-pointer"
>
        <div className="flex flex-col items-center">
          <div className="h-14 w-14 rounded-full border border-pink-300/30 bg-pink-300/10 flex items-center justify-center text-pink-300 font-bold text-lg">
            03
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold">
            Rank & Shortlist Candidates
          </h3>

          <p className="mt-3 text-white/55 leading-8 text-lg">
            Recruiters receive ranked candidates, AI summaries, matched skills, and hiring insights.
          </p>
        </div>
     </motion.div>

    </div>
  </div>
</motion.div>
        </div>
      </section>

  <section
  id="features"
  className="relative px-10 py-36 bg-[#070a1a]"
>
  <div className="max-w-[1700px] mx-auto">
    
    <h2 className="text-8xl font-black text-center text-white leading-tight">
      Built for candidates & recruiters
    </h2>

    <p className="text-center text-white/55 text-3xl mt-8 max-w-5xl mx-auto leading-[3rem]">
      Vetting Zoo helps candidates improve resumes and helps recruiters identify the best talent using AI-powered hiring intelligence.
    </p>

    <div className="grid lg:grid-cols-2 gap-20 mt-32">

      {/* LEFT CARD */}

      <div className="rounded-[3rem] border border-cyan-300/10 bg-[#0b1222] p-16 min-h-[760px] hover:border-cyan-300/25 transition">
        
        <div className="inline-flex px-6 py-3 rounded-full bg-cyan-300/10 text-cyan-300 text-lg font-bold mb-12">
          FOR CANDIDATES
        </div>

        <h3 className="text-7xl font-black mb-16 leading-tight">
          Resume Analyzer
        </h3>

        <div className="space-y-14">

          <div>
            <h4 className="text-4xl font-black text-white">
              AI Resume Match Analysis
            </h4>

            <p className="text-white/55 mt-6 leading-[3rem] text-2xl">
              Compare resumes against job descriptions using ATS and semantic AI matching.
            </p>
          </div>

          <div>
            <h4 className="text-4xl font-black text-white">
              Missing Skills Detection
            </h4>

            <p className="text-white/55 mt-6 leading-[3rem] text-2xl">
              Identify missing technologies, weak sections, and improvement areas instantly.
            </p>
          </div>

          <div>
            <h4 className="text-4xl font-black text-white">
              AI Interview Preparation
            </h4>

            <p className="text-white/55 mt-6 leading-[3rem] text-2xl">
              Receive recruiter-style interview questions generated from resume content.
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT CARD */}

      <div className="rounded-[3rem] border border-purple-300/10 bg-[#0b1222] p-16 min-h-[760px] hover:border-purple-300/25 transition">
        
        <div className="inline-flex px-6 py-3 rounded-full bg-purple-300/10 text-purple-300 text-lg font-bold mb-12">
          FOR RECRUITERS
        </div>

        <h3 className="text-7xl font-black mb-16 leading-tight">
          Hiring Workspace
        </h3>

        <div className="space-y-14">

          <div>
            <h4 className="text-4xl font-black text-white">
              Multi-Candidate Ranking
            </h4>

            <p className="text-white/55 mt-6 leading-[3rem] text-2xl">
              Upload multiple resumes and let AI rank top candidates automatically.
            </p>
          </div>

          <div>
            <h4 className="text-4xl font-black text-white">
              Explainable Hiring Insights
            </h4>

            <p className="text-white/55 mt-6 leading-[3rem] text-2xl">
              View strengths, concerns, summaries, and recruiter-style AI analysis.
            </p>
          </div>

          <div>
            <h4 className="text-4xl font-black text-white">
              Semantic Candidate Matching
            </h4>

            <p className="text-white/55 mt-6 leading-[3rem] text-2xl">
              Match resumes beyond keywords using contextual AI understanding.
            </p>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>

      <section id="screening" className="px-6 py-28 bg-black">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-6xl md:text-6xl font-black tracking-tight">
              Try screening before login.
            </h2>
            <p className="mt-6 text-xl text-white/60 leading-9">
              No forced signup. Candidates and recruiters can test the AI
              screening flow first, then unlock saved reports and accounts later.
            </p>

            <Link
              href="/demo"
              className="inline-flex mt-8 rounded-full bg-white text-black px-8 py-4 font-bold hover:bg-cyan-200 transition"
            >
              Launch Free Demo
            </Link>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8">
            <div className="grid gap-5">
              <div className="rounded-3xl bg-cyan-300/10 border border-cyan-300/20 p-6">
                <Layers className="h-8 w-8 text-cyan-300 mb-4" />
                <h3 className="text-2xl font-bold">3 Intelligence Layers</h3>
                <p className="text-white/55 mt-2">
                  Keyword ATS + Semantic AI + Gemini recruiter reasoning.
                </p>
              </div>

              <div className="rounded-3xl bg-purple-300/10 border border-purple-300/20 p-6">
                <Brain className="h-8 w-8 text-purple-300 mb-4" />
                <h3 className="text-2xl font-bold">Interview Intelligence</h3>
                <p className="text-white/55 mt-2">
                  Generates recruiter questions based on resume fit and gaps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="roadmap" className="px-6 py-28 bg-[#070a1a]">
        <div className="max-w-6xl mx-auto text-center">
          <Route className="h-12 w-12 mx-auto text-cyan-300 mb-6" />
          <h2 className="text-6xl font-black text-center">
  Ready to hire smarter?
</h2>
          <p className="text-center text-white/55 mt-6 text-xl max-w-4xl mx-auto leading-9">
  Screen resumes, rank candidates, and streamline hiring with Vetting Zoo AI.
</p>

          <div className="mt-10 rounded-[2rem] border border-white/10 bg-gradient-to-r from-purple-500/20 via-cyan-500/10 to-pink-500/20 p-10">
            <Building2 className="h-12 w-12 mx-auto text-cyan-300 mb-6" />
            <h3 className="text-4xl font-black">
              Start screening candidates with AI.
            </h3>
            <p className="mt-4 text-white/60 text-lg">
              Built for recruiters, startups, placement cells, and hiring teams.
            </p>
            <Link
              href="/recruiter"
              className="inline-block mt-8 rounded-full bg-white text-black px-8 py-4 font-bold hover:bg-cyan-200 transition"
            >
              Open Recruiter Dashboard
            </Link>
          </div>
        </div>
      </section>
      <footer className="relative px-10 md:px-20 py-24 bg-[#030712] border-t border-white/10 overflow-hidden">
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#7c3aed22,transparent_30%),radial-gradient(circle_at_top_right,#06b6d422,transparent_30%)]" />

  <div className="relative z-10 w-full">
    <div className="grid lg:grid-cols-[1.7fr_1fr_1fr_1fr] gap-20">
      <div>
        <div className="flex items-center gap-5 mb-8">
          <div className="h-20 w-20 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
            <Image src="/logo.png" alt="Vetting Zoo Logo" width={120} height={120} className="scale-150 object-cover" />
          </div>

          <div>
            <h2 className="text-6xl font-black tracking-tight">Vetting Zoo</h2>
            <p className="text-cyan-300 text-lg mt-1">AI Hiring Intelligence</p>
          </div>
        </div>

        <p className="text-white/55 leading-9 text-xl max-w-2xl">
          Vetting Zoo helps recruiters, startups, placement cells, and companies screen resumes, rank candidates, generate recruiter insights, and accelerate hiring workflows.
        </p>

        <div className="mt-10 space-y-4 text-white/55 text-lg">
          <a href="mailto:dheenadayalandgl@gmail.com" className="block hover:text-cyan-300 transition">📧 dheenadayalandgl@gmail.com</a>
          <p>👨‍💻 Founder: Dheenadayalan N</p>
          <p>🌍 India</p>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-8 text-white">Platform</h3>
        <div className="space-y-5 text-white/55 text-lg">
          <Link href="/demo" className="block hover:text-cyan-300 transition">AI Screening</Link>
          <Link href="/recruiter" className="block hover:text-cyan-300 transition">Recruiter Dashboard</Link>
          <a href="#product" className="block hover:text-cyan-300 transition">Candidate Ranking</a>
          <a href="#screening" className="block hover:text-cyan-300 transition">Semantic Matching</a>
          <a href="#screening" className="block hover:text-cyan-300 transition">Interview Intelligence</a>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-8 text-white">Product</h3>
        <div className="space-y-5 text-white/55 text-lg">
          <Link href="/demo" className="block hover:text-cyan-300 transition">Live Demo</Link>
          <a href="#screening" className="block hover:text-cyan-300 transition">ATS Scoring</a>
          <a href="#product" className="block hover:text-cyan-300 transition">AI Insights</a>
          <Link href="/demo" className="block hover:text-cyan-300 transition">Resume Analysis</Link>
          <Link href="/demo" className="block hover:text-cyan-300 transition">PDF Report Export</Link>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-8 text-white">Resources</h3>
        <div className="space-y-5 text-white/55 text-lg">
          <Link href="/demo" className="block hover:text-cyan-300 transition">Live Demo</Link>
          <Link href="/recruiter" className="block hover:text-cyan-300 transition">Recruiter Dashboard</Link>
          <a href="#screening" className="block hover:text-cyan-300 transition">AI Resume Screening</a>
          <a href="#product" className="block hover:text-cyan-300 transition">Candidate Ranking</a>
          <a href="mailto:dheenadayalandgl@gmail.com" className="block hover:text-cyan-300 transition">Contact Founder</a>
        </div>
      </div>
    </div>

    <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
      <p className="text-white/40 text-lg">© 2026 Vetting Zoo. Built by Dheenadayalan N.</p>

      <div className="flex items-center gap-3 text-white/55 text-lg">
        <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
        Secure AI Screening Infrastructure
      </div>
    </div>
  </div>
</footer>
    </main>
  );
}