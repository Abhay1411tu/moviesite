import { Play } from "lucide-react";

export function Footer() {
  const socialIcons = [
    <svg key="fb" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
    <svg key="x" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    <svg key="ig" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
    <svg key="yt" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.604.246-4.039 2.636-4.078 8.816.039 6.18.474 8.57 4.078 8.816 3.6.245 11.626.246 15.23 0 3.604-.246 4.039-2.636 4.078-8.816-.039-6.18-.474-8.57-4.078-8.816zM9.996 15.005V8.995l6.009 3.005-6.009 3.005z"/></svg>,
  ];

  return (
    <footer className="relative pt-16 pb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-1">
              <a href="#" className="flex items-center gap-2.5 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-coral/85 to-violet/85 text-white shadow-md">
                  <Play className="h-5 w-5 fill-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
                  Pop<span className="text-gradient">Critic</span>
                </span>
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Your modern destination for honest, community-powered reviews of movies, series, songs, and podcasts.
              </p>
              <div className="flex gap-3">
                {socialIcons.map((icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2.5 rounded-xl bg-white/60 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-gray-600 dark:text-gray-300 hover:text-coral transition-colors border border-white/60 dark:border-white/10"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: "Discover", links: ["Top Rated", "New Releases", "Trending", "Hidden Gems", "Awards"] },
              { title: "Categories", links: ["Movies", "Series", "Songs", "Podcasts", "Curator Picks"] },
              { title: "Company", links: ["About Us", "Careers", "Press", "Contact", "Privacy Policy"] },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4">{group.title}</h4>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-coral transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} PopCritic. All rights reserved.</p>
            <div className="flex gap-6">
              {["Terms", "Privacy", "Cookies"].map((link) => (
                <a key={link} href="#" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
