"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  LogOut,
  UploadCloud,
  Trophy,
  FileText,
  Users,
} from "lucide-react";

export default function RecruiterPage() {
  const router = useRouter();

  const [authLoading, setAuthLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const [resumes, setResumes] = useState<FileList | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
        "http://https://vettingzoo-startup.onrender.com/analyze-multiple",
        formData
      );

      setResults(response.data.rankings || []);
    } catch (error) {
      console.error(error);
      alert("Backend error. Check terminal.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white text-2xl font-bold">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <header className="w-full border-b border-white/10 px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
  <img
    src="/logo.png"
    alt="Vetting Zoo"
    className="w-16 h-16 rounded-2xl object-cover"
  />

  <div>
    <h1 className="text-4xl font-black">
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

            <p className="text-cyan-300 text-sm">
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

      <div className="grid grid-cols-[420px_1fr] gap-8 px-10 py-10">
        <section className="bg-[#0c1224] border border-white/10 rounded-3xl p-7 h-fit">
          <h2 className="text-3xl font-black mb-3">
            AI Resume Screening
          </h2>

          <p className="text-white/50 leading-7 mb-8">
            Upload resumes and compare candidates against job descriptions.
          </p>

          <div className="border border-dashed border-cyan-300/20 rounded-2xl p-8 text-center bg-[#08101f]">
            <UploadCloud className="mx-auto text-cyan-300 mb-4" size={48} />

        <p className="text-white text-lg font-semibold mt-5">
  Upload one or multiple PDF resumes
</p>

<p className="text-cyan-300 text-base font-medium mt-3 leading-7">
  Hold <span className="font-black text-cyan-200">Ctrl</span> and select multiple resumes
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
              className="w-full h-56 mt-3 rounded-2xl bg-[#08101f] border border-white/10 p-5 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full mt-7 h-14 rounded-2xl bg-white text-black font-black text-lg hover:opacity-90 transition"
          >
            {loading ? "Analyzing..." : "Rank Candidates"}
          </button>
        </section>

        <section className="bg-[#0c1224] border border-white/10 rounded-3xl p-7 min-h-[700px]">
          <div className="flex items-center justify-between mb-8">
  <div>
    <h2 className="text-4xl font-black">
      Candidate Rankings
    </h2>

    <p className="text-white/45 mt-2">
      Ranked by AI compatibility score
    </p>
  </div>

  <img
    src="/mascot.png"
    alt="Mascot"
    className="w-28 h-28 object-contain"
  />
</div>

          {results.length === 0 ? (
            <div className="h-[550px] border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-[#08101f]">
              <Users size={60} className="text-white/20 mb-5" />

              <h3 className="text-3xl font-black">
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
                  className="border border-white/10 rounded-3xl bg-[#08101f] p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white/40 text-sm">
                        Rank #{index + 1}
                      </p>

                      <h3 className="text-3xl font-black mt-2">
                        {candidate.filename}
                      </h3>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {candidate.matched_skills?.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-full bg-cyan-300/10 text-cyan-200 text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-5xl font-black text-cyan-300">
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
    </main>
  );
}