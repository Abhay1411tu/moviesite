import { Trophy, Star, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { LEADERBOARD, REVIEWS } from "../data/reviews";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { MediaImage } from "./MediaImage";

export function Leaderboard() {
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
            "max-w-3xl mx-auto glass-strong rounded-3xl p-3 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {LEADERBOARD.map((item, index) => {
            const matchedReview = REVIEWS.find((r) => r.title === item.title);
            const rankColors = [
              "from-amber-400 to-yellow-500",
              "from-slate-300 to-slate-400",
              "from-orange-400 to-amber-600",
            ];
            const isTopThree = index < 3;

            return (
              <div
                key={item.title}
                className={cn(
                  "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-colors",
                  index !== LEADERBOARD.length - 1 && "border-b border-gray-200/50 dark:border-white/10",
                  "hover:bg-white/50 dark:hover:bg-white/10"
                )}
              >
                {/* Rank number badge */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm flex-shrink-0 shadow-xs",
                    isTopThree
                      ? `bg-gradient-to-br text-white shadow-md ${rankColors[index]}`
                      : "bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-gray-100 border border-gray-200/80 dark:border-white/10 font-extrabold"
                  )}
                >
                  {isTopThree && index === 0 ? (
                    <Trophy className="w-4 h-4" />
                  ) : (
                    item.rank
                  )}
                </div>

                {/* Media Image Poster Thumbnail */}
                <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-gray-200 dark:border-white/10 shadow-xs">
                  <MediaImage
                    src={matchedReview?.imageUrl}
                    alt={item.title}
                    category={item.category}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Creator */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-950 dark:text-gray-100 truncate text-sm sm:text-base">{item.title}</div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.category}</div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                  <span className="font-extrabold text-gray-950 dark:text-gray-100">{item.reviews.toLocaleString()}</span>
                  {" "}reviews
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-amber-700 dark:text-amber-400">{item.rating}</span>
                </div>

                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg",
                    item.change === "up" && "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
                    item.change === "down" && "text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400",
                    item.change === "same" && "text-gray-500 bg-gray-100 dark:bg-white/10 dark:text-gray-400"
                  )}
                >
                  {item.change === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : item.change === "down" ? (
                    <TrendingDown className="w-4 h-4" />
                  ) : (
                    <Minus className="w-4 h-4" />
                  )}
                </div>
              </div>
            );
          })}

          <button className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
            View Full Rankings
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
