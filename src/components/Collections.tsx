import { useRef, useMemo } from "react";
import { ArrowRight, Film, Tv, Music, Mic2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { COLLECTIONS, REVIEWS } from "../data/reviews";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { MediaImage } from "./MediaImage";
import type { Review, EditorialCollection } from "../types";

interface CollectionsProps {
  onReviewClick: (review: Review) => void;
  onViewAllCollections?: () => void;
}

const CATEGORY_MAP: Record<number, string> = {
  1: "Movies",
  2: "Series",
  3: "Songs",
  4: "Podcasts",
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Movies: <Film className="w-5 h-5" />,
  Series: <Tv className="w-5 h-5" />,
  Songs: <Music className="w-5 h-5" />,
  Podcasts: <Mic2 className="w-5 h-5" />,
};

const COLLECTION_ICON_STYLES: Record<string, string> = {
  "from-coral to-rose-400": "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/30",
  "from-rose-400 to-orange-400": "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/30",
  "from-violet to-purple-500": "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/30",
  "from-teal to-cyan-500": "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/30",
};

// Aspect ratios matched per category for a 100% perfect fit
const CATEGORY_ASPECT_RATIOS: Record<string, string> = {
  Movies: "aspect-[3/4]",
  Series: "aspect-[3/4]",
  Songs: "aspect-square",
  Podcasts: "aspect-square",
};

function CollectionRow({
  collection,
  index,
  visible,
  onReviewClick,
}: {
  collection: EditorialCollection;
  index: number;
  visible: boolean;
  onReviewClick: (review: Review) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const primaryCategory = CATEGORY_MAP[collection.id] || "Movies";
  const boxAspectClass = CATEGORY_ASPECT_RATIOS[primaryCategory] || "aspect-[3/4]";

  // Prioritize curated collection items first, then append all other items from the same category
  const reviews = useMemo(() => {
    const curated = REVIEWS.filter((r) => collection.reviewIds.includes(r.id));
    const others = REVIEWS.filter(
      (r) => r.category === primaryCategory && !collection.reviewIds.includes(r.id)
    );
    return [...curated, ...others];
  }, [collection, primaryCategory]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "rounded-3xl glass-card p-6 sm:p-7 transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Row Header with Left/Right Scroll Control Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl border shadow-xs flex-shrink-0",
              COLLECTION_ICON_STYLES[collection.gradient] ||
                "bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-200 border-white/60 dark:border-white/10"
            )}
          >
            {CATEGORY_ICONS[primaryCategory]}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-950 dark:text-gray-100">
              {collection.title}
            </h3>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {collection.subtitle} •{" "}
              <span className="text-coral font-extrabold">{reviews.length} items</span>
            </p>
          </div>
        </div>

        {/* Scroll Left & Right Navigation Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => handleScroll("left")}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 hover:text-coral border border-gray-200/80 dark:border-white/10 transition-all shadow-xs active:scale-95"
            aria-label="Scroll left"
            title="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="p-2.5 rounded-xl bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 hover:text-coral border border-gray-200/80 dark:border-white/10 transition-all shadow-xs active:scale-95"
            aria-label="Scroll right"
            title="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none scroll-smooth pb-2 pt-1 -mx-1 px-1 snap-x snap-mandatory"
      >
        {reviews.map((review) => (
          <button
            key={review.id}
            onClick={() => onReviewClick(review)}
            className="text-left group flex flex-col w-44 sm:w-56 flex-shrink-0 snap-start"
          >
            {/* Image Container with category-matched box aspect ratio */}
            <div
              className={cn(
                "w-full rounded-2xl mb-3 overflow-hidden relative shadow-md bg-gray-950 border border-gray-200/80 dark:border-white/10 flex-shrink-0",
                boxAspectClass
              )}
            >
              <MediaImage
                src={review.imageUrl}
                alt={review.title}
                category={review.category}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20 flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                {review.rating}
              </div>

              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-white text-[11px] font-bold border border-white/30 tracking-wide">
                {review.category}
              </div>
            </div>

            <h4 className="font-bold text-gray-950 dark:text-gray-100 text-sm sm:text-base line-clamp-1 group-hover:text-coral transition-colors">
              {review.title}
            </h4>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-400 truncate">
              {review.creator}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Collections({ onReviewClick, onViewAllCollections }: CollectionsProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Editorial <span className="text-gradient">Collections</span>
            </h2>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Hand-picked lists from our critics — scroll left and right to explore all titles.
            </p>
          </div>
          <button
            onClick={onViewAllCollections}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-extrabold text-sm transition-colors shadow-md active:scale-95"
          >
            View all collections
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-8">
          {COLLECTIONS.map((collection, index) => (
            <CollectionRow
              key={collection.id}
              collection={collection}
              index={index}
              visible={visible}
              onReviewClick={onReviewClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
