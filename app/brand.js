// Shared SahiFayda brand mark (owner-supplied SF monogram) and wordmark.
// Plain component without hooks so server-rendered pages and client pages can both use it.
export default function BrandLogo({ href = '/', size = 36, className = 'brand-logo', label = 'SahiFayda home' }) {
  return (
    <a className={className} href={href} aria-label={label} translate="no">
      <img src="/brand/sahifayda-mark.png" width={size} height={size} alt="" />
      <span className="brand-word">Sahi<b>Fayda</b></span>
    </a>
  );
}
