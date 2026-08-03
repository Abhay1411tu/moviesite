import { useEffect, useState } from "react";
import {
  X,
  Star,
  Clock,
  Calendar,
  Monitor,
  Users,
  ThumbsUp,
  MessageSquare,
  Share2,
  Play,
  Eye,
  Check,
  ExternalLink,
  LogIn,
  Film,
  Tv,
  Music,
  Mic2,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useAuth } from "../hooks/useAuth";
import { ShareCard } from "./ShareCard";
import { MediaImage } from "./MediaImage";
import { SAMPLE_USER_REVIEWS } from "../data/reviews";
import type { Review, UserReview } from "../types";

interface ReviewModalProps {
  review: Review | null;
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: UserReview) => void;
  inDiary?: boolean;
  onToggleDiary?: (id: number) => void;
  onAddToList?: (reviewId: number) => void;
  onRequiresAuth?: () => void;
}

const providerNames: Record<string, string> = {
  Netflix: "Netflix",
  Max: "Max",
  Hulu: "Hulu",
  "Apple TV+": "Apple TV+",
  "Disney+": "Disney+",
  "Prime Video": "Prime",
  Peacock: "Peacock",
  Spotify: "Spotify",
  "Apple Music": "Apple Music",
  YouTube: "YouTube",
  "YouTube Music": "YT Music",
};

const providerTextColors: Record<string, string> = {
  Netflix: "text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20",
  Max: "text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/20",
  Hulu: "text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/20",
  "Apple TV+": "text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800",
  "Disney+": "text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30 bg-indigo-50 dark:bg-indigo-900/20",
  "Prime Video": "text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/30 bg-sky-50 dark:bg-sky-900/20",
  Peacock: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/20",
  Spotify: "text-green-600 dark:text-green-400 border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20",
  "Apple Music": "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/30 bg-rose-50 dark:bg-rose-900/20",
  YouTube: "text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20",
  "YouTube Music": "text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20",
};

const categoryIcons: Record<string, React.ReactNode> = {
  Movies: <Film className="w-4 h-4" />,
  Series: <Tv className="w-4 h-4" />,
  Songs: <Music className="w-4 h-4" />,
  Podcasts: <Mic2 className="w-4 h-4" />,
};

