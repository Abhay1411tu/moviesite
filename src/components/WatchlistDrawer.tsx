import { X, Bookmark, Film, Tv, Music, Mic2, Trash2 } from "lucide-react";
import { cn } from "../utils/cn";
import { MediaImage } from "./MediaImage";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import type { Review } from "../types";

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: Review[];
  onRemove: (id: number) => void;
  onReviewClick: (review: Review) => void;
}

export function WatchlistDrawer({ isOpen, onClose, watchlist, onRemove, onReviewClick }: WatchlistDrawerProps) {
  useLockBodyScroll(isOpen);

  const categoryIcons: Record<string, React.ReactNode> = {
    Movies: <Film className="w-3.5 h-3.5" />,
    Series: <Tv className="w-3.5 h-3.5" />,
    Songs: <Music className="w-3.5 h-3.5" />,
    Podcasts: <Mic2 className="w-3.5 h-3.5" />,
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-[60] modal-overlay"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 z-[70] glass-strong shadow-2xl transform transition-transform duration-300 ease-out overscroll-contain",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-coral/85 to-violet/85 text-white">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Watchlist</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{watchlist.length} saved titles</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {watchlist.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/60 dark:bg-white/10 text-gray-400 mb-4">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Watchlist is empty</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Save movies, series, songs, and podcasts to revisit them later.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-coral to-rose-500 text-white text-sm font-semibold"
                >
                  Browse Reviews
                </button>
              </div>
            ) : (
              watchlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-2xl bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/15 transition-colors"
                >
                  <button onClick={() => { onReviewClick(item); onClose(); }} className="flex-shrink-0">
                    <div className="h-16 w-12 rounded-xl overflow-hidden bg-gray-900 shadow-sm border border-white/20">
                      <MediaImage
                        src={item.imageUrl}
                        alt={item.title}
                        category={item.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => { onReviewClick(item); onClose(); }}
                      className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-1 hover:text-coral transition-colors text-left w-full"
                    >
                      {item.title}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {categoryIcons[item.category]}
                      {item.category}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.creator}</div>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {watchlist.length > 0 && (
            <div className="p-4 border-t border-gray-200/50 dark:border-white/10">
              <button className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                View Full Watchlist
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
