import { useState, useEffect } from "react";
import type { Category } from "../types";

const CATEGORY_FALLBACKS: Record<string, string> = {
  Movies: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
  Series: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=1000&auto=format&fit=crop",
  Songs: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
  Podcasts: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
  All: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
};

// For YouTube maxresdefault thumbnails, provide an hqdefault fallback
function getYouTubeFallback(url: string): string | null {
  const match = url.match(/i\.ytimg\.com\/vi\/([^/]+)\/maxresdefault\.jpg/);
  if (match) {
    return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

interface MediaImageProps {
  src?: string;
  alt: string;
  category?: Category | string;
  className?: string;
  loading?: "lazy" | "eager";
}

export function MediaImage({
  src,
  alt,
  category = "Movies",
  className = "w-full h-full object-cover",
  loading = "lazy",
}: MediaImageProps) {
  const fallback = CATEGORY_FALLBACKS[category] || CATEGORY_FALLBACKS.Movies;
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setImgSrc(src || fallback);
    setErrorCount(0);
  }, [src, fallback]);

  const handleError = () => {
    if (errorCount === 0) {
      // First failure: try YouTube hqdefault fallback if applicable
      const ytFallback = getYouTubeFallback(imgSrc);
      if (ytFallback) {
        setErrorCount(1);
        setImgSrc(ytFallback);
        return;
      }
    }
    // Final fallback: category placeholder
    if (errorCount < 2) {
      setErrorCount(2);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading={loading}
      referrerPolicy="no-referrer"
    />
  );
}
