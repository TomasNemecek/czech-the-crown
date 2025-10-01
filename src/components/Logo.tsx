export function Logo({ size = 28 }: { size?: number }) {
  return (
    <img
      src="/logo.svg"
      width={size}
      height={size}
      alt="Czech the Crown logo"
      style={{ color: "var(--gold)" }}
    />
  );
}
