import { Film, Tv, Music, Mic2, ChevronRight } from "lucide-react";
import { cn } from "../utils/cn";
import { useScrollReveal } from "../hooks/useScrollReveal";

export function CategoryShowcase() {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();

  const items = [
    { title: "Movies", icon: <Film className="w-7 h-7" />, gradient: "from-coral to-rose-500", bg: "bg-coral/10", count: "4,200+", iconStyle: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/30" },
    { title: "Series", icon: <Tv className="w-7 h-7" />, gradient: "from-violet to-purple-600", bg: "bg-violet/10", count: "3,150+", iconStyle: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/30" },
    { title: "Songs", icon: <Music className="w-7 h-7" />, gradient: "from-teal to-cyan-600", bg: "bg-teal/10", count: "2,800+", iconStyle: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/30" },
    { title: "Podcasts", icon: <Mic2 className="w-7 h-7" />, gradient: "from-amber-400 to-orange-500", bg: "bg-amber/10", count: "1,900+", iconStyle: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/30" },
  ];

  return (
    <section ref={ref} className="py-20 lg:py-28 relative">
      <div className="orb orb-3" />
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
        <div
          className={cn(
            "text-center mb-14 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Explore every corner of <span className="text-gradient">pop culture</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Whether you are into blockbuster films, binge-worthy shows, chart-topping hits, or thought-provoking podcasts — we have got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "group glass-card rounded-3xl p-6 text-center transition-all duration-700",
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className={cn(
                  "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-110",
                  item.iconStyle
                )}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-4">{item.count} reviews</p>
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-coral transition-colors">
                Browse {item.title}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
