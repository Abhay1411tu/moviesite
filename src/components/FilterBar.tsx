import { Star, X } from "lucide-react";
import { cn } from "../utils/cn";
import { YEARS, PLATFORMS, GENRES } from "../data/reviews";
import type { FilterState, Category, SortOption } from "../types";

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const CATEGORY_OPTIONS: { label: Category; color: string }[] = [
  { label: "All", color: "from-gray-400 to-gray-600" },
  { label: "Movies", color: "from-coral to-rose-500" },
  { label: "Series", color: "from-violet to-purple-600" },
  { label: "Songs", color: "from-teal to-cyan-600" },
  { label: "Podcasts", color: "from-amber-400 to-orange-500" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "highest", label: "Highest Rated" },
  { value: "trending", label: "Trending" },
  { value: "discussed", label: "Most Discussed" },
];

export function FilterBar({ filters, setFilters }: FilterBarProps) {
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const activeCount = [
    filters.year !== "All",
    filters.genre !== "All",
    filters.platform !== "All",
    filters.minRating > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilters((f) => ({
      ...f,
      year: "All",
      genre: "All",
      platform: "All",
      minRating: 0,
    }));
  };

  return (
    <div className="glass rounded-2xl p-4 mb-8">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_OPTIONS.map((cat) => {
          const isActive = filters.category === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => update("category", cat.label)}
              className={cn(
                "relative px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all border overflow-hidden shadow-xs",
                isActive
                  ? "text-white border-transparent shadow-md"
                  : "bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 border-gray-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 hover:text-gray-950"
              )}
            >
              {isActive && <span className={cn("absolute inset-0 bg-gradient-to-r", cat.color)} />}
              <span className="relative z-10">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Year</label>
          <select
            value={filters.year}
            onChange={(e) => update("year", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            {YEARS.map((y) => (
              <option key={y} value={y} className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Genre</label>
          <select
            value={filters.genre}
            onChange={(e) => update("genre", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            {GENRES.map((g) => (
              <option key={g} value={g} className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Platform</label>
          <select
            value={filters.platform}
            onChange={(e) => update("platform", e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p} className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center justify-between">
            <span>Min Rating</span>
            <span className="flex items-center gap-1 text-coral font-bold">
              <Star className="w-3.5 h-3.5 fill-coral" />
              {filters.minRating.toFixed(1)}
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => update("minRating", parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value as SortOption)}
            className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-semibold text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value} className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="font-extrabold text-gray-950 dark:text-white">{activeCount}</span> active filter
            {activeCount !== 1 ? "s" : ""}
          </span>
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 text-sm font-bold hover:bg-rose-100 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
