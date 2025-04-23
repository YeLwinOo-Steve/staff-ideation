"use client";

import { useState } from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  className?: string;
}

export function Avatar({
  src,
  alt,
  fallbackText,
  className = "w-12 h-12",
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className={`${className} rounded-full bg-primary/10 flex items-center justify-center`}
        title={alt}
      >
        <span className="text-primary font-medium text-sm">
          {fallbackText || alt?.substring(0, 2).toUpperCase() || "?"}
        </span>
      </div>
    );
  }

  return (
    <div className={`${className} relative mask mask-squircle overflow-hidden`}>
      <Image
        src={src}
        alt={alt || "Avatar"}
        fill
        className="object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
}
