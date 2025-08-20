declare module "next/image" {
  import type { ImgHTMLAttributes } from "react";
  import type { FC } from "react";
  interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
    onError?: () => void;
  }
  const Image: FC<ImageProps>;
  export default Image;
}

declare module "next/link" {
  import type { AnchorHTMLAttributes, FC, ReactNode } from "react";
  interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children?: ReactNode;
  }
  const Link: FC<LinkProps>;
  export default Link;
}
