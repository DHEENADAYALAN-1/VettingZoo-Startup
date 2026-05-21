"use client";

import { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Brain,
  FileText,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const score = result?.score || 0;

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) {
      alert("Please upload resume and enter job description");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      const response = await axios.post("http://https://vettingzoo-startup.onrender.com/analyze", formData);
      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-8 overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_left,#7c3aed40,transparent_35%),radial-gradient(circle_at_bottom_right,#06b6d440,transparent_35%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <nav className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-4">
  <img
    src="/logo.png"
    alt="Vetting Zoo"
    className="w-14 h-14 rounded-2xl object-cover"
  />

  <h1 className="text-3xl font-black text-white">
    Vetting Zoo Demo
  </h1>
</div>
        </nav>

        <section className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200 mb-6">
              <Sparkles className="h-4 w-4" />
              Free AI Screening Demo
            </div>

            <h1 className="text-5xl font-black leading-tight">
              Test your resume against any job description.
            </h1>

            <p className="mt-5 text-white/60 leading-8">
              Upload a resume, paste a job description, and preview how Vetting Zoo analyzes candidate fit.
            </p>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 shadow-2xl">
              <label className="block text-sm text-white/60 mb-3">Upload Resume</label>

              <div className="rounded-3xl border border-dashed border-cyan-300/30 bg-cyan-300/5 p-10 text-center">
                <UploadCloud className="h-12 w-12 mx-auto text-cyan-300 mb-4" />
                <p className="font-semibold">{resume ? resume.name : "Drop resume here or click to upload"}</p>
                <p className="text-sm text-white/40 mt-2">PDF supported for now</p>

                <input
                  type="file"
                  accept=".pdf"
                  className="mt-4 text-sm"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setResume(e.target.files[0]);
                  }}
                />
              </div>

              <label className="block text-sm text-white/60 mt-6 mb-3">Job Description</label>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full min-h-48 rounded-3xl border border-white/10 bg-black/30 p-5 text-white outline-none focus:border-cyan-300/50"
                placeholder="Paste the job description here..."
              />

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-6 w-full rounded-full bg-white text-black py-4 font-bold hover:bg-cyan-200 transition disabled:opacity-60"
              >
                {loading ? "AI is analyzing..." : "Analyze Candidate Fit"}
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-cyan-300" />
                <h2 className="text-2xl font-bold">AI Hiring Report</h2>
              </div>

              <span className="rounded-full bg-green-400/10 border border-green-400/20 px-3 py-1 text-xs text-green-300">
                Live Analysis
              </span>
            </div>

            <div className="rounded-3xl bg-black/30 border border-white/10 p-8 mb-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-cyan-400/10 blur-3xl rounded-full" />

              <p className="text-white/50 text-sm mb-4">Overall Match Score</p>

              <div className="flex items-center justify-between gap-6">
                <div>
                  <h3 className="text-7xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    {score}%
                  </h3>

                  <p className="text-white/50 mt-4 max-w-md leading-7">
                    {result?.ai_insight || "Upload a resume and paste a job description to generate an AI hiring report."}
                  </p>
                </div>

                <div className="h-28 w-28 rounded-full border-[10px] border-cyan-300/30 flex items-center justify-center bg-cyan-300/10 backdrop-blur-xl">
                  <span className="text-2xl font-bold text-cyan-300">{score}</span>
                </div>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-green-400/10 border border-green-400/20 px-4 py-2 text-green-300 text-sm font-semibold">
                <Zap className="h-4 w-4" />
                {result?.recommendation || "Waiting for analysis"}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.05] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-cyan-300 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Matched Skills
                  </p>

                  <span className="text-xs text-cyan-200 bg-cyan-300/10 px-3 py-1 rounded-full">
                    Strong Match
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {result?.matched_skills?.length ? (
                    result.matched_skills.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 rounded-full bg-cyan-300/10 border border-cyan-300/20 text-cyan-200 text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-white/45">No matched skills yet</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-red-300/10 bg-red-300/[0.04] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-red-300 font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Missing Skills
                  </p>

                  <span className="text-xs text-red-200 bg-red-300/10 px-3 py-1 rounded-full">
                    Skill Gap
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {result?.missing_skills?.length ? (
                    result.missing_skills.map((skill: string) => (
                      <span key={skill} className="px-4 py-2 rounded-full bg-red-300/10 border border-red-300/20 text-red-200 text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-white/45">No missing skills yet</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 rounded-3xl border border-purple-300/10 bg-purple-300/[0.05] p-5">
  <div className="flex items-center gap-2 mb-3">
    <Brain className="h-5 w-5 text-purple-300" />

    <p className="text-purple-300 font-semibold">
      AI Candidate Summary
    </p>
  </div>

  <p className="text-white/70 leading-8">
    {result?.candidate_summary ||
      "AI candidate understanding will appear here after analysis."}
  </p>
</div>
<div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
  <div className="rounded-3xl border border-green-300/10 bg-green-300/[0.05] p-5">
    <p className="text-green-300 font-semibold mb-3">
      Candidate Strengths
    </p>

    <ul className="space-y-2 text-white/65 text-sm">
      {result?.strengths?.length ? (
        result.strengths.map((item: string) => (
          <li key={item}>• {item}</li>
        ))
      ) : (
        <li>No strengths generated yet</li>
      )}
    </ul>
  </div>

  <div className="rounded-3xl border border-orange-300/10 bg-orange-300/[0.05] p-5">
    <p className="text-orange-300 font-semibold mb-3">
      Hiring Concerns
    </p>

    <ul className="space-y-2 text-white/65 text-sm">
      {result?.concerns?.length ? (
        result.concerns.map((item: string) => (
          <li key={item}>• {item}</li>
        ))
      ) : (
        <li>No concerns generated yet</li>
      )}
    </ul>
  </div>
</div>
<div className="mt-5 grid grid-cols-2 gap-4">
  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
    <p className="text-white/45 text-sm mb-2">Keyword Match</p>
    <h3 className="text-3xl font-black text-cyan-300">
      {result?.keyword_score || 0}%
    </h3>
    <p className="text-white/40 text-sm mt-2">
      Exact skill overlap
    </p>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
    <p className="text-white/45 text-sm mb-2">Semantic AI Match</p>
    <h3 className="text-3xl font-black text-purple-300">
      {result?.semantic_score || 0}%
    </h3>
    <p className="text-white/40 text-sm mt-2">
      Meaning-based similarity
    </p>
  </div>
</div>
<div className="mt-5 rounded-3xl border border-cyan-300/10 bg-cyan-300/[0.05] p-5">
  <div className="flex items-center gap-2 mb-4">
    <Brain className="h-5 w-5 text-cyan-300" />

    <p className="text-cyan-300 font-semibold">
      AI Suggested Interview Questions
    </p>
  </div>

  <div className="space-y-3">
    {result?.interview_questions?.length ? (
      result.interview_questions.map(
        (question: string, index: number) => (
          <div
            key={index}
            className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white/75"
          >
            <span className="text-cyan-300 font-semibold mr-2">
              Q{index + 1}.
            </span>

            {question}
          </div>
        )
      )
    ) : (
      <p className="text-white/45">
        AI interview questions will appear here.
      </p>
    )}
  </div>
</div>
        <button
  onClick={() => window.print()}
  className="mt-6 w-full rounded-full bg-white text-black py-4 font-bold hover:bg-cyan-200 transition"
>
  Download / Print AI Report
</button>
          </div>
        </section>
      </div>
    </main>
  );
}