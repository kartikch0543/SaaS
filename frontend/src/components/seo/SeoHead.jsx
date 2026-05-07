import { Helmet } from "react-helmet-async";
import { siteConfig } from "../../constants/site";
import { buildCanonical } from "../../utils/seo";

export const SeoHead = ({ title, description, keywords = [], path = "/", schema }) => {
  const canonical = buildCanonical(path);
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const verification = import.meta.env.VITE_SEARCH_CONSOLE_VERIFICATION;

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={[...siteConfig.defaultKeywords, ...keywords].join(", ")} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      {verification ? <meta name="google-site-verification" content={verification} /> : null}
      {schema ? <script type="application/ld+json">{JSON.stringify(schema)}</script> : null}
    </Helmet>
  );
};
