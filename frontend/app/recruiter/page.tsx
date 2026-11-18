"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Arena from "./Arena";
import EvidenceChips from "../components/EvidenceChips";
import {
  LogOut,
  UploadCloud,
  Trophy,
  FileText,
  Users,
  Scale,
  Eye,
  EyeOff,
} from "lucide-react";

const getErrorMessage = (error: any) => {
  if (error?.response?.data?.detail) {
    const d = error.response.data.detail;
    return typeof d === "string" ? d : "Please check your file and job description.";
  }
  if (error?.code === "ECONNABORTED" || !error?.response) {
    return "Could not reach the server. It may be waking up, so wait a minute and try again.";
  }
  return "Something went wrong. Please try again.";
};

export default function RecruiterPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const [resumes, setResumes] = useState<FileList | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [blind, setBlind] = useState(false);
  const [arenaOpen, setArenaOpen] = useState(false);

  const nameOf = (i: number) => (blind ? `Candidate ${String.fromCharCode(65 + i)}` : results[i]?.filename);
  const toggleSelect = (i: number) =>
    setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : prev.length < 3 ? [...prev, i] : prev));

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setUserEmail(user.email || "");
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleAnalyze = async () => {
    if (!resumes || !jobDescription.trim()) {
      alert("Upload resumes and enter job description");
      return;
    }

    const formData = new FormData();

    Array.from(resumes).forEach((resume) => {
      formData.append("resumes", resume);
    });

    formData.append("job_description", jobDescription);

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? "https://vettingzoo-startup.onrender.com"}/analyze-multiple`,
        formData,
        { timeout: 120000 }
      );

      setResults(response.data.rankings || []);
      setSelected([]);
      if (response.data.skipped?.length) {
        alert("Some files were skipped:\n" + response.data.skipped.join("\n"));
      }
    } catch (error) {
      console.error(error);
      alert(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center text-white text-2xl font-bold">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent text-white">
      <header className="w-full border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
  <img
    src="/logo.png"
    alt="Vetting Zoo"
    className="w-16 h-16 rounded-2xl object-cover"
  />

  <div>
    <h1 className="text-4xl font-semibold">
      Vetting Zoo
    </h1>

   <p className="text-white text-lg font-semibold mt-5">
      Recruiter Workspace
    </p>
  </div>
</div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-white/40">
              Signed in as
            </p>

            <p className="text-sky-300 text-sm">
              {userEmail}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-3 rounded-xl bg-white text-black font-bold hover:opacity-90 transition"
          >
            <div className="flex items-center gap-2">
              <LogOut size={18} />
              Logout
            </div>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 lg:gap-8 px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-7 h-fit">
          <h2 className="text-3xl font-semibold mb-3">
            AI Resume Screening
          </h2>

          <p className="text-white/50 leading-7 mb-8">
            Upload resumes and compare candidates against job descriptions.
          </p>

          <div className="border border-dashed border-sky-300/20 rounded-2xl p-8 text-center bg-white/[0.04]">
            <UploadCloud className="mx-auto text-sky-300 mb-4" size={48} />

        <p className="text-white text-lg font-semibold mt-5">
  Upload one or multiple PDF resumes
</p>

<p className="text-sky-300 text-base font-medium mt-3 leading-7">
  Hold <span className="font-semibold text-sky-200">Ctrl</span> and select multiple resumes
</p>

            <input
              type="file"
              multiple
              accept=".pdf"
              className="mt-5"
              onChange={(e) => setResumes(e.target.files)}
            />

            {resumes && (
              <div className="mt-5 text-left space-y-2">
                {Array.from(resumes).map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <FileText size={16} />
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8">
            <label className="text-white text-lg font-semibold mt-5">
              Job Description
            </label>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full h-56 mt-3 rounded-2xl bg-white/[0.04] border border-white/10 p-5 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-7 h-14 rounded-2xl bg-white text-black font-semibold text-lg hover:opacity-90 transition"
          >
            {loading ? "Analyzing (first run can take up to a minute)..." : "Rank Candidates"}
          </button>
        </section>

        <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-5 sm:p-7 lg:min-h-[700px]">
          <div className="flex items-center justify-between mb-8">
  <div>
    <h2 className="text-4xl font-semibold">
      Candidate Rankings
    </h2>

    <p className="text-white/45 mt-2">
      Ranked by AI compatibility score
    </p>
  </div>

  <img
    src="/mascot.png"
    alt="Mascot"
    className="w-16 h-16 sm:w-28 sm:h-28 object-contain"
  />
</div>

          {results.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setBlind(!blind)}
                className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-semibold hover:bg-white/10"
              >
                {blind ? <EyeOff size={18} /> : <Eye size={18} />}
                {blind ? "Blind mode: on" : "Blind mode: off"}
              </button>
              <button
                onClick={() => setArenaOpen(true)}
                disabled={selected.length < 2}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-black disabled:opacity-40"
              >
                <Scale size={18} /> Compare in Arena ({selected.length}/3)
              </button>
              <p className="text-sm text-white/45">Tick 2 or 3 candidates to compare them head to head.</p>
            </div>
          )}

          {results.length === 0 ? (
            <div className="h-[320px] lg:h-[550px] border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-white/[0.04]">
              <Users size={60} className="text-white/20 mb-5" />

              <h3 className="text-3xl font-semibold">
                No candidates ranked yet
              </h3>

              <p className="text-white/45 mt-4 max-w-xl leading-8">
                Upload resumes and paste a job description to generate AI candidate rankings.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {results.map((candidate, index) => (
                <div
                  key={index}
                  className="border border-white/10 rounded-3xl bg-white/[0.04] p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <label className="flex cursor-pointer items-center gap-3 text-sm text-white/55">
                        <input
                          type="checkbox"
                          checked={selected.includes(index)}
                          onChange={() => toggleSelect(index)}
                          className="h-4 w-4 accent-sky-300"
                        />
                        Rank #{index + 1}. Select to compare
                      </label>

                      <h3 className="text-3xl font-semibold mt-2">
                        {nameOf(index)}
                      </h3>

                      <div className="mt-4">
                        <EvidenceChips skills={candidate.matched_skills || []} evidence={candidate.evidence} />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-5xl font-semibold text-sky-300">
                        {candidate.score}%
                      </div>

                      <p className="text-white/40 mt-2">
                        AI Match
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 text-white/65 leading-8">
                    {candidate.candidate_summary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {arenaOpen && selected.length >= 2 && (
        <Arena
          candidates={selected.map((i) => results[i])}
          names={selected.map((i) => nameOf(i))}
          blind={blind}
          onClose={() => setArenaOpen(false)}
        />
      )}
    </main>
  );
}