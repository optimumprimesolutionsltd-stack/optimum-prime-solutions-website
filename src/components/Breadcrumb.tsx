import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Auto-generate breadcrumbs from URL path if no items provided
const pathLabelMap: Record<string, string> = {
  '': 'Home',
  'about': 'About',
  'tallyprime': 'TallyPrime Solutions',
  'implementation': 'Implementation',
  'licensing': 'Licensing',
  'cloud-hosting': 'Cloud Hosting',
  'training': 'Training',
  'support': 'Support',
  'customization': 'Customization',
  'data-migration': 'Data Migration',
  'industries': 'Industries',
  'retail': 'Retail',
  'distribution': 'Distribution',
  'manufacturing': 'Manufacturing',
  'construction': 'Construction',
  'hardware': 'Hardware & Wholesale',
  'ngos': 'NGOs',
  'schools': 'Schools',
  'knowledge-hub': 'Knowledge Hub',
  'blog': 'Blog',
  'guides': 'Guides',
  'downloads': 'Downloads',
  'case-studies': 'Case Studies',
  'videos': 'Videos',
  'faq': 'FAQ',
  'pricing': 'Pricing',
  'contact': 'Contact',
  'features': 'TallyPrime Solutions',
  'products': 'Pricing',
  'testimonials': 'Testimonials',
  'why-choose-us': 'Why Choose Us',
};

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

  let accumulated = '';
  segments.forEach((segment, index) => {
    accumulated += `/${segment}`;
    const label = pathLabelMap[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const isLast = index === segments.length - 1;
    crumbs.push({ label, href: isLast ? undefined : accumulated });
  });

  return crumbs;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const location = useLocation();
  const crumbs = items || buildBreadcrumbs(location.pathname);

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/' || crumbs.length <= 1) return null;

  // JSON-LD BreadcrumbList schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href
        ? `https://www.optimumprimesolutions.co.ke${crumb.href}`
        : undefined,
    })),
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Visual Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center gap-1.5 text-sm text-slate-500 flex-wrap ${className}`}
      >
        {crumbs.map((crumb, index) => {
          const isFirst = index === 0;
          const isLast = index === crumbs.length - 1;

          return (
            <span key={index} className="flex items-center gap-1.5">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />}
              {isLast ? (
                <span className="font-medium text-slate-800 truncate max-w-[200px]" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.href || '/'}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="flex items-center gap-1 hover:text-red-600 transition-colors"
                >
                  {isFirst && <Home className="h-3.5 w-3.5" />}
                  <span>{crumb.label}</span>
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
