import { useState, useMemo, useEffect } from "react";
import { X, Film, Tv, Music, Mic2, Search, ArrowRight, Star, Layers, ChevronLeft } from "lucide-react";
import { cn } from "../utils/cn";
import { COLLECTIONS, REVIEWS } from "../data/reviews";
import { MediaImage } from "./MediaImage";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import type { Category, Review, EditorialCollection } from "../types";

interface CollectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewClick: (review: Review) => void;
}

const CATEGORY_TABS: { label: Category; icon: React.ReactNode; color: string }[] = [
  { label: "All", icon: <Layers className="w-4 h-4" />, color: "bg-gray-900 text-white" },
  { label: "Movies", icon: <Film className="w-4 h-4" />, color: "bg-orange-500 text-white" },
  { label: "Series", icon: <Tv className="w-4 h-4" />, color: "bg-violet-600 text-white" },
  { label: "Songs", icon: <Music className="w-4 h-4" />, color: "bg-rose-500 text-white" },
  { label: "Podcasts", icon: <Mic2 className="w-4 h-4" />, color: "bg-teal-500 text-white" },
];

const CATEGORY_MAP: Record<number, Category> = {
  1: "Movies",
  2: "Movies",
  3: "Movies",
  4: "Series",
  5: "Series",
  6: "Series",
  7: "Songs",
  8: "Songs",
  9: "Podcasts",
  10: "Podcasts",
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  Movies: "bg-orange-100 text-orange-700 border-orange-200",
  Series: "bg-violet-100 text-violet-700 border-violet-200",
  Songs: "bg-rose-100 text-rose-700 border-rose-200",
  Podcasts: "bg-teal-100 text-teal-700 border-teal-200",
};

const CATEGORY_BADGE_COLORS_DARK: Record<string, string> = {
  Movies: "dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700/50",
  Series: "dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-700/50",
  Songs: "dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700/50",
  Podcasts: "dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700/50",
};

const CATEGORY_ASPECT_RATIOS: Record<string, string> = {
  Movies: "aspect-[3/4]",
  Series: "aspect-[3/4]",
  Songs: "aspect-square",
  Podcasts: "aspect-square",
};

export function CollectionsModal({
  isOpen,
  onClose,
  onReviewClick,
}: CollectionsModalProps) {
  const [activeTab, setActiveTab] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<EditorialCollection | null>(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (!isOpen) {
      setSelectedCollection(null);
    }
  }, [isOpen]);

  const filteredCollections = useMemo(() => {
    return COLLECTIONS.filter((col) => {
      const colCategory = CATEGORY_MAP[col.id] || "Movies";
      const matchesTab = activeTab === "All" || colCategory === activeTab;
      const matchesSearch =
        !searchQuery ||
        col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container — fully opaque, no glass */}
      <div className="relative z-10 w-full max-w-6xl h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 overscroll-contain">

        {/* ── HEADER ── */}
        <div className="flex-none flex items-start sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-4 h-4 text-[#FF6B6B]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#FF6B6B]">Curated Media Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-950 dark:text-white leading-tight">
              All Editorial <span className="text-[#FF6B6B]">Collections</span>
            </h2>
            <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Browse hand-picked lists by category — movies, series, songs &amp; podcasts.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-none p-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-900/50 hover:text-red-600 dark:hover:text-red-400 border border-gray-300 dark:border-gray-600 transition-all font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="flex-none flex flex-col sm:flex-row sm:items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => { setActiveTab(tab.label); setSelectedCollection(null); }}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black border transition-all",
                    isActive
                      ? `${tab.color} border-transparent shadow-md`
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-semibold text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:border-[#FF6B6B]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-100 dark:bg-gray-900">

          {selectedCollection ? (
            /* ── DEEP-DIVE VIEW ── */
            <div className="space-y-6">
              {/* Back button */}
              <button
                onClick={() => setSelectedCollection(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-black border border-gray-300 dark:border-gray-600 hover:bg-[#FF6B6B] hover:text-white hover:border-[#FF6B6B] transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to All Collections
              </button>

              {/* Collection header */}
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm">
                <h3 className="text-2xl font-black text-gray-950 dark:text-white mb-1">{selectedCollection.title}</h3>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{selectedCollection.subtitle}</p>
              </div>

              {/* Items grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {REVIEWS.filter((r) => selectedCollection.reviewIds.includes(r.id)).map((review) => (
                  <button
                    key={review.id}
                    onClick={() => { onReviewClick(review); onClose(); }}
                    className="text-left group flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#FF6B6B] hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className={cn("w-full overflow-hidden relative", CATEGORY_ASPECT_RATIOS[review.category] || "aspect-[3/4]")}>
                      <MediaImage
                        src={review.imageUrl}
                        alt={review.title}
                        category={review.category}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 text-amber-300 text-xs font-black">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {review.rating}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="font-black text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-[#FF6B6B] transition-colors">{review.title}</p>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 truncate mt-0.5">{review.creator}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          ) : filteredCollections.length > 0 ? (
            /* ── COLLECTIONS GRID ── */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCollections.map((collection) => {
                const reviews = REVIEWS.filter((r) => collection.reviewIds.includes(r.id));
                const colCategory = CATEGORY_MAP[collection.id] || "Movies";
                const badgeClass = cn(
                  "px-3 py-1 rounded-full text-xs font-black border",
                  CATEGORY_BADGE_COLORS[colCategory],
                  CATEGORY_BADGE_COLORS_DARK[colCategory]
                );

                return (
                  <div
                    key={collection.id}
                    className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#FF6B6B]/60 hover:shadow-xl transition-all p-5"
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={badgeClass}>{colCategory}</span>
                      <span className="text-xs font-black text-gray-700 dark:text-gray-300">{reviews.length} titles</span>
                    </div>

                    <h3 className="text-lg font-black text-gray-950 dark:text-white mb-1 leading-snug">{collection.title}</h3>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{collection.subtitle}</p>

                    {/* 4 preview thumbnails */}
                    <div className="grid grid-cols-4 gap-2 mb-5">
                      {reviews.slice(0, 4).map((r) => (
                        <div key={r.id} className="aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                          <MediaImage
                            src={r.imageUrl}
                            alt={r.title}
                            category={r.category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Browse button — always visible and solid */}
                    <button
                      onClick={() => setSelectedCollection(collection)}
                      className="mt-auto w-full py-3 rounded-xl bg-[#FF6B6B] text-white font-black text-sm hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      Browse Collection
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-4" />
              <p className="text-lg font-black text-gray-800 dark:text-gray-200">No collections found</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try a different search or category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
