"use client";

import { useState } from "react";

type Props = { skills: string[]; evidence?: Record<string, string[]> };

// Wraps the skill name inside a resume line so the proof stands out
function Marked({ line, skill }: { line: string; skill: string }) {
  const parts = line.split(new RegExp(`(${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "i"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === skill.toLowerCase() ? (
          <mark key={i} className="rounded bg-sky-300/30 px-1 text-sky-50">{p}</mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

export default function EvidenceChips({ skills, evidence }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const lines = open ? evidence?.[open] : undefined;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => {
          const proof = !!evidence?.[s]?.length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => proof && setOpen(open === s ? null : s)}
              aria-pressed={open === s}
              className={`rounded-full px-4 py-1.5 text-sm ring-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300 ${
                open === s ? "bg-sky-300 text-black ring-sky-300" : "bg-sky-300/10 text-sky-100 ring-sky-300/30"
              } ${proof ? "cursor-pointer" : "cursor-default"}`}
            >
              {s}
            </button>
          );
        })}
      </div>
      {skills.length > 0 && !open && <p className="mt-3 text-sm text-white/40">Click a skill to see the line in the resume that proves it.</p>}
      {open && lines && (
        <div className="mt-4 rounded-2xl border border-sky-300/25 bg-sky-300/[0.06] p-4">
          <p className="font-semibold text-sky-200">Where {open} appears in the resume</p>
          <ul className="mt-2 space-y-2 leading-7 text-white/75">
            {lines.map((l, i) => (
              <li key={i}>&ldquo;<Marked line={l} skill={open} />&rdquo;</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
