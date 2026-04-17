"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import BookCoverSvg from "@/components/BookCoverSvg";
import { IKImage } from "imagekitio-next";
import config from "@/lib/config";
import Image from "next/image";

type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<BookCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: BookCoverVariant;
  coverColor: string;
  coverImage: string;
}

const BookCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverImage = "https://placehold.co/400x600.png",
}: Props) => {
  const [imgError, setImgError] = useState(false);

  // Check if coverImage is a full URL (http/https) or a path
  const isFullUrl = coverImage.startsWith("http");
  
  // If it's a full URL and not a placeholder, use next/image instead
  if (isFullUrl && !imgError) {
    return (
      <div
        className={cn(
          "relative transition-all duration-300",
          variantStyles[variant],
          className
        )}
      >
        <BookCoverSvg coverColor={coverColor} />
        <div
          className="absolute z-10 overflow-hidden"
          style={{ left: "12%", width: "87.5%", height: "88%" }}
        >
          <Image
            src={coverImage}
            alt="Book cover"
            fill
            className="rounded-sm object-cover"
            onError={() => setImgError(true)}
            unoptimized={coverImage.includes("placeholder")}
          />
        </div>
      </div>
    );
  }

  // Use ImageKit for paths
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <BookCoverSvg coverColor={coverColor} />

      <div
        className="absolute z-10 overflow-hidden"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <IKImage
          path={coverImage}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Book cover"
          fill
          className="rounded-sm object-cover"
          loading="lazy"
          lqip={{ active: true }}
          onError={() => console.error(`Failed to load image: ${coverImage}`)}
        />
      </div>
    </div>
  );
};

export default BookCover;