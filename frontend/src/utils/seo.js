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
