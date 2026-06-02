export default function KraLogo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="KRA logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="30" fill="#083a63" />
      <path d="M16 24h32l-8 24H24l-8-24Z" fill="#f5c518" />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#083a63"
        fontFamily="Inter, sans-serif"
      >
        KRA
      </text>
    </svg>
  );
}
