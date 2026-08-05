import { Trophy, Star, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { LEADERBOARD, REVIEWS } from "../data/reviews";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { MediaImage } from "./MediaImage";
import type { Review } from "../types";

interface LeaderboardProps {
  onRankingsOpen: () => void;
  onReviewClick?: (review: Review) => void;
}

export function Leaderboard({ onRankingsOpen, onReviewClick }: LeaderboardProps) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Weekly <span className="text-gradient">Leaderboard</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The most discussed, rated, and loved titles this week across all categories.
          </p>
        </div>

        <div
          className={cn(
            "max-w-4xl mx-auto glass-strong rounded-3xl p-3 sm:p-5 transition-all duration-700 shadow-2xl border border-white/40 dark:border-white/10",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {LEADERBOARD.map((item, index) => {
            const matchedReview = REVIEWS.find((r) => r.title === item.title);
            const rankGradients = [
              "from-amber-300 via-amber-500 to-yellow-600 text-white shadow-amber-500/40",
              "from-slate-200 via-slate-400 to-slate-500 text-slate-950 shadow-slate-400/40",
              "from-amber-600 via-orange-500 to-amber-800 text-white shadow-orange-500/40",
            ];
            const isTopThree = index < 3;

            return (
              <div
                key={item.title}
                onClick={() => matchedReview && onReviewClick?.(matchedReview)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-2 py-2 rounded-xl transition-all duration-200 cursor-pointer group hover:bg-white/70 dark:hover:bg-white/10",
                  index !== LEADERBOARD.length - 1 && "border-b border-gray-200/50 dark:border-white/8"
                )}
              >
                {/* Compact Rank Badge */}
                <div
                  className={cn(
                    "flex items-center justify-center h-9 w-9 rounded-xl font-black text-sm flex-shrink-0 shadow-md transition-transform group-hover:scale-105",
                    isTopThree
                      ? `bg-gradient-to-br ${rankGradients[index]}`
                      : "bg-gray-800 dark:bg-white/10 text-white dark:text-gray-100 border border-gray-600/40 dark:border-white/20"
                  )}
                >
                  {isTopThree && index === 0 ? (
                    <Trophy className="w-4 h-4 text-amber-200" />
                  ) : (
                    <span className="leading-none">{item.rank}</span>
                  )}
                </div>

                {/* Compact Poster */}
                <div className="h-12 w-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-white/30 dark:border-white/15 shadow-sm group-hover:scale-105 transition-transform relative">
                  <MediaImage
                    src={matchedReview?.imageUrl}
                    alt={item.title}
                    category={item.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Meta */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-950 dark:text-white truncate text-sm group-hover:text-coral transition-colors leading-tight">
                    {item.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-1.5 py-px rounded text-[9px] font-black uppercase tracking-wider bg-coral/10 text-coral border border-coral/20">
                      {item.category}
                    </span>
                    {matchedReview?.year && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{matchedReview.year}</span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black">{item.rating.toFixed(1)}</span>
                </div>

                {/* Trend indicator */}
                <div
                  className={cn(
                    "flex items-center justify-center w-7 h-7 rounded-lg",
                    item.change === "up" && "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
                    item.change === "down" && "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400",
                    item.change === "same" && "text-gray-400 bg-gray-100 dark:bg-white/8"
                  )}
                >
                  {item.change === "up" ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : item.change === "down" ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <Minus className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={onRankingsOpen}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-extrabold text-white dark:text-gray-900 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-md active:scale-[0.99]"
          >
            View Full 2026 Rankings
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
