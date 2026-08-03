import { useState } from "react";
import { Mail, Check, Film, Tv, Music, Mic2 } from "lucide-react";
import { cn } from "../utils/cn";
import { useScrollReveal } from "../hooks/useScrollReveal";
import type { Category } from "../types";

interface NewsletterProps {
  onSubscribe?: (email: string, categories: Category[]) => void;
}

export function Newsletter({ onSubscribe }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(["Movies", "Series"]);
  const [submitted, setSubmitted] = useState(false);
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const categories: { label: Category; icon: React.ReactNode }[] = [
    { label: "Movies", icon: <Film className="w-4 h-4" /> },
    { label: "Series", icon: <Tv className="w-4 h-4" /> },
    { label: "Songs", icon: <Music className="w-4 h-4" /> },
    { label: "Podcasts", icon: <Mic2 className="w-4 h-4" /> },
  ];

  const toggleCategory = (cat: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubscribe?.(email, selectedCategories);
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section ref={ref} className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <div
          className={cn(
            "relative overflow-hidden rounded-[2.5rem] glass-strong p-10 sm:p-16 text-center transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-coral/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-violet/20 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-teal/85 to-cyan-500/85 text-white shadow-md mb-6">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Never miss a great review
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
              Get weekly picks, trending updates, and critic favorites delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-3.5 rounded-xl glass-input text-gray-800 dark:text-gray-100 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="px-7 py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {categories.map((cat) => {
                  const selected = selectedCategories.includes(cat.label);
                  return (
                    <button
                      key={cat.label}
                      type="button"
                      onClick={() => toggleCategory(cat.label)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all",
                        selected
                          ? "bg-coral/10 border-coral/30 text-coral"
                          : "bg-white/50 dark:bg-white/10 border-white/60 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/20"
                      )}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                      {cat.icon}
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 toast-enter">
                  Thanks for subscribing! 🎉
                </p>
              )}
            </form>

            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
