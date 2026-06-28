import type { CSSProperties, ImgHTMLAttributes } from "react";

type StaticImageData = {
  src: string;
  width?: number;
  height?: number;
};

type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  objectFit?: CSSProperties["objectFit"];
  priority?: boolean;
  quality?: number;
};

export default function Image({
  src,
  alt,
  fill,
  objectFit,
  priority: _priority,
  quality: _quality,
  style,
  ...props
}: NextImageProps) {
  const resolvedSrc = typeof src === "string" ? src : src.src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      style={
        fill
          ? {
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
              objectFit: objectFit ?? "cover",
              ...style,
            }
          : style
      }
      {...props}
    />
  );
}
