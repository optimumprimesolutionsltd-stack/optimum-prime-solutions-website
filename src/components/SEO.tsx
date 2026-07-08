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
}

const BASE_URL = 'https://www.optimumprimesolutions.co.ke';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export default function SEO({
  title,
  description,
  socialDescription,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  breadcrumbs,
}: SEOProps) {
  const fullTitle = title.includes('Optimum Prime')
    ? title
    : `${title} | Optimum Prime Solutions`;
  
  const finalSocialDescription = socialDescription || description;

  // Ensure canonical URL has trailing slash for consistency
  const rawCanonical = canonical ? canonical.replace(/\/?$/, '/') : '/';
  const canonicalUrl = `${BASE_URL}${rawCanonical}`;

  // Generate breadcrumb JSON-LD if provided
  const breadcrumbJsonLd = breadcrumbs && breadcrumbs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      }
    : null;

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

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalSocialDescription} />
      <meta name="twitter:image" content={ogImage} />

      {/* Breadcrumb structured data */}
      {breadcrumbJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      )}
    </Helmet>
  );
}
