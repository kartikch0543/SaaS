import { Helmet } from "react-helmet-async";
import { siteConfig } from "../../constants/site";
import { buildCanonical } from "../../utils/seo";

export const SeoHead = ({ title, description, keywords = [], path = "/", schema, type = "website", noindex = false }) => {
  const canonical = buildCanonical(path);
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const verification = import.meta.env.VITE_SEARCH_CONSOLE_VERIFICATION;
  const schemas = Array.isArray(schema) ? schema : schema ? [schema] : [];

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={[...siteConfig.defaultKeywords, ...keywords].join(", ")} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large"} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:image" content={siteConfig.ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={siteConfig.ogImage} />
      <meta name="twitter:site" content={siteConfig.twitterHandle} />
      {verification ? <meta name="google-site-verification" content={verification} /> : null}
      {schemas.map((item, index) => (
        <script key={`${path}-schema-${index}`} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  );
};
