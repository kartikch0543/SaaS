import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import apiClient from "../api/client";
import { SeoHead } from "../components/seo/SeoHead";
import { buildFaqSchema } from "../utils/seo";

export const ArticlePage = () => {
  const { slug } = useParams();
  const { data } = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => (await apiClient.get(`/api/blogs/${slug}`)).data
  });

  if (!data) {
    return null;
  }

  return (
    <>
      <SeoHead
        title={data.title}
        description={data.description}
        keywords={data.keywords}
        path={`/${data.slug}`}
        schema={buildFaqSchema(data.faqs)}
      />
      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pine">{data.category}</p>
        <h1 className="mt-4 font-display text-5xl font-bold text-ink">{data.title}</h1>
        <p className="mt-5 text-lg text-slate-700">{data.description}</p>
        <div className="mt-8 rounded-3xl bg-white/85 p-8 shadow-glass">
          {data.content.map((paragraph) => (
            <p key={paragraph} className="mb-4 leading-8 text-slate-700">
              {paragraph}
            </p>
          ))}
        </div>
        <section className="mt-10 rounded-3xl bg-white/85 p-8 shadow-glass">
          <h2 className="font-display text-3xl font-semibold text-ink">FAQ</h2>
          <div className="mt-6 space-y-5">
            {data.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-ink">{faq.question}</h3>
                <p className="mt-2 text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
};
