import { useEffect, useState } from "react";
import {
  Search,
  Play,
  Menu,
  X,
  ChevronRight,
  Moon,
  Sun,
  Bookmark,
  User,
  Calendar,
  ListPlus,
  LogIn,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  search: string;
  setSearch: (s: string) => void;
  watchlistCount: number;
  diaryCount: number;
  onWatchlistOpen: () => void;
  onProfileOpen: () => void;
  onSearchFocus: () => void;
  onDiaryOpen: () => void;
  onListsOpen: () => void;
  onAuthOpen: () => void;
}

export function Navbar({
  search,
  setSearch,
  watchlistCount,
  diaryCount,
  onWatchlistOpen,
  onProfileOpen,
  onSearchFocus,
  onDiaryOpen,
  onListsOpen,
  onAuthOpen,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinks = [
    { label: "Movies", href: "#reviews" },
    { label: "Series", href: "#reviews" },
    { label: "Songs", href: "#reviews" },
    { label: "Podcasts", href: "#reviews" },
    { label: "Leaderboard", href: "#leaderboard" },
  ];

  return (
    <>
      <a href="#reviews" className="skip-link">
        Skip to reviews
      </a>

      <nav className="fixed top-0 left-0 right-0 z-50 py-3 sm:py-4">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div
            className={cn(
              "relative flex items-center justify-between rounded-2xl px-3 sm:px-5 py-2.5 border transition-all duration-300",
              scrolled
                ? "bg-white/80 dark:bg-gray-900/85 backdrop-blur-xl border-white/70 dark:border-white/10 shadow-lg"
                : "bg-white/60 dark:bg-gray-900/70 backdrop-blur-lg border-white/60 dark:border-white/10"
            )}
          >
            {scrolled && (
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-coral/40 to-transparent rounded-full pointer-events-none" />
            )}

            <a href="#" className="flex items-center gap-2 group">
              <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/85 to-violet/85 text-white shadow-md shadow-violet/15 group-hover:scale-105 transition-transform">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-white" />
                <div className="absolute inset-0 rounded-xl shimmer opacity-30" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                Pop<span className="text-gradient">Critic</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center bg-white/70 dark:bg-white/10 rounded-full p-1 border border-gray-200/80 dark:border-white/10 backdrop-blur-sm shadow-xs">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:text-coral dark:hover:text-white rounded-full transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={onSearchFocus}
                  placeholder="Search..."
                  className="w-40 lg:w-56 pl-9 pr-4 py-2 rounded-full glass-input text-sm font-semibold text-gray-900 placeholder:text-gray-500 dark:text-gray-100 dark:placeholder:text-gray-400"
                  aria-label="Search reviews"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 border border-gray-200/80 dark:border-white/10 transition-colors shadow-xs"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <button
                onClick={onDiaryOpen}
                className="hidden lg:relative p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 border border-gray-200/80 dark:border-white/10 transition-colors shadow-xs"
                aria-label="Diary"
              >
                <Calendar className="w-4 h-4" />
                {diaryCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">
                    {diaryCount}
                  </span>
                )}
              </button>

              <button
                onClick={onListsOpen}
                className="hidden lg:relative p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 border border-gray-200/80 dark:border-white/10 transition-colors shadow-xs"
                aria-label="Lists"
              >
                <ListPlus className="w-4 h-4" />
              </button>

              <button
                onClick={onWatchlistOpen}
                className="hidden sm:relative p-2 sm:p-2.5 rounded-xl bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-200 hover:bg-white dark:hover:bg-white/20 border border-gray-200/80 dark:border-white/10 transition-colors shadow-xs"
                aria-label="Watchlist"
              >
                <Bookmark className="w-4 h-4" />
                {watchlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">
                    {watchlistCount}
                  </span>
                )}
              </button>

              {isLoggedIn ? (
                <button
                  onClick={onProfileOpen}
                  className="hidden sm:flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-coral/85 to-violet/85 text-white font-bold text-sm shadow-sm hover:scale-105 transition-transform"
                  aria-label="Open profile"
                >
                  {user?.avatar || user?.username?.slice(0, 2).toUpperCase() || "JD"}
                </button>
              ) : (
                <button
                  onClick={onAuthOpen}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-coral/85 to-violet/85 text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-white/50 dark:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors border border-white/60 dark:border-white/10"
                aria-label="Toggle menu"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-[60] transition-all duration-300",
          open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 top-0 bg-gray-900 dark:bg-black transition-transform duration-300 ease-out shadow-2xl",
            open ? "translate-y-0" : "-translate-y-full"
          )}
          style={{ maxHeight: "100vh", height: "100vh" }}
        >
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              onClick={() => setOpen(false)}
              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-72px)] p-3 sm:p-4">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-3.5 text-base font-semibold text-white/90 hover:bg-white/10 hover:text-coral rounded-xl transition-colors"
              >
                {item.label}
                <ChevronRight className="w-5 h-5 text-white/40" />
              </a>
            ))}

            <div className="border-t border-white/10 mt-3 pt-3 flex flex-col gap-2 px-2 pb-6">
              <div className="relative px-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 text-sm focus:bg-white/15 focus:border-coral/50"
                  aria-label="Search reviews"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              </div>

              <button
                onClick={() => { onDiaryOpen(); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                Diary ({diaryCount})
              </button>
              <button
                onClick={() => { onListsOpen(); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
              >
                <ListPlus className="w-5 h-5" />
                Lists
              </button>
              <button
                onClick={() => { onWatchlistOpen(); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
              >
                <Bookmark className="w-5 h-5" />
                Watchlist ({watchlistCount})
              </button>
              {isLoggedIn ? (
                <button
                  onClick={() => { onProfileOpen(); setOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
              ) : (
                <button
                  onClick={() => { onAuthOpen(); setOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 rounded-xl transition-colors flex items-center gap-3"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
