import { memo } from "react";
import { Film, Tv, Music, Mic2, Star, Heart, Bookmark, Clock, ArrowRight } from "lucide-react";
import { cn } from "../utils/cn";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { MediaImage } from "./MediaImage";
import type { Review } from "../types";

interface ReviewCardProps {
  review: Review;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onClick: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Movies: "text-coral bg-coral/10 border-coral/20",
  Series: "text-violet bg-violet/10 border-violet/20",
  Songs: "text-teal bg-teal/10 border-teal/20",
  Podcasts: "text-amber-600 bg-amber/10 border-amber/20",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Movies: <Film className="w-3.5 h-3.5" />,
  Series: <Tv className="w-3.5 h-3.5" />,
  Songs: <Music className="w-3.5 h-3.5" />,
  Podcasts: <Mic2 className="w-3.5 h-3.5" />,
};

export const ReviewCard = memo(function ReviewCard({
  review,
  liked,
  saved,
  onLike,
  onSave,
  onClick,
}: ReviewCardProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "group rounded-3xl glass-card overflow-hidden flex flex-col h-full",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDuration: "400ms" }}
    >
      {/* Cover Artwork */}
      <div
        onClick={onClick}
        className="relative h-52 sm:h-56 overflow-hidden cursor-pointer bg-gray-900"
      >
        <MediaImage
          src={review.imageUrl}
          alt={review.title}
          category={review.category}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold border backdrop-blur-sm shadow-md",
              CATEGORY_COLORS[review.category]
            )}
          >
            {CATEGORY_ICONS[review.category]}
            {review.category}
          </span>
        </div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-1.5 sm:gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className={cn(
              "p-2 sm:p-2.5 rounded-full backdrop-blur-sm border transition-all duration-150 active:scale-90 shadow-md",
              liked
                ? "bg-white text-coral border-white"
                : "bg-black/40 text-white border-white/30 hover:bg-black/60"
            )}
            aria-label="Like"
          >
            <Heart className={cn("w-4 h-4 sm:w-[18px] sm:h-[18px]", liked && "fill-current")} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={cn(
              "p-2 sm:p-2.5 rounded-full backdrop-blur-sm border transition-all duration-150 active:scale-90 shadow-md",
              saved
                ? "bg-white text-violet border-white"
                : "bg-black/40 text-white border-white/30 hover:bg-black/60"
            )}
            aria-label="Save"
          >
            <Bookmark className={cn("w-4 h-4 sm:w-[18px] sm:h-[18px]", saved && "fill-current")} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-end text-white drop-shadow-md z-10">
          <div className="min-w-0">
            <div className="text-xs font-medium opacity-90 truncate">{review.creator}</div>
            <div className="text-sm font-semibold flex items-center gap-1.5 truncate text-amber-300">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{review.duration}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-2">
          <h3
            onClick={onClick}
            className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-1 cursor-pointer group-hover:text-coral transition-colors duration-150 min-w-0"
          >
            {review.title}
          </h3>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="flex items-center gap-1 px-1.5 py-1 sm:px-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30" title="Critic rating">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-[11px] sm:text-xs font-bold text-amber-700 dark:text-amber-400">{review.rating}</span>
            </div>
            {review.audienceRating && (
              <div className="flex items-center gap-1 px-1.5 py-1 sm:px-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30" title="Audience rating">
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 fill-blue-500" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>
                <span className="text-[11px] sm:text-xs font-bold text-blue-700 dark:text-blue-400">{review.audienceRating}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 flex-1 font-medium">
          {review.excerpt}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
          {review.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-gray-100 dark:bg-white/10 text-[11px] sm:text-xs font-semibold text-gray-800 dark:text-gray-200 border border-gray-200/80 dark:border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={onClick}
          className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gray-900 hover:bg-coral dark:bg-white/15 dark:text-white dark:hover:bg-coral shadow-sm hover:shadow-md transition-colors duration-150 group/btn"
        >
          Read Review
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-150" />
        </button>
      </div>
    </div>
  );
});

