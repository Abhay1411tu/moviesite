import { useMemo, useRef, useEffect, useState } from "react";
import { Search, Clock, TrendingUp } from "lucide-react";
import { REVIEWS } from "../data/reviews";
import { MediaImage } from "./MediaImage";
import type { Review } from "../types";

interface SearchDropdownProps {
  search: string;
  setSearch: (s: string) => void;
  onSelect: (review: Review) => void;
  onClose: () => void;
}

export function SearchDropdown({ search, setSearch, onSelect, onClose }: SearchDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("popcritic-recent-searches") || "[]");
  });

  const results = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return [];
    return REVIEWS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.creator.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [search]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCloseRef.current();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (review: Review) => {
    setSearch(review.title);
    onSelect(review);
    const updated = [review.title, ...recentSearches.filter((s) => s !== review.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("popcritic-recent-searches", JSON.stringify(updated));
  };

  const handleRecentClick = (term: string) => {
    setSearch(term);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("popcritic-recent-searches");
  };

  const showRecent = !search.trim() && recentSearches.length > 0;
  const showTrending = !search.trim() && recentSearches.length === 0;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-strong shadow-2xl overflow-hidden z-50 border border-white/40 dark:border-white/10"
    >
      {results.length > 0 && (
        <div className="p-2">
          {results.map((review) => (
            <button
              key={review.id}
              onClick={() => handleSelect(review)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors text-left"
            >
              <div className="h-10 w-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 shadow-sm">
                <MediaImage
                  src={review.imageUrl}
                  alt={review.title}
                  category={review.category}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{review.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {review.category} • {review.creator}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showRecent && (
        <div className="p-2">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Recent Searches
            </div>
            <button onClick={clearRecent} className="text-xs text-coral font-semibold hover:underline">
              Clear
            </button>
          </div>
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => handleRecentClick(term)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors text-left"
            >
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{term}</span>
            </button>
          ))}
        </div>
      )}

      {showTrending && (
        <div className="p-2">
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Trending Searches
          </div>
          {["Dune: Part Two", "The Bear", "Espresso", "Severance"].map((term) => (
            <button
              key={term}
              onClick={() => handleRecentClick(term)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition-colors text-left"
            >
              <Search className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-200">{term}</span>
            </button>
          ))}
        </div>
      )}

      {search.trim() && results.length === 0 && (
        <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          No results found for "{search}"
        </div>
      )}
    </div>
  );
}