export function ReviewModal({
  review,
  isOpen,
  onClose,
  onAddReview,
  inDiary = false,
  onToggleDiary,
  onAddToList,
  onRequiresAuth,
}: ReviewModalProps) {
  const { user, isLoggedIn } = useAuth();
  const [userReviews, setUserReviews] = useState<UserReview[]>(SAMPLE_USER_REVIEWS);
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");
  const [spoilerFree, setSpoilerFree] = useState(true);
  const [showMedia, setShowMedia] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (review) {
      setUserReviews(SAMPLE_USER_REVIEWS.filter((r: { reviewId: number }) => r.reviewId === review.id));
      setShowMedia(false);
    }
  }, [review]);

  if (!review || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onRequiresAuth?.();
      return;
    }
    if (!newContent.trim()) return;

    const reviewObj: UserReview = {
      id: Date.now(),
      reviewId: review.id,
      rating: newRating,
      content: newContent,
      author: user?.username || "Anonymous",
      date: "Just now",
      helpful: 0,
    };

    setUserReviews((prev) => [reviewObj, ...prev]);
    onAddReview(reviewObj);
    setNewContent("");
    setNewRating(5);
  };

  const hasMedia = !!review.trailerUrl;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 modal-overlay modal-overlay-animate">
      <div className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl glass-strong shadow-2xl modal-animate border border-white/40 dark:border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/20 shadow-lg"
          aria-label="Close review"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Header */}
        <div className="h-56 sm:h-72 relative overflow-hidden rounded-t-3xl bg-gray-950">
          <MediaImage
            src={review.imageUrl}
            alt={review.title}
            category={review.category}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-black/30" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white z-10">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30 flex items-center gap-1.5">
                {categoryIcons[review.category]}
                {review.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-xs font-bold border border-amber-400/40 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                Critic {review.rating}
              </span>
              {review.audienceRating && (
                <span className="px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-xs font-bold border border-blue-400/40 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>
                  Audience {review.audienceRating}
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-1 drop-shadow-md">{review.title}</h2>
            <p className="text-white/90 text-base sm:text-lg font-medium drop-shadow">{review.creator}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Main content grid: Left Poster Artwork + Right Overview */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
            {/* High Quality Poster Artwork Card */}
            <div className="md:col-span-4 lg:col-span-4 flex flex-col items-center">
              <div className="relative w-full aspect-[2/3] max-w-[280px] rounded-2xl overflow-hidden shadow-2xl border border-white/30 dark:border-white/10 group bg-gray-900">
                <MediaImage
                  src={review.imageUrl}
                  alt={review.title}
                  category={review.category}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Overview & Metadata Column */}
            <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-between">
              <div>
                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {onToggleDiary && (
                    <button
                      onClick={() => onToggleDiary(review.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-xs",
                        inDiary
                          ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-400"
                          : "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 dark:bg-white/10 dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/20"
                      )}
                    >
                      {inDiary ? <Check className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {inDiary ? "Watched" : "Mark Watched"}
                    </button>
                  )}
                  {onAddToList && (
                    <button
                      onClick={() => onAddToList(review.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 dark:bg-white/10 dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/20 transition-all shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Add to List
                    </button>
                  )}
                  {hasMedia && (
                    <button
                      onClick={() => setShowMedia((s) => !s)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-coral/15 border border-coral/40 text-coral-600 dark:text-coral hover:bg-coral hover:text-white transition-all shadow-xs"
                    >
                      <Play className="w-4 h-4" />
                      {showMedia ? "Hide Preview" : "Watch Preview"}
                    </button>
                  )}
                </div>

                {/* Meta stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="glass-card rounded-2xl p-3 text-center border-gray-200/80">
                    <Calendar className="w-4 h-4 mx-auto mb-1 text-coral" />
                    <div className="text-sm font-bold text-gray-950 dark:text-gray-100">{review.year}</div>
                    <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Released</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4 text-center border-gray-200/80">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-violet" />
                    <div className="text-sm font-bold text-gray-950 dark:text-gray-100">{review.duration}</div>
                    <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Runtime</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4 text-center border-gray-200/80">
                    <Monitor className="w-4 h-4 mx-auto mb-1 text-teal" />
                    <div className="text-sm font-bold text-gray-950 dark:text-gray-100 truncate">{review.platform}</div>
                    <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Platform</div>
                  </div>
                  <div className="glass-card rounded-2xl p-4 text-center border-gray-200/80">
                    <Users className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <div className="text-sm font-bold text-gray-950 dark:text-gray-100">{review.cast?.length || 0}</div>
                    <div className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Cast/Creators</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Synopsis & Review</h3>
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-base sm:text-lg">{review.description}</p>
                </div>
              </div>

              {/* Where to Watch */}
              {review.streamingOffers && review.streamingOffers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2.5 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-coral" />
                    Available On
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {review.streamingOffers.map((offer, i) => (
                      <a
                        key={i}
                        href={offer.url || "#"}
                        className={cn(
                          "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border hover:scale-105 transition-transform shadow-sm",
                          providerTextColors[offer.provider] || "text-gray-700 dark:text-gray-200 border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/10"
                        )}
                      >
                        <span>{providerNames[offer.provider] || offer.provider}</span>
                        <span className="text-[10px] uppercase tracking-wider opacity-80">{offer.type}</span>
                        {offer.quality && <span className="text-[10px] opacity-80">{offer.quality}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Media preview iframe */}
          {showMedia && review.trailerUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden glass border border-white/60 dark:border-white/10 shadow-lg">
              <div className="aspect-video">
                <iframe
                  src={review.trailerUrl}
                  title={`${review.title} preview`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Tags & Cast */}
          <div className="mb-8 p-5 rounded-2xl glass border border-white/60 dark:border-white/10">
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">Tags & Key Details</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {review.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-white/70 dark:bg-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 border border-white/60 dark:border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            {review.cast && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Cast / Creators:</span>{" "}
                {review.cast.join(", ")}
              </p>
            )}
          </div>

          {/* User reviews */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                User Reviews
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({userReviews.length})</span>
              </h3>
            </div>

            <div className="space-y-4 mb-6">
              {userReviews.map((ur) => (
                <div key={ur.id} className="glass rounded-2xl p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-coral/85 to-violet/85 flex items-center justify-center text-white font-bold text-sm">
                        {ur.author[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-gray-100">{ur.author}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{ur.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{ur.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">{ur.content}</p>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-coral transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    Helpful ({ur.helpful})
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="glass rounded-2xl p-4 sm:p-5">
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-coral" />
                Write Your Review
              </h4>

              {!isLoggedIn && (
                <div className="mb-4 p-4 rounded-xl bg-coral/10 border border-coral/20 text-center">
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-3">
                    Sign in to share your review with the community.
                  </p>
                  <button
                    type="button"
                    onClick={onRequiresAuth}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-coral/85 to-violet/85 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In to Review
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-input mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={cn(
                        "w-5 h-5 transition-colors",
                        star <= newRating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  </button>
                ))}
              </div>
              <textarea
                placeholder={isLoggedIn ? "Share your thoughts..." : "Sign in to write a review..."}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                required
                disabled={!isLoggedIn}
                rows={3}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm resize-none mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <label className={cn("flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer", !isLoggedIn && "opacity-50 cursor-not-allowed")}>
                  <input
                    type="checkbox"
                    checked={spoilerFree}
                    onChange={(e) => setSpoilerFree(e.target.checked)}
                    disabled={!isLoggedIn}
                    className="rounded border-gray-300 text-coral focus:ring-coral"
                  />
                  Spoiler-free review
                </label>
                <button
                  type="submit"
                  disabled={!isLoggedIn}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-coral to-rose-500 text-white text-sm font-semibold shadow-lg hover:shadow-coral/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggedIn ? "Post Review" : "Sign In to Post"}
                </button>
              </div>
            </form>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowShare(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass-input text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-white/15 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Review
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <ShareCard review={review} isOpen={showShare} onClose={() => setShowShare(false)} />
    </div>
  );
}
