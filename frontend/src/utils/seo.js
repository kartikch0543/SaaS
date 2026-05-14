import { siteConfig } from "../constants/site";

export const buildCanonical = (path = "/") => `${siteConfig.baseUrl}${path}`;

export const buildFaqSchema = (faqs = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
});

export const buildBreadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.item
  }))
});

export const buildArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  dateModified: article.updatedAt,
  mainEntityOfPage: buildCanonical(article.canonicalPath || `/${article.slug}`),
  author: {
    "@type": "Organization",
    name: siteConfig.name
  },
  publisher: {
    "@type": "Organization",
    name: siteConfig.name
  }
});

export const buildCollectionSchema = ({ title, description, path }) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description,
  url: buildCanonical(path)
});
