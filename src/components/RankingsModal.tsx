import { useState, useMemo } from "react";
import {
  X,
  Trophy,
  Star,
  Search,
  Film,
  Tv,
  Music,
  Mic2,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  Bookmark,
  ExternalLink,
  Award,
  Sparkles,
  Filter,
} from "lucide-react";
import { cn } from "../utils/cn";
import { MediaImage } from "./MediaImage";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import type { Review, Category } from "../types";

interface RankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  onReviewClick: (review: Review) => void;
  likedIds: Set<number>;
  savedIds: Set<number>;
  onToggleLike: (id: number) => void;
  onToggleSave: (id: number) => void;
}

type SortOption = "popcritic" | "audience" | "year" | "title";

export function RankingsModal({
  isOpen,
  onClose,
  reviews,
  onReviewClick,
  likedIds,
  savedIds,
  onToggleLike,
  onToggleSave,
}: RankingsModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popcritic");
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedTag, setSelectedTag] = useState<string>("All");

  useLockBodyScroll(isOpen);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach((r) => r.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [reviews]);

  // Compute filtered & ranked list
  const rankedItems = useMemo(() => {
    let result = [...reviews];

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.creator.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Min Rating
    if (minRating > 0) {
      result = result.filter((r) => r.rating >= minRating);
    }

    // Filter by Tag
    if (selectedTag !== "All") {
      result = result.filter((r) => r.tags.includes(selectedTag));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "popcritic") {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return (b.audienceRating || 0) - (a.audienceRating || 0);
      }
      if (sortBy === "audience") {
        const scoreB = b.audienceRating || b.rating;
        const scoreA = a.audienceRating || a.rating;
        return scoreB - scoreA;
      }
      if (sortBy === "year") {
        return b.year - a.year;
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [reviews, selectedCategory, searchQuery, sortBy, minRating, selectedTag]);

  // Global Category Stats
  const categoryStats = useMemo(() => {
    const counts = { Movies: 0, Series: 0, Songs: 0, Podcasts: 0 };
    reviews.forEach((r) => {
      if (r.category in counts) {
        counts[r.category as keyof typeof counts]++;
      }
    });
    return counts;
  }, [reviews]);

  if (!isOpen) return null;

  const categoryIcons: Record<string, React.ReactNode> = {
    All: <Sparkles className="w-4 h-4" />,
    Movies: <Film className="w-4 h-4" />,
    Series: <Tv className="w-4 h-4" />,
    Songs: <Music className="w-4 h-4" />,
    Podcasts: <Mic2 className="w-4 h-4" />,
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 modal-overlay modal-overlay-animate bg-black/50 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-7xl h-[94vh] flex flex-col rounded-3xl glass-strong shadow-2xl modal-animate border border-white/30 dark:border-white/10 overscroll-contain overflow-hidden bg-gray-50/95 dark:bg-gray-900/95 text-gray-900 dark:text-gray-100">
        {/* Modal Header */}
        <div className="flex-none p-5 sm:p-7 border-b border-gray-200/80 dark:border-white/10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1.5 shadow-sm">
                  <Trophy className="w-3.5 h-3.5" /> Official 2026 Rankings
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {reviews.length} Verified Titles
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 dark:text-white tracking-tight">
                Global Media <span className="text-gradient">Leaderboards</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
                Explore real-time rankings of top-rated Movies, Series, Songs & Podcasts curated by critic scores & audience reviews.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors shadow-sm"
              aria-label="Close Rankings"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            <div className="glass p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <Film className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Movies</div>
                <div className="text-sm font-extrabold">{categoryStats.Movies} Ranked</div>
              </div>
            </div>
            <div className="glass p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Tv className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">TV Series</div>
                <div className="text-sm font-extrabold">{categoryStats.Series} Ranked</div>
              </div>
            </div>
            <div className="glass p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Songs</div>
                <div className="text-sm font-extrabold">{categoryStats.Songs} Ranked</div>
              </div>
            </div>
            <div className="glass p-3 rounded-2xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500">
                <Mic2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold">Podcasts</div>
                <div className="text-sm font-extrabold">{categoryStats.Podcasts} Ranked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex-none p-4 sm:p-5 border-b border-gray-200/60 dark:border-white/10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(["All", "Movies", "Series", "Songs", "Podcasts"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs",
                    selectedCategory === cat
                      ? "bg-gradient-to-r from-coral to-pink-500 text-white shadow-md"
                      : "bg-white/80 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20 border border-gray-200/60 dark:border-white/10"
                  )}
                >
                  {categoryIcons[cat]}
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Search Controls */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rankings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm glass-input text-gray-900 dark:text-gray-100"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold glass-input text-gray-900 dark:text-gray-100 cursor-pointer"
              >
                <option value="popcritic" className="bg-gray-900 text-white">⭐ PopCritic Rating</option>
                <option value="audience" className="bg-gray-900 text-white">👥 Audience Score</option>
                <option value="year" className="bg-gray-900 text-white">📅 Release Year</option>
                <option value="title" className="bg-gray-900 text-white">🔤 Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Tags & Rating Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Minimum Rating:
            </span>
            {[0, 4.0, 4.5, 4.7, 4.8].map((score) => (
              <button
                key={score}
                onClick={() => setMinRating(score)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-bold transition-all",
                  minRating === score
                    ? "bg-amber-400 text-gray-950 font-black shadow-xs"
                    : "bg-gray-200/70 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/20"
                )}
              >
                {score === 0 ? "All Scores" : `${score}+ ⭐`}
              </button>
            ))}

            {allTags.length > 0 && (
              <div className="ml-auto flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedTag("All")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap",
                    selectedTag === "All"
                      ? "bg-violet text-white"
                      : "bg-gray-200/70 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                  )}
                >
                  All Genres
                </button>
                {allTags.slice(0, 10).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTag(t)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg font-bold transition-all whitespace-nowrap",
                      selectedTag === t
                        ? "bg-violet text-white"
                        : "bg-gray-200/70 dark:bg-white/10 text-gray-600 dark:text-gray-400 hover:bg-gray-300"
                    )}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Rankings List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1.5 overscroll-contain">
          {rankedItems.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center my-8">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">No rankings match your filter</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try resetting search keywords or minimum rating filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setMinRating(0);
                  setSelectedCategory("All");
                  setSelectedTag("All");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-coral text-white text-xs font-bold shadow-md hover:bg-rose-600 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            rankedItems.map((item, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const rankGradients = [
                "from-amber-300 via-amber-500 to-yellow-600 text-white",
                "from-slate-100 via-slate-300 to-slate-400 text-slate-950",
                "from-orange-400 via-amber-600 to-orange-700 text-white",
              ];

              const isLiked = likedIds.has(item.id);
              const isSaved = savedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "group relative flex items-center gap-2 sm:gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-800/60 border cursor-pointer",
                    rank === 1
                      ? "border-amber-400/50 bg-amber-500/5"
                      : rank === 2
                      ? "border-slate-300/40 bg-slate-400/5"
                      : rank === 3
                      ? "border-orange-400/40 bg-orange-500/5"
                      : "border-white/30 dark:border-white/8"
                  )}
                >
                  {/* Compact Rank Badge */}
                  <div
                    className={cn(
                      "flex items-center justify-center h-10 w-10 rounded-xl font-black text-sm flex-shrink-0 shadow-md transition-transform group-hover:scale-105",
                      isTop3
                        ? `bg-gradient-to-br ${rankGradients[rank - 1]}`
                        : "bg-gray-900 dark:bg-white/10 text-white dark:text-gray-100 border border-gray-600/30 dark:border-white/20"
                    )}
                  >
                    {rank === 1 ? (
                      <Trophy className="w-4 h-4 text-amber-200" />
                    ) : (
                      <span className="leading-none">{rank}</span>
                    )}
                  </div>

                  {/* Poster */}
                  <div
                    onClick={() => onReviewClick(item)}
                    className="h-14 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-white/30 dark:border-white/15 shadow-sm group-hover:scale-105 transition-transform relative"
                  >
                    <MediaImage
                      src={item.imageUrl}
                      alt={item.title}
                      category={item.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Title & Info */}
                  <div className="flex-1 min-w-0" onClick={() => onReviewClick(item)}>
                    <div className="font-bold text-gray-950 dark:text-white text-sm truncate group-hover:text-coral transition-colors leading-tight">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="px-1.5 py-px rounded text-[9px] font-black uppercase tracking-wider bg-coral/10 text-coral border border-coral/20">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{item.year}</span>
                      {item.creator && (
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{item.creator}</span>
                      )}
                    </div>
                  </div>

                  {/* Score + Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-300">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black">{item.rating.toFixed(1)}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleLike(item.id); }}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        isLiked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"
                      )}
                      aria-label="Like title"
                    >
                      <Heart className={cn("w-3.5 h-3.5", isLiked && "fill-rose-500")} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleSave(item.id); }}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        isSaved ? "text-amber-500" : "text-gray-400 hover:text-amber-400"
                      )}
                      aria-label="Save to watchlist"
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-amber-500")} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>


      </div>
    </div>
  );
}
