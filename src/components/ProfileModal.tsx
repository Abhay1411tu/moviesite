import { useState, useEffect } from "react";
import { X, Trophy, Star, Bookmark, Heart, MessageSquare, Award, Calendar, ListPlus, LogOut, Edit2, Check, Film, Tv, Music, Mic2, Trash2 } from "lucide-react";
import { cn } from "../utils/cn";
import { useAuth } from "../hooks/useAuth";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { MediaImage } from "./MediaImage";
import type { UserReview, Review, DiaryEntry, UserList } from "../types";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  userReviews: UserReview[];
  likedIds: Set<number>;
  savedIds: Set<number>;
  diary: DiaryEntry[];
  lists: UserList[];
  onDeleteUserReview?: (id: number) => void;
  onRemoveLike?: (id: number) => void;
  onRemoveSave?: (id: number) => void;
  onRemoveDiary?: (id: number) => void;
  onDeleteList?: (id: string) => void;
}

const avatarGradients = [
  "from-coral to-rose-500",
  "from-violet to-purple-600",
  "from-teal to-cyan-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-green-600",
  "from-fuchsia-400 to-pink-600",
];

type ActivityTab = "reviews" | "liked" | "saved" | "diary" | "lists";

export function ProfileModal({
  isOpen,
  onClose,
  reviews,
  userReviews,
  likedIds,
  savedIds,
  diary,
  lists,
  onDeleteUserReview,
  onRemoveLike,
  onRemoveSave,
  onRemoveDiary,
  onDeleteList,
}: ProfileModalProps) {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<ActivityTab>("reviews");

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (user) {
      setEditUsername(user.username || "");
      setEditBio(user.bio || "");
    }
  }, [user]);

  if (!isOpen) return null;

  const safeReviews = reviews || [];
  const safeUserReviews = userReviews || [];
  const safeDiary = diary || [];
  const safeLists = lists || [];

  const displayName = user?.username || "Guest";
  const displayBio = user?.bio || "Entertainment enthusiast";
  const displayAvatar = user?.avatar || displayName.slice(0, 2).toUpperCase();
  const memberSince = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "New member";

  const likedReviews = safeReviews.filter((r) => likedIds?.has(r.id));
  const savedReviews = safeReviews.filter((r) => savedIds?.has(r.id));

  const handleSave = () => {
    if (!editUsername.trim()) return;
    updateProfile({
      username: editUsername.trim(),
      bio: editBio.trim() || "Entertainment enthusiast",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const badges = [
    { name: "Top Critic", icon: <Trophy className="w-3.5 h-3.5" />, color: "from-amber-400 to-orange-500" },
    { name: "Binge Watcher", icon: <Star className="w-3.5 h-3.5" />, color: "from-violet to-purple-600" },
    { name: "Podcast Addict", icon: <Award className="w-3.5 h-3.5" />, color: "from-teal to-cyan-600" },
  ];

  const stats = [
    { id: "reviews", icon: <MessageSquare className="w-4 h-4" />, value: safeUserReviews.length, label: "Reviews" },
    { id: "liked", icon: <Heart className="w-4 h-4" />, value: likedReviews.length, label: "Liked" },
    { id: "saved", icon: <Bookmark className="w-4 h-4" />, value: savedReviews.length, label: "Saved" },
    { id: "diary", icon: <Calendar className="w-4 h-4" />, value: safeDiary.length, label: "Diary" },
    { id: "lists", icon: <ListPlus className="w-4 h-4" />, value: safeLists.length, label: "Lists" },
  ];

  const tabs = [
    { id: "reviews" as ActivityTab, label: "Reviews", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "liked" as ActivityTab, label: "Liked", icon: <Heart className="w-4 h-4" /> },
    { id: "saved" as ActivityTab, label: "Saved", icon: <Bookmark className="w-4 h-4" /> },
    { id: "diary" as ActivityTab, label: "Diary", icon: <Calendar className="w-4 h-4" /> },
    { id: "lists" as ActivityTab, label: "Lists", icon: <ListPlus className="w-4 h-4" /> },
  ];

  const categoryIcon: Record<string, React.ReactNode> = {
    Movies: <Film className="w-3.5 h-3.5" />,
    Series: <Tv className="w-3.5 h-3.5" />,
    Songs: <Music className="w-3.5 h-3.5" />,
    Podcasts: <Mic2 className="w-3.5 h-3.5" />,
  };

  const renderContent = () => {
    if (activeTab === "reviews") {
      if (safeUserReviews.length === 0) return <EmptyState message="No reviews yet. Start writing!" />;
      return (
        <div className="space-y-3">
          {safeUserReviews.map((review) => (
            <div key={review.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{review.author}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                  {onDeleteUserReview && (
                    <button
                      onClick={() => onDeleteUserReview(review.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-3 h-3",
                      star <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-600"
                    )}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{review.content}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === "liked") {
      if (likedReviews.length === 0) return <EmptyState message="No liked titles yet." />;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {likedReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onRemove={onRemoveLike ? () => onRemoveLike(review.id) : undefined}
              removeTitle="Unlike title"
            />
          ))}
        </div>
      );
    }

    if (activeTab === "saved") {
      if (savedReviews.length === 0) return <EmptyState message="No saved titles yet." />;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onRemove={onRemoveSave ? () => onRemoveSave(review.id) : undefined}
              removeTitle="Remove from watchlist"
            />
          ))}
        </div>
      );
    }

    if (activeTab === "diary") {
      if (safeDiary.length === 0) return <EmptyState message="Your diary is empty. Mark titles as watched!" />;
      return (
        <div className="space-y-3">
          {/* eslint-disable-next-line */}
          {[...safeDiary]
            .sort((a, b) => new Date(b.watchedDate).getTime() - new Date(a.watchedDate).getTime())
            .map((entry) => {
              const review = safeReviews.find((r) => r.id === entry.reviewId);
              if (!review) return null;
              return (
                <div key={entry.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className={cn("h-14 w-10 rounded-lg bg-gradient-to-br flex-shrink-0", review.coverColor)} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-1">{review.title}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {categoryIcon[review.category]}
                      {review.category}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Watched on {new Date(entry.watchedDate).toLocaleDateString()}
                    </div>
                  </div>
                  {entry.rating && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{entry.rating}</span>
                    </div>
                  )}
                  {onRemoveDiary && (
                    <button
                      onClick={() => onRemoveDiary(entry.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                      title="Remove from diary"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      );
    }

    if (activeTab === "lists") {
      if (safeLists.length === 0) return <EmptyState message="No lists created yet." />;
      return (
        <div className="space-y-3">
          {safeLists.map((list) => (
            <div key={list.id} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white", list.gradient)}>
                    <ListPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{list.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{list.reviewIds.length} titles</div>
                  </div>
                </div>
                {onDeleteList && (
                  <button
                    onClick={() => onDeleteList(list.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              {list.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{list.description}</p>
              )}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {safeReviews
                  .filter((r) => list.reviewIds.includes(r.id))
                  .map((review) => (
                    <div key={review.id} className="flex-shrink-0 text-left">
                      <div className={cn("h-14 w-10 rounded-lg bg-gradient-to-br mb-1", review.coverColor)} />
                      <p className="text-[10px] text-gray-600 dark:text-gray-300 line-clamp-1 w-10">{review.title}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 modal-overlay modal-overlay-animate bg-black/40 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong shadow-2xl modal-animate overscroll-contain">
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-coral/80 via-violet/80 to-teal/80" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-gray-700 dark:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute -bottom-12 left-8">
            <div
              className={cn(
                "h-24 w-24 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white dark:border-gray-800",
                avatarGradients[avatarIndex % avatarGradients.length]
              )}
            >
              {displayAvatar}
            </div>
          </div>
        </div>

        <div className="pt-14 px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{displayName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "guest@example.com"}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{memberSince}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing((e) => !e)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 border border-white/60 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors"
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                {isEditing ? "Done" : "Edit Profile"}
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="glass rounded-2xl p-4 mb-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-gray-800 dark:text-gray-100"
                  placeholder="Your username"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-gray-800 dark:text-gray-100 resize-none"
                  placeholder="Tell us about yourself"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">Avatar Style</label>
                <div className="flex gap-2">
                  {avatarGradients.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setAvatarIndex(i)}
                      className={cn(
                        "h-10 w-10 rounded-xl bg-gradient-to-br",
                        g,
                        avatarIndex === i && "ring-2 ring-offset-2 ring-coral"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{displayBio}</p>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
            {stats.map((stat) => (
              <button
                key={stat.id}
                onClick={() => setActiveTab(stat.id as ActivityTab)}
                className={cn(
                  "glass-card rounded-2xl p-2 sm:p-3 text-center transition-all",
                  activeTab === stat.id && "ring-2 ring-coral bg-coral/5"
                )}
              >
                <div className="flex items-center justify-center gap-1 text-coral mb-1">{stat.icon}</div>
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Badges</h3>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow-md",
                    "bg-gradient-to-r",
                    badge.color
                  )}
                >
                  {badge.icon}
                  {badge.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-4 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "bg-coral/10 text-coral border border-coral/20"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-white/10"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[150px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}

function ReviewItem({
  review,
  onRemove,
  removeTitle,
}: {
  review: Review;
  onRemove?: () => void;
  removeTitle?: string;
}) {
  return (
    <div className="glass rounded-2xl p-3 flex gap-3 items-center">
      <div className="h-16 w-12 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 shadow-sm border border-white/20">
        <MediaImage
          src={review.imageUrl}
          alt={review.title}
          category={review.category}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-1">{review.title}</div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {review.category}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{review.rating}</span>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          title={removeTitle || "Remove"}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
