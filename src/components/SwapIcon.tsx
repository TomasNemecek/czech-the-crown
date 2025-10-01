import type { ImgHTMLAttributes } from "react";

export function SwapIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src="/swap-icon.svg"
      width="16"
      height="16"
      alt="Swap currencies"
      {...props}
    />
  );
}
