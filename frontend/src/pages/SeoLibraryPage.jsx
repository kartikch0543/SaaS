import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { SeoHead } from "../components/seo/SeoHead";

export const SeoLibraryPage = () => {
  const { data } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => (await apiClient.get("/api/blogs")).data.items
  });

  return (
    <>
      <SeoHead
        title="SEO Study Library"
        description="Explore non-branded study content optimized for long-tail educational search intent."
        path="/seo-library"
      />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-bold text-ink">Long-tail content built for real student search intent</h1>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {data?.map((post) => (
            <Link
              key={post.slug}
              to={`/${post.slug}`}
              className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-glass transition hover:-translate-y-1"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pine">{post.intent}</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink">{post.title}</h2>
              <p className="mt-3 text-slate-700">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};
