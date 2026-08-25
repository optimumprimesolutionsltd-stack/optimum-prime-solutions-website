import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  socialDescription?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  breadcrumbs?: { name: string; item: string }[];
  faqs?: { q: string; a: string }[];
  /**
   * Blog/article metadata. When present the page emits BlogPosting structured
   * data crediting the organisation as author and publisher. Dates are plain
   * YYYY-MM-DD strings, matching how posts are stored in siteData/Firebase.
   */
  article?: {
    /**
     * Full, untruncated post title. The `title` prop is shortened to fit the
     * SERP limit, which is the wrong text for a schema headline — pass the
     * real title here.
     */
    headline?: string;
    datePublished: string;
    dateModified?: string;
    section?: string;
    keywords?: string[];
  };
  /**
   * Service-page metadata. Emits a Service node provided by the organisation,
   * so service pages are machine-readable rather than just prose.
   */
  service?: {
    name: string;
    description: string;
    serviceType?: string;
  };
  /**
   * Purchasable licences, emitted as Product nodes with an Offer each. The
   * pricing page already prints these figures as prose, which Google reads as
   * text; competitors selling the same licences through e-commerce product
   * pages get them read as commerce instead. This closes that gap.
   *
   * `price` is the bare number as a string — no currency symbol, no thousands
   * separator, and ex-VAT to match what the page displays.
   */
  products?: {
    name: string;
    description: string;
    price: string;
    priceCurrency?: string;
    brand?: string;
  }[];
}

const BASE_URL = 'https://www.optimumprimesolutions.co.ke';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

// Stable @id anchors. The organisation and website nodes are defined once in
// index.html (which ships with every prerendered page); everything below
// references them by @id so the whole site resolves to a single entity rather
// than a scattering of unlinked blocks.
const ORG_ID = `${BASE_URL}/#organization`;
const SITE_ID = `${BASE_URL}/#website`;

export default function SEO({
  title,
  description,
  socialDescription,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  breadcrumbs,
  faqs,
  article,
  service,
  products,
}: SEOProps) {
  // Append the brand only when there is room for it. Appending
  // unconditionally pushed longer titles past Google's ~60-character display
  // budget, so the headline got cut and the brand survived — exactly backwards.
  // A page that already names the brand is left alone.
  const BRAND_SUFFIX = ' | Optimum Prime Solutions';
  const TITLE_BUDGET = 60;
  const fullTitle = title.includes('Optimum Prime')
    ? title
    : title.length + BRAND_SUFFIX.length <= TITLE_BUDGET
      ? title + BRAND_SUFFIX
      : title;

  const finalSocialDescription = socialDescription || description;

  // Ensure canonical URL has trailing slash for consistency
  const rawCanonical = canonical ? canonical.replace(/\/?$/, '/') : '/';
  const canonicalUrl = `${BASE_URL}${rawCanonical}`;

  const pageId = `${canonicalUrl}#webpage`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;

  // Every page describes itself as a WebPage (or a more specific type) tied
  // back to the site and the organisation.
  const pageNode: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': pageId,
    url: canonicalUrl,
    name: fullTitle,
    description,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-KE',
  };

  const graph: Record<string, unknown>[] = [pageNode];

  if (breadcrumbs && breadcrumbs.length > 0) {
    pageNode.breadcrumb = { '@id': breadcrumbId };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    });
  }

  if (article) {
    graph.push({
      '@type': 'BlogPosting',
      '@id': `${canonicalUrl}#article`,
      headline:
        article.headline || title.replace(/\s*\|\s*Optimum Prime.*$/, ''),
      description,
      url: canonicalUrl,
      mainEntityOfPage: { '@id': pageId },
      isPartOf: { '@id': pageId },
      author: { '@id': ORG_ID },
      publisher: { '@id': ORG_ID },
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      image: ogImage,
      inLanguage: 'en-KE',
      ...(article.section ? { articleSection: article.section } : {}),
      ...(article.keywords && article.keywords.length > 0
        ? { keywords: article.keywords }
        : {}),
    });
  }

  if (service) {
    graph.push({
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      name: service.name,
      description: service.description,
      url: canonicalUrl,
      provider: { '@id': ORG_ID },
      areaServed: { '@type': 'Country', name: 'Kenya' },
      ...(service.serviceType ? { serviceType: service.serviceType } : {}),
    });
  }

  if (products && products.length > 0) {
    products.forEach((p, i) => {
      graph.push({
        '@type': 'Product',
        '@id': `${canonicalUrl}#product-${i + 1}`,
        name: p.name,
        description: p.description,
        category: 'Accounting Software',
        ...(p.brand ? { brand: { '@type': 'Brand', name: p.brand } } : {}),
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: p.priceCurrency || 'KES',
          availability: 'https://schema.org/InStock',
          url: canonicalUrl,
          seller: { '@id': ORG_ID },
        },
      });
    });
  }

  // FAQ answers must also be visible on the page itself — Google discounts
  // FAQPage markup whose Q&A text the user cannot actually read.
  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faq`,
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
    });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalSocialDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_KE" />
      <meta property="og:site_name" content="Optimum Prime Solutions" />

      {/* Article metadata for social/link previews */}
      {article && (
        <meta property="article:published_time" content={article.datePublished} />
      )}
      {article && (
        <meta
          property="article:modified_time"
          content={article.dateModified || article.datePublished}
        />
      )}
      {article && article.section && (
        <meta property="article:section" content={article.section} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalSocialDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Consolidated structured data — one graph per page, all nodes linked
          by @id back to the organisation defined in index.html */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
}
