import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  type?: string;
  noindex?: boolean;
}

const BASE_URL = "https://cloud.afuchat.com";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-preview.png`;
const SITE_NAME = "AfuCloud";

const SEO = ({
  title,
  description,
  keywords = "AfuCloud, afuchat, cloud storage, file hosting, developer API, upload files, public links, file sharing, cloud platform, afuchat cloud, afu cloud, file storage API, developer cloud storage",
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  type = "website",
  noindex = false,
}: SEOProps) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical || (typeof window !== "undefined" ? `${BASE_URL}${window.location.pathname}` : BASE_URL);

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("author", "AfuCloud");
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // Open Graph
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:image", ogImage, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:type", type, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:locale", "en_US", "property");

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);
    setMeta("twitter:site", "@afuchat");

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);

    return () => {
      document.title = "AfuCloud – Developer Cloud Storage";
    };
  }, [fullTitle, description, keywords, canonicalUrl, ogImage, type, noindex]);

  return null;
};

export default SEO;
