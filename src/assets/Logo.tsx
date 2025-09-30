export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label="Czech the Crown logo"
      style={{ color: "var(--gold)" }}
    >
      <path d="M4 18h16l-1-9-4 3-3-6-3 6-4-3-1 9zm-1 2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1H3v1z" />
    </svg>
  );
}
