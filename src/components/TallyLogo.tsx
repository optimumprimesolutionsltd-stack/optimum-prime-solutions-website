interface TallyLogoProps {
  className?: string;
  layout?: 'inline' | 'stacked';
  variant?: 'svg' | 'image' | 'both';
}

export default function TallyLogo({
  className = 'h-10 w-auto',
  layout = 'inline',
  variant = 'svg',
}: TallyLogoProps) {
  const containerClass = layout === 'stacked' ? 'flex flex-col items-start gap-3' : 'inline-flex items-center gap-3';
  const logoClass = className;
  const imageClass = `${logoClass} object-contain`;

  return (
    <span className={containerClass}>
      <svg
        viewBox="0 0 220 40"
        className={logoClass}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="TallyPrime"
      >
        <g>
          <rect x="0" y="0" width="40" height="40" rx="12" fill="#0B4F8A" />
          <rect x="0" y="20" width="20" height="20" fill="#E2A01A" />
          <rect x="20" y="20" width="20" height="20" fill="#2F8DBC" />
          <path d="M 6 8 H 34" stroke="#ffffff" strokeWidth="4" opacity="0.2" />
        </g>
        <text x="50" y="24" fontSize="18" fontWeight="800" fill="#0B4F8A" fontFamily="Inter, system-ui, sans-serif">
          Tally
        </text>
        <text x="50" y="36" fontSize="10" fontWeight="700" fill="#0B4F8A" fontFamily="Inter, system-ui, sans-serif" letterSpacing="0.15em">
          PRIME
        </text>
      </svg>
      {(variant === 'image' || variant === 'both') && (
        <img
          src="/tally-solutions-new-logo.png"
          alt="Tally Solutions logo"
          className={imageClass}
        />
      )}
    </span>
  );
}
