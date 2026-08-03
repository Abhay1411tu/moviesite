import { X, Calendar, Eye, Star, Trash2, Film, Tv, Music, Mic2 } from "lucide-react";
import { cn } from "../utils/cn";
import { MediaImage } from "./MediaImage";
import type { Review, DiaryEntry } from "../types";

interface DiaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  diary: DiaryEntry[];
  reviews: Review[];
  onRemove: (id: number) => void;
  onReviewClick: (review: Review) => void;
  onRate?: (entryId: number, rating: number) => void;
}

export function DiaryDrawer({ isOpen, onClose, diary, reviews, onRemove, onReviewClick, onRate }: DiaryDrawerProps) {
  const categoryIcons: Record<string, React.ReactNode> = {
    Movies: <Film className="w-3.5 h-3.5" />,
    Series: <Tv className="w-3.5 h-3.5" />,
    Songs: <Music className="w-3.5 h-3.5" />,
    Podcasts: <Mic2 className="w-3.5 h-3.5" />,
  };

  const diaryWithReviews = diary
    .map((entry) => ({ entry, review: reviews.find((r) => r.id === entry.reviewId) }))
    .filter((item): item is { entry: DiaryEntry; review: Review } => !!item.review)
    .sort((a, b) => new Date(b.entry.watchedDate).getTime() - new Date(a.entry.watchedDate).getTime());

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-[60] modal-overlay" onClick={onClose} />}

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-96 z-[70] glass-strong shadow-2xl transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-teal to-cyan-500 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your Diary</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{diary.length} titles watched</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors"
              aria-label="Close diary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {diaryWithReviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/60 dark:bg-white/10 text-gray-400 mb-4">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Diary is empty</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Mark movies, shows, songs, and podcasts as watched to build your personal media diary.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal to-cyan-500 text-white text-sm font-semibold"
                >
                  Browse Reviews
                </button>
              </div>
            ) : (
              diaryWithReviews.map(({ entry, review }) => (
                <div
                  key={entry.id}
                  className="flex gap-3 p-3 rounded-2xl bg-white/50 dark:bg-white/10 hover:bg-white/70 dark:hover:bg-white/15 transition-colors"
                >
                  <button onClick={() => { onReviewClick(review); onClose(); }} className="flex-shrink-0">
                    <div className="h-16 w-12 rounded-xl overflow-hidden bg-gray-900 border border-white/20 shadow-sm">
                      <MediaImage
                        src={review.imageUrl}
                        alt={review.title}
                        category={review.category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => { onReviewClick(review); onClose(); }}
                      className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-1 hover:text-coral transition-colors text-left w-full"
                    >
                      {review.title}
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {categoryIcons[review.category]}
                      {review.category}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(entry.watchedDate).toLocaleDateString()}
                    </div>
                    {onRate && (
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => onRate(entry.id, star)}
                            className="focus:outline-none"
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star
                              className={cn(
                                "w-3.5 h-3.5 transition-colors",
                                star <= (entry.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => onRemove(entry.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors self-start"
                    aria-label="Remove from diary"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
