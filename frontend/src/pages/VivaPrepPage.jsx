import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../api/client";
import { Button } from "../components/common/Button";
import { SeoHead } from "../components/seo/SeoHead";

export const VivaPrepPage = () => {
  const [subject, setSubject] = useState("dbms");
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/api/ai/viva", { subject, level: "intermediate" });
      return response.data.items;
    }
  });

  return (
    <>
      <SeoHead
        title="AI Viva Preparation"
        description="Generate subject-based viva questions and concise answer prompts for exam revision."
        path="/viva-prep"
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold text-ink">Generate focused viva practice in seconds</h1>
          <p className="mt-4 text-slate-700">
            Choose a subject, generate high-yield prompts, and convert last-minute revision into active recall.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <select
            className="rounded-full border border-slate-200 bg-white/80 px-5 py-3"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            <option value="dbms">DBMS</option>
            <option value="oops">OOPS</option>
            <option value="cn">Computer Networks</option>
            <option value="os">Operating Systems</option>
          </select>
          <Button onClick={() => mutation.mutate()}>{mutation.isPending ? "Generating..." : "Generate viva pack"}</Button>
        </div>
        <div className="mt-10 grid gap-5">
          {mutation.data?.map((item) => (
            <article key={item.id} className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-glass">
              <h2 className="font-semibold text-ink">{item.question}</h2>
              <p className="mt-2 text-slate-700">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
