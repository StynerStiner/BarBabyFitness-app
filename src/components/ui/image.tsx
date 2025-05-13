import { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

export const Image = ({
  src,
  alt,
  width,
  height,
  className,
  style,
  ...props
}: ImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("max-w-full h-auto", className)}
      style={{
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
        ...style,
      }}
      {...props}
    />
  );
};
