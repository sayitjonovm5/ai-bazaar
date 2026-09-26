"use client";

import { useState } from "react";
import { getProductLocalImage, getProductOnlineImage } from "@/lib/marketplace-images";

interface MarketplaceImageProps {
  src?: string | null;
  productName: string;
  category?: string;
  alt: string;
  className?: string;
}

export default function MarketplaceImage({
  src,
  productName,
  category,
  alt,
  className = "w-full h-full object-cover",
}: MarketplaceImageProps) {
  // Determine initial image candidate
  const initialCandidate =
    src && src.trim().length > 0
      ? src.trim()
      : getProductLocalImage(productName, category);

  const [imgSrc, setImgSrc] = useState<string>(initialCandidate);
  const [stage, setStage] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const handleError = () => {
    if (stage === 0) {
      // First fallback: try high-resolution online commodity photo from Unsplash
      const onlineFallback = getProductOnlineImage(productName, category);
      if (onlineFallback !== imgSrc) {
        setImgSrc(onlineFallback);
        setStage(1);
        return;
      }
      // If already same, advance to local
      setStage(1);
    }

    if (stage <= 1) {
      // Second fallback: try local commodity photo
      const localFallback = getProductLocalImage(productName, category);
      if (localFallback !== imgSrc) {
        setImgSrc(localFallback);
        setStage(2);
        return;
      }
      setStage(2);
    }

    if (stage <= 2) {
      // Ultimate fallback: universal trade image
      setImgSrc("/images/products/trade.jpg");
      setStage(3);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-100">
      {/* Background shimmer placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
      />
    </div>
  );
}
