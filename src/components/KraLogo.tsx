export default function KraLogo({ className = 'h-6 w-6 object-contain' }: { className?: string }) {
  return (
    <img
      src="/itax-logo.png"
      className={className}
      alt="iTax / KRA logo"
      aria-label="iTax logo"
      width={24}
      height={24}
      loading="lazy"
      style={{ display: 'inline-block', filter: 'brightness(0) invert(1)' }}
    />
  );
}
