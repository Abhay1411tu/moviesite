import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { cn } from "../utils/cn";
import { REVIEWS } from "../data/reviews";
import { MediaImage } from "./MediaImage";
import type { Review } from "../types";

interface HeroCarouselProps {
  search: string;
  setSearch: (s: string) => void;
  onReviewClick: (review: Review) => void;
}

const FEATURED = REVIEWS.slice(0, 5);

export function HeroCarousel({ search, setSearch, onReviewClick }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % FEATURED.length);
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + FEATURED.length) % FEATURED.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const active = FEATURED[current];

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gray-950">
      <div className="absolute inset-0 z-0">
        <MediaImage
          src={active.imageUrl}
          alt={active.title}
          category={active.category}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/40" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-6">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="text-sm font-semibold">Featured Review</span>
            </div>

            <div className="min-h-[180px]">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-tight drop-shadow-md">
                {active.title}
              </h1>
              <p className="text-lg text-white/90 leading-relaxed mb-2 font-medium">"{active.excerpt}"</p>
              <p className="text-white/70 font-semibold">
                {active.creator} • {active.category} • {active.year}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              <button
                onClick={() => onReviewClick(active)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-colors shadow-lg"
              >
                <Play className="w-4 h-4 fill-gray-900" />
                Read Full Review
              </button>
              <button
                onClick={() => setSearch(active.category)}
                className="px-6 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/25 transition-colors"
              >
                Browse {active.category}
              </button>
            </div>
          </div>

          {/* Right search panel */}
          <div className="glass-strong rounded-3xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Find your next favorite
            </h2>
            <p className="text-gray-700 dark:text-gray-200 font-medium mb-6">
              Search across 12,000+ reviews for movies, series, songs, and podcasts.
            </p>

            <div className="relative mb-6">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search anything..."
                className="w-full px-5 py-4 rounded-2xl glass-input text-gray-950 font-bold placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-400"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {["Dune: Part Two", "The Bear", "Espresso", "Severance"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearch(term)}
                  className="px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-gray-100 transition-colors shadow-xs"
                >
                  {term}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "12K+", label: "Reviews" },
                { value: "4.9", label: "Avg Rating" },
                { value: "50+", label: "Curators" },
              ].map((stat) => (
                <div key={stat.label} className="glass rounded-2xl p-3 text-center border-gray-200/80">
                  <div className="text-xl font-extrabold text-gray-950 dark:text-gray-100">{stat.value}</div>
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={prev}
            className="p-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {FEATURED.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === current ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
