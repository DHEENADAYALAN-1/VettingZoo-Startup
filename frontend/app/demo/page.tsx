"use client";

import { useRef, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, FileText, Printer, UploadCloud, X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], weight: ["600", "800"] });

const API = process.env.NEXT_PUBLIC_API_URL ?? "https://vettingzoo-startup.onrender.com";

const getErrorMessage = (error: any) => {
  const d = error?.response?.data?.detail;
  if (d) return typeof d === "string" ? d : "Please check your file and job description.";
  if (!error?.response) return "Could not reach the server. It may be waking up, so wait a minute and try again.";
  return "Something went wrong. Please try again.";
};

const CIRC = 2 * Math.PI * 68;

export default function DemoPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLElement>(null);

  const score = Math.round(result?.score || 0);
  const matched: string[] = result?.matched_skills || [];
  const missing: string[] = result?.missing_skills || [];

  const pickFile = (f?: File | null) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".pdf")) return setError("Only PDF resumes are supported.");
    setError("");
    setResume(f);
  };

  const handleAnalyze = async () => {
    if (!resume || !jobDescription.trim()) {
      setError("Add a resume and paste a job description first.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);
    try {
      setLoading(true);
      const response = await axios.post(`${API}/analyze`, formData, { timeout: 120000 });
      setResult(response.data);
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const Bar = ({ label, hint, value }: { label: string; hint: string; value: number }) => (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="font-semibold">{label}</p>
        <p className="text-2xl font-bold text-cyan-200">{value}%</p>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400 bar" style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <p className="mt-2 text-sm text-white/45">{hint}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050816] text-white relative overflow-x-hidden">
      <style>{`
        .lined{background-image:repeating-linear-gradient(transparent,transparent 31px,rgba(255,255,255,.06) 31px,rgba(255,255,255,.06) 32px);background-attachment:local;line-height:32px}
        @keyframes sweep{0%{top:0;opacity:0}10%{opacity:1}90%{opacity:1}100%{top:100%;opacity:0}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .beam{animation:sweep 1.6s ease-in-out infinite}
        .orbit{animation:spin 1.2s linear infinite;transform-origin:80px 80px}
        .ring{transition:stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)}
        .bar{transition:width 1.2s cubic-bezier(.2,.8,.2,1)}
        @media (prefers-reduced-motion:reduce){.beam,.orbit{animation:none}.ring,.bar{transition:none}}
        @media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact}.no-print{display:none!important}}
      `}</style>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,#7c3aed38,transparent_38%),radial-gradient(circle_at_95%_90%,#06b6d433,transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
        <nav className="no-print flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Vetting Zoo" className="h-10 w-10 rounded-xl" />
            <span className={`${display.className} text-xl font-extrabold`}>Vetting Zoo</span>
          </div>
        </nav>

        <header className="no-print mt-14 max-w-3xl">
          <h1 className={`${display.className} text-5xl font-extrabold leading-[1.05] sm:text-7xl`}>
            Does this resume fit the role?
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/60">
            Drop in a PDF resume and paste the job description. You get a match score, the skills found and missing, and interview questions for the gaps.
          </p>
        </header>

        {/* Stage: resume  |  dial  |  job description */}
        <section className="no-print mt-14 grid items-stretch gap-6 lg:grid-cols-[1fr_280px_1fr]">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files?.[0]); }}
            className={`relative flex min-h-[340px] flex-col overflow-hidden rounded-3xl border bg-white/[0.04] ${dragging ? "border-cyan-300" : "border-white/10"}`}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <p className={`${display.className} text-lg font-semibold`}>Resume</p>
              {resume && (
                <button onClick={() => setResume(null)} aria-label="Remove resume" className="text-white/40 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" hidden onChange={(e) => pickFile(e.target.files?.[0])} />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
            >
              {resume ? (
                <>
                  <FileText className="h-12 w-12 text-cyan-300" />
                  <span className="break-all text-lg font-semibold">{resume.name}</span>
                  <span className="text-sm text-white/45">{(resume.size / 1024).toFixed(0)} KB. Click to replace.</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-12 w-12 text-cyan-300" />
                  <span className="text-lg font-semibold">Drop a PDF here, or click to choose</span>
                  <span className="text-sm text-white/45">Text-based PDFs only, up to 10 MB</span>
                </>
              )}
            </button>
            {loading && <div className="beam absolute left-0 right-0 h-16 bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent border-b border-cyan-300/70" />}
          </div>

          {/* Dial */}
          <div className="flex flex-col items-center justify-center gap-6 py-2">
            <div className="relative h-[220px] w-[220px]">
              <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="dial" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth="10" />
                <circle cx="80" cy="80" r="68" fill="none" stroke="url(#dial)" strokeWidth="10" strokeLinecap="round"
                  className="ring" strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - (loading ? 0 : score) / 100)} />
                {loading && (
                  <circle cx="80" cy="80" r="68" fill="none" stroke="#67e8f9" strokeWidth="10" strokeLinecap="round"
                    className="orbit" strokeDasharray={`${CIRC * 0.2} ${CIRC}`} />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`${display.className} text-6xl font-extrabold`}>{loading ? "…" : result ? score : "–"}</span>
                <span className="text-sm text-white/50">{loading ? "Reading" : result ? "percent match" : "no score yet"}</span>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full rounded-full bg-white px-6 py-4 font-bold text-black transition hover:bg-cyan-200 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              {loading ? "Analyzing…" : result ? "Analyze again" : "Check the match"}
            </button>
            {loading && <p className="-mt-3 text-center text-sm text-white/45">The first run can take up to a minute while the server wakes up.</p>}
            {error && <p role="alert" className="-mt-2 rounded-xl border border-rose-400/40 bg-rose-400/10 p-3 text-center text-sm text-rose-200">{error}</p>}
          </div>

          <div className="flex min-h-[340px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
            <div className="border-b border-white/10 px-6 py-4">
              <p className={`${display.className} text-lg font-semibold`}>Job description</p>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the role here: responsibilities, required skills, tools…"
              className="lined flex-1 resize-none bg-transparent px-6 py-4 text-white outline-none placeholder:text-white/30 focus-visible:bg-white/[0.03]"
            />
          </div>
        </section>

        {/* Report */}
        {result && (
          <section ref={reportRef} className="mt-20 scroll-mt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className={`${display.className} text-4xl font-extrabold sm:text-5xl`}>{score}% match for this role</h2>
                <p className="mt-3 max-w-2xl text-lg leading-8 text-white/60">{result.recommendation}</p>
              </div>
              <button onClick={() => window.print()} className="no-print flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white hover:text-black">
                <Printer className="h-4 w-4" /> Print or save as PDF
              </button>
            </div>

            <div className="mt-10 grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] md:grid-cols-2">
              <div className="p-7">
                <p className={`${display.className} text-xl font-semibold text-cyan-200`}>Found in the resume</p>
                <p className="mt-1 text-sm text-white/45">{matched.length} of {matched.length + missing.length} skills the role asks for</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {matched.length ? matched.map((s) => (
                    <span key={s} className="rounded-full bg-cyan-300/12 px-4 py-1.5 text-cyan-100 ring-1 ring-cyan-300/30">{s}</span>
                  )) : <p className="text-white/45">No required skills found.</p>}
                </div>
              </div>
              <div className="border-t border-white/10 p-7 md:border-l md:border-t-0">
                <p className={`${display.className} text-xl font-semibold text-rose-200`}>Not found</p>
                <p className="mt-1 text-sm text-white/45">Gaps to ask about or train for</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {missing.length ? missing.map((s) => (
                    <span key={s} className="rounded-full bg-rose-400/10 px-4 py-1.5 text-rose-100 ring-1 ring-rose-300/30">{s}</span>
                  )) : <p className="text-white/45">Nothing missing.</p>}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-violet-300/20 bg-violet-400/[0.06] p-7">
                <p className={`${display.className} text-xl font-semibold text-violet-200`}>Recruiter summary</p>
                <p className="mt-4 leading-8 text-white/75">{result.ai_insight}</p>
                <p className="mt-4 leading-8 text-white/55">{result.candidate_summary}</p>
              </div>
              <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:grid-cols-2 md:grid-cols-1">
                <Bar label="Keyword match" hint="Skills named in both documents" value={Math.round(result.keyword_score || 0)} />
                <Bar label="Meaning match" hint="How similar the two texts read overall" value={Math.round(result.semantic_score || 0)} />
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/[0.05] p-7">
                <p className={`${display.className} text-xl font-semibold text-emerald-200`}>Strengths</p>
                <ul className="mt-4 space-y-2 text-white/75">{(result.strengths || []).map((t: string) => <li key={t}>{t}</li>)}</ul>
              </div>
              <div className="rounded-3xl border border-amber-300/20 bg-amber-400/[0.05] p-7">
                <p className={`${display.className} text-xl font-semibold text-amber-200`}>Concerns</p>
                <ul className="mt-4 space-y-2 text-white/75">{(result.concerns || []).map((t: string) => <li key={t}>{t}</li>)}</ul>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <p className={`${display.className} text-xl font-semibold`}>Questions to ask in the interview</p>
              <ol className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
                {(result.interview_questions || []).map((q: string, i: number) => (
                  <li key={i} className="flex gap-3 leading-7 text-white/75">
                    <span className="font-bold text-cyan-300">Q{i + 1}</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
