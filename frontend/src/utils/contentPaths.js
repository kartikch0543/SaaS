export const getContentPath = (post) => post?.canonicalPath || `/${post?.slug || ""}`;

export const normalizeSectionLabel = (section = "") =>
  section
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
