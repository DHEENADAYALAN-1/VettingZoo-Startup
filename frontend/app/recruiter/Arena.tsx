"use client";

import { X } from "lucide-react";

type Props = { candidates: any[]; names: string[]; blind: boolean; onClose: () => void };

export default function Arena({ candidates, names, blind, onClose }: Props) {
  const sorted = candidates
    .map((c, i) => ({ ...c, name: names[i] }))
    .sort((a, b) => b.score - a.score);
  const [top, second] = sorted;

  // every skill the role asks for, across all selected candidates
  const skills: string[] = Array.from(
    new Set(candidates.flatMap((c) => [...(c.matched_skills || []), ...(c.missing_skills || [])]))
  );
  const has = (c: any, s: string) => (c.matched_skills || []).includes(s);
  const deciding = skills.filter((s) => candidates.some((c) => has(c, s)) && candidates.some((c) => !has(c, s)));
  const lead = Math.round((top.score - second.score) * 10) / 10;
  const uniqueToTop = deciding.filter((s) => has(top, s) && !has(second, s));
  const topGaps: string[] = top.missing_skills || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#02040a]/92 px-5 py-8 text-white backdrop-blur-sm" role="dialog" aria-label="Shortlist Arena">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-4xl font-semibold sm:text-5xl">Shortlist Arena</h2>
            <p className="mt-2 text-white/55">
              {blind ? "Blind mode is on: names are hidden, so this is decided on skills only." : "Head-to-head on the same job description."}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close arena" className="rounded-full border border-white/20 p-3 hover:bg-white hover:text-black">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 grid gap-5" style={{ gridTemplateColumns: `repeat(${sorted.length}, minmax(0, 1fr))` }}>
          {sorted.map((c, i) => (
            <div key={c.name} className={`rounded-3xl border p-6 ${i === 0 ? "border-sky-300/60 bg-sky-300/[0.07]" : "border-white/10 bg-white/[0.04]"}`}>
              {i === 0 && <p className="mb-2 text-sm font-semibold text-sky-200">Top pick</p>}
              <p className="break-all text-xl font-bold">{c.name}</p>
              <p className="mt-3 text-6xl font-semibold text-sky-300">{Math.round(c.score)}<span className="text-2xl text-white/40">%</span></p>
              {[["Keyword", c.keyword_score], ["Meaning", c.semantic_score]].map(([label, v]: any) => (
                <div key={label} className="mt-4">
                  <div className="flex justify-between text-sm text-white/55"><span>{label} match</span><span>{Math.round(v || 0)}%</span></div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-300 to-indigo-400" style={{ width: `${Math.min(v || 0, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-indigo-300/25 bg-indigo-400/[0.07] p-7">
          <h3 className="text-2xl font-semibold text-indigo-200">Who to shortlist</h3>
          <p className="mt-3 text-lg leading-8 text-white/80">
            {lead < 3
              ? `${top.name} and ${second.name} are too close to call on score alone (${lead} points apart). `
              : `${top.name} leads by ${lead} points. `}
            {uniqueToTop.length > 0
              ? `${top.name} covers ${uniqueToTop.length} skill${uniqueToTop.length > 1 ? "s" : ""} that ${second.name} does not: ${uniqueToTop.join(", ")}. `
              : `The two cover the same required skills, so the score gap comes from how closely the resume text matches the role. `}
            {topGaps.length > 0 ? `Ask ${top.name} about: ${topGaps.slice(0, 4).join(", ")}.` : `${top.name} has no missing skills from this job description.`}
          </p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.04]">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/55">
                <th className="p-4 font-semibold">Skill</th>
                {sorted.map((c) => <th key={c.name} className="p-4 text-center font-semibold">{c.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...deciding, ...skills.filter((s) => !deciding.includes(s))].map((s) => (
                <tr key={s} className={`border-b border-white/5 ${deciding.includes(s) ? "bg-amber-300/[0.07]" : ""}`}>
                  <td className="p-4">{s}{deciding.includes(s) && <span className="ml-2 text-sm text-amber-200">decides it</span>}</td>
                  {sorted.map((c) => (
                    <td key={c.name} className={`p-4 text-center text-lg font-bold ${has(c, s) ? "text-sky-300" : "text-white/25"}`}>
                      {has(c, s) ? "Yes" : "No"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
