import { useEffect, useMemo, useState, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { HeroCarousel } from "./components/HeroCarousel";
import { FilterBar } from "./components/FilterBar";
import { ReviewCard } from "./components/ReviewCard";
import { ReviewModal } from "./components/ReviewModal";
import { SearchDropdown } from "./components/SearchDropdown";
import { WatchlistDrawer } from "./components/WatchlistDrawer";
import { ProfileModal } from "./components/ProfileModal";
import { Collections } from "./components/Collections";
import { CollectionsModal } from "./components/CollectionsModal";
import { Leaderboard } from "./components/Leaderboard";
import { RankingsModal } from "./components/RankingsModal";
import { CategoryShowcase } from "./components/CategoryShowcase";
import { Newsletter } from "./components/Newsletter";
import { Footer } from "./components/Footer";
import { ToastContainer } from "./components/Toast";
import { SkeletonCard } from "./components/SkeletonCard";
import { Pagination } from "./components/Pagination";
import { DiaryDrawer } from "./components/DiaryDrawer";
import { ListsDrawer } from "./components/ListsDrawer";
import { AuthModal } from "./components/AuthModal";
import { ThemeProvider } from "./hooks/useTheme";
import { AuthProvider } from "./hooks/useAuth";
import { REVIEWS, SAMPLE_USER_REVIEWS } from "./data/reviews";
import type { Review, UserReview, FilterState, Toast as ToastType, Category, DiaryEntry, UserList } from "./types";

import { dbService } from "./services/db";

function AppContent() {
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    search: "",
    year: "All",
    genre: "All",
    platform: "All",
    minRating: 0,
    sort: "newest",
  });

  const [likes, setLikes] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    return new Set(JSON.parse(localStorage.getItem("popcritic-likes") || "[]"));
  });

  const [saved, setSaved] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();
    return new Set(JSON.parse(localStorage.getItem("popcritic-saved") || "[]"));
  });

  const [diary, setDiary] = useState<DiaryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("popcritic-diary") || "[]");
  });

  const [lists, setLists] = useState<UserList[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("popcritic-lists") || "[]");
  });

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isListsOpen, setIsListsOpen] = useState(false);
  const [pendingListReviewId, setPendingListReviewId] = useState<number | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isRankingsOpen, setIsRankingsOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");

  const [userReviews, setUserReviews] = useState<UserReview[]>(SAMPLE_USER_REVIEWS);

  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.init().then(async () => {
      try {
        const dbLikes = await dbService.getUserState<number[]>("likes", []);
        if (dbLikes.length > 0) setLikes(new Set(dbLikes));

        const dbSaved = await dbService.getUserState<number[]>("saved", []);
        if (dbSaved.length > 0) setSaved(new Set(dbSaved));

        const dbDiary = await dbService.getDiary();
        if (dbDiary.length > 0) setDiary(dbDiary);

        const dbLists = await dbService.getLists();
        if (dbLists.length > 0) setLists(dbLists);

        const dbUserReviews = await dbService.getUserReviews();
        setUserReviews(dbUserReviews);
      } catch (err) {
        console.error("Database load error:", err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    dbService.setUserState("likes", [...likes]);
  }, [likes]);

  useEffect(() => {
    dbService.setUserState("saved", [...saved]);
  }, [saved]);

  useEffect(() => {
    dbService.setUserState("diary", diary);
  }, [diary]);

  useEffect(() => {
    dbService.setUserState("lists", lists);
  }, [lists]);

  const addToast = useCallback((message: string, type: ToastType["type"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const watchlist = useMemo(() => REVIEWS.filter((r) => saved.has(r.id)), [saved]);

  const categoryKeywords: Record<string, Category> = {
    movie: "Movies",
    movies: "Movies",
    film: "Movies",
    films: "Movies",
    series: "Series",
    tv: "Series",
    show: "Series",
    shows: "Series",
    song: "Songs",
    songs: "Songs",
    music: "Songs",
    track: "Songs",
    tracks: "Songs",
    podcast: "Podcasts",
    podcasts: "Podcasts",
  };

  const filteredReviews = useMemo(() => {
    const q = filters.search.toLowerCase().trim();
    const detectedCategory = categoryKeywords[q];
    const activeCategory = detectedCategory || filters.category;

    let result = REVIEWS.filter((r) => {
      const matchesCategory = activeCategory === "All" || r.category === activeCategory;
      const matchesSearch =
        !q ||
        detectedCategory ||
        r.title.toLowerCase().includes(q) ||
        r.creator.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q));
      const matchesYear = filters.year === "All" || r.year.toString() === filters.year;
      const matchesGenre = filters.genre === "All" || r.tags.some((t) => t.toLowerCase().includes(filters.genre.toLowerCase()));
      const matchesPlatform = filters.platform === "All" || (r.platform || "").includes(filters.platform);
      const matchesRating = r.rating >= filters.minRating;
      return matchesCategory && matchesSearch && matchesYear && matchesGenre && matchesPlatform && matchesRating;
    });

    switch (filters.sort) {
      case "highest":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case "trending":
        result = [...result].sort((a, b) => b.year - a.year);
        break;
      case "discussed":
        result = [...result].sort((a, b) => b.id - a.id);
        break;
      case "newest":
      default:
        result = [...result].sort((a, b) => b.year - a.year);
    }

    return result;
  }, [filters]);

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);

  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    const reviewsElement = document.getElementById("reviews");
    if (reviewsElement) {
      reviewsElement.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const toggleLike = useCallback((id: number) => {
    const isLiked = likes.has(id);
    setLikes((prev) => {
      const next = new Set(prev);
      if (isLiked) next.delete(id);
      else next.add(id);
      return next;
    });
    if (isLiked) {
      addToast("Removed from liked", "info");
    } else {
      addToast("Added to liked", "success");
    }
  }, [likes, addToast]);

  const toggleSave = useCallback((id: number) => {
    const isSaved = saved.has(id);
    setSaved((prev) => {
      const next = new Set(prev);
      if (isSaved) next.delete(id);
      else next.add(id);
      return next;
    });
    if (isSaved) {
      addToast("Removed from watchlist", "info");
    } else {
      addToast("Saved to watchlist", "success");
    }
  }, [saved, addToast]);

  const openReview = useCallback((review: Review) => {
    setSelectedReview(review);
    setIsReviewModalOpen(true);
  }, []);

  const closeReview = useCallback(() => {
    setIsReviewModalOpen(false);
    setTimeout(() => setSelectedReview(null), 200);
  }, []);

  const toggleDiary = (id: number) => {
    const exists = diary.some((e) => e.reviewId === id);
    setDiary((prev) => {
      if (exists) {
        return prev.filter((e) => e.reviewId !== id);
      }
      return [
        {
          id: Date.now(),
          reviewId: id,
          watchedDate: new Date().toISOString().split("T")[0],
          rewatch: false,
        },
        ...prev,
      ];
    });

    if (exists) {
      addToast("Removed from diary", "info");
    } else {
      addToast("Marked as watched", "success");
    }
  };

  const rateDiaryEntry = (entryId: number, rating: number) => {
    setDiary((prev) => prev.map((e) => (e.id === entryId ? { ...e, rating } : e)));
  };

  const createList = (listData: Omit<UserList, "id" | "createdAt">) => {
    const newList: UserList = {
      ...listData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setLists((prev) => [newList, ...prev]);
    addToast(`Created list "${newList.name}"`, "success");
    setPendingListReviewId(null);
  };

  const deleteList = (id: string) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    addToast("List deleted", "info");
  };

  const addToList = (listId: string, reviewId: number) => {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId && !l.reviewIds.includes(reviewId)
          ? { ...l, reviewIds: [...l.reviewIds, reviewId] }
          : l
      )
    );
    addToast("Added to list", "success");
    setPendingListReviewId(null);
    setIsListsOpen(false);
  };

  const handleAddToListFromModal = (reviewId: number) => {
    setPendingListReviewId(reviewId);
    setIsListsOpen(true);
  };

  const handleAddUserReview = (review: UserReview) => {
    setUserReviews((prev) => [review, ...prev]);
    dbService.addUserReview(review);
    addToast("Review posted successfully!", "success");
  };

  const handleDeleteUserReview = (id: number) => {
    setUserReviews((prev) => prev.filter((r) => r.id !== id));
    dbService.deleteUserReview(id);
    addToast("Review deleted", "info");
  };

  const handleSubscribe = (email: string, categories: Category[]) => {
    localStorage.setItem("popcritic-subscription", JSON.stringify({ email, categories, date: new Date().toISOString() }));
    addToast(`Subscribed! We'll send ${categories.join(", ")} picks to ${email}`, "success");
  };

  const handleTagClick = (tag: string) => {
    closeReview();
    setFilters((f) => ({ ...f, genre: tag, search: "", category: "All" }));
    setCurrentPage(1);
    setTimeout(() => {
      const reviewsEl = document.getElementById("reviews");
      if (reviewsEl) reviewsEl.scrollIntoView({ behavior: "smooth" });
    }, 300);
    addToast(`Showing results for #${tag}`, "info");
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      search: "",
      year: "All",
      genre: "All",
      platform: "All",
      minRating: 0,
      sort: "newest",
    });
  };

  const inDiary = selectedReview ? diary.some((e) => e.reviewId === selectedReview.id) : false;

  return (
    <div className="min-h-screen gradient-mesh text-gray-900 dark:text-gray-100">
      <Navbar
        search={navSearch}
        setSearch={setNavSearch}
        watchlistCount={watchlist.length}
        diaryCount={diary.length}
        onWatchlistOpen={() => setIsWatchlistOpen(true)}
        onProfileOpen={() => setIsProfileOpen(true)}
        onSearchFocus={() => setIsSearchFocused(true)}
        onDiaryOpen={() => setIsDiaryOpen(true)}
        onListsOpen={() => { setPendingListReviewId(null); setIsListsOpen(true); }}
        onAuthOpen={() => setIsAuthOpen(true)}
        onRankingsOpen={() => setIsRankingsOpen(true)}
      />

      <main>
        <HeroCarousel
          search={filters.search}
          setSearch={(s) => setFilters((f) => ({ ...f, search: s }))}
          onReviewClick={openReview}
        />

        <section id="reviews" className="py-10 lg:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  Latest Reviews
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Fresh takes from our community of entertainment lovers.
                </p>
              </div>

            </div>

            <FilterBar filters={filters} setFilters={setFilters} />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredReviews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      liked={likes.has(review.id)}
                      saved={saved.has(review.id)}
                      onLike={() => toggleLike(review.id)}
                      onSave={() => toggleSave(review.id)}
                      onClick={() => openReview(review)}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredReviews.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/70 dark:bg-white/10 text-gray-400 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No reviews found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Try adjusting your search or filters.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        <Collections
          onReviewClick={openReview}
          onViewAllCollections={() => setIsCollectionsModalOpen(true)}
        />

        <div id="leaderboard">
          <Leaderboard
            onRankingsOpen={() => setIsRankingsOpen(true)}
            onReviewClick={openReview}
          />
        </div>

        <CategoryShowcase
          onSelectCategory={(category) => {
            setFilters((f) => ({ ...f, category, genre: "All", search: "" }));
            setCurrentPage(1);
            const reviewsEl = document.getElementById("reviews");
            if (reviewsEl) reviewsEl.scrollIntoView({ behavior: "smooth" });
            addToast(`Filtered by category: ${category}`, "info");
          }}
        />

        <Newsletter onSubscribe={handleSubscribe} />
      </main>

      <Footer />

      <CollectionsModal
        isOpen={isCollectionsModalOpen}
        onClose={() => setIsCollectionsModalOpen(false)}
        onReviewClick={openReview}
      />

      <ReviewModal
        review={selectedReview}
        isOpen={isReviewModalOpen}
        onClose={closeReview}
        onAddReview={handleAddUserReview}
        inDiary={inDiary}
        onToggleDiary={toggleDiary}
        onAddToList={handleAddToListFromModal}
        onRequiresAuth={() => setIsAuthOpen(true)}
        onTagClick={handleTagClick}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {isSearchFocused && (
        <div className="fixed inset-0 z-[55]" onClick={() => setIsSearchFocused(false)}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
            <div className="relative max-w-md ml-auto mr-0 sm:mr-16 lg:mr-24" onClick={(e) => e.stopPropagation()}>
              <SearchDropdown
                search={filters.search}
                setSearch={(s) => setFilters((f) => ({ ...f, search: s }))}
                onSelect={(review) => {
                  openReview(review);
                  setIsSearchFocused(false);
                }}
                onClose={() => setIsSearchFocused(false)}
              />
            </div>
          </div>
        </div>
      )}

      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemove={(id) => {
          setSaved((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }}
        onReviewClick={openReview}
      />

      <DiaryDrawer
        isOpen={isDiaryOpen}
        onClose={() => setIsDiaryOpen(false)}
        diary={diary}
        reviews={REVIEWS}
        onRemove={(id) => setDiary((prev) => prev.filter((e) => e.id !== id))}
        onReviewClick={openReview}
        onRate={rateDiaryEntry}
      />

      <ListsDrawer
        isOpen={isListsOpen}
        onClose={() => { setIsListsOpen(false); setPendingListReviewId(null); }}
        lists={lists}
        reviews={REVIEWS}
        onCreateList={createList}
        onDeleteList={deleteList}
        onReviewClick={openReview}
        pendingReviewId={pendingListReviewId}
        onAddToList={addToList}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        reviews={REVIEWS}
        userReviews={userReviews}
        likedIds={likes}
        savedIds={saved}
        diary={diary}
        lists={lists}
        onDeleteUserReview={handleDeleteUserReview}
        onRemoveLike={(id) => toggleLike(id)}
        onRemoveSave={(id) => toggleSave(id)}
        onRemoveDiary={(id) => {
          setDiary((prev) => prev.filter((e) => e.id !== id));
          addToast("Removed from diary", "info");
        }}
        onDeleteList={(id) => deleteList(id)}
      />

      <RankingsModal
        isOpen={isRankingsOpen}
        onClose={() => setIsRankingsOpen(false)}
        reviews={REVIEWS}
        onReviewClick={openReview}
        likedIds={likes}
        savedIds={saved}
        onToggleLike={toggleLike}
        onToggleSave={toggleSave}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
