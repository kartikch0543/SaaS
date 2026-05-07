import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/client";
import { SeoHead } from "../components/seo/SeoHead";
import { siteConfig } from "../constants/site";
import { buildFaqSchema } from "../utils/seo";

export const ArticlePage = () => {
  const { slug } = useParams();
  const postQuery = useQuery({
    queryKey: ["post", slug],
    queryFn: async () => (await apiClient.get(`/api/blogs/${slug}`)).data,
    retry: false
  });
  const { data: posts } = useQuery({
    queryKey: ["post-list"],
    queryFn: async () => (await apiClient.get("/api/blogs")).data.items
  });

  if (postQuery.isLoading) {
    return (
      <section className="section-shell py-16">
        <div className="surface-card p-8">
          <h1 className="font-display text-3xl font-semibold text-fg">Loading article...</h1>
          <p className="mt-4 text-muted">Fetching the latest StudyForge guide.</p>
        </div>
      </section>
    );
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <section className="section-shell py-16">
        <div className="surface-card p-8">
          <h1 className="font-display text-3xl font-semibold text-fg">Guide not found</h1>
          <p className="mt-4 text-muted">This page may have moved, or the slug is not part of the published study library.</p>
        </div>
      </section>
    );
  }

  const data = postQuery.data;
  const relatedPosts = posts?.filter((post) => data.relatedSlugs?.includes(post.slug)) || [];
  const schemas = [
    buildFaqSchema(data.faqs),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.baseUrl },
        { "@type": "ListItem", position: 2, name: data.title, item: `${siteConfig.baseUrl}/${data.slug}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.description,
      dateModified: data.updatedAt,
      mainEntityOfPage: `${siteConfig.baseUrl}/${data.slug}`
    }
  ];

  return (
    <>
      <SeoHead
        title={data.title}
        description={data.description}
        keywords={data.keywords}
        path={`/${data.slug}`}
        schema={schemas}
      />
      <article className="section-shell py-16">
        <nav aria-label="Breadcrumb" className="text-sm text-soft">
          <Link to="/" className="hover:text-accent">
            Home
          </Link>
          <span className="px-2">/</span>
          <span className="text-muted">{data.title}</span>
        </nav>
        <div className="mt-6 grid gap-10 lg:grid-cols-[0.72fr_0.28fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent2">{data.category}</p>
            <h1 className="mt-4 font-display text-5xl font-bold text-fg">{data.title}</h1>
            <p className="mt-5 text-lg text-muted">{data.description}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-soft">
              <span className="rounded-full bg-surface px-4 py-2">{data.intent}</span>
              <span className="rounded-full bg-surface px-4 py-2">{data.heroStat}</span>
            </div>
            <div className="article-prose surface-card mt-8 p-8">
              {data.intro?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {data.sections?.map((section) => (
                <section key={section.heading} id={section.id}>
                  <h2>{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.points?.length ? (
                    <ul>
                      {section.points.map((point) => (
                        <li key={point}>- {point}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
          <aside className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="font-display text-xl font-semibold text-fg">Table of contents</h2>
              <div className="mt-4 space-y-3 text-sm text-muted">
                {data.sections?.map((section) => (
                  <a key={section.id} href={`#${section.id}`} className="block hover:text-accent">
                    {section.heading}
                  </a>
                ))}
              </div>
            </div>
            <div className="surface-card p-6">
              <h2 className="font-display text-xl font-semibold text-fg">Related reading</h2>
              <div className="mt-4 space-y-3 text-sm text-muted">
                {relatedPosts.map((post) => (
                  <Link key={post.slug} to={`/${post.slug}`} className="block hover:text-accent">
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
        <section className="surface-card mt-10 p-8">
          <h2 className="font-display text-3xl font-semibold text-fg">FAQ</h2>
          <div className="mt-6 space-y-5">
            {data.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-fg">{faq.question}</h3>
                <p className="mt-2 text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </>
  );
};
