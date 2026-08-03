import json

with open('100_reviews.json', 'r', encoding='utf-8') as f:
    items = json.load(f)

header = '''import type { Review, EditorialCollection, LeaderboardItem } from "../types";

const netflix = { provider: "Netflix", type: "Stream", quality: "4K UHD", url: "https://netflix.com" };
const hbo = { provider: "HBO Max", type: "Stream", quality: "4K UHD", url: "https://max.com" };
const prime = { provider: "Amazon Prime", type: "Stream / Rent", quality: "4K UHD", url: "https://primevideo.com" };
const appleTv = { provider: "Apple TV+", type: "Stream", quality: "4K UHD", url: "https://tv.apple.com" };
const disney = { provider: "Disney+", type: "Stream", quality: "4K UHD", url: "https://disneyplus.com" };
const hulu = { provider: "Hulu", type: "Stream", quality: "HD", url: "https://hulu.com" };
const peacock = { provider: "Peacock", type: "Stream", quality: "HD", url: "https://peacocktv.com" };
const paramount = { provider: "Paramount+", type: "Stream", quality: "4K UHD", url: "https://paramountplus.com" };

const spotify = { provider: "Spotify", type: "Stream", quality: "Lossless", url: "https://spotify.com" };
const appleMusic = { provider: "Apple Music", type: "Stream", quality: "Hi-Res Lossless", url: "https://music.apple.com" };
const youtubeMusic = { provider: "YouTube Music", type: "Stream", quality: "HD", url: "https://music.youtube.com" };
const youtube = { provider: "YouTube", type: "Stream", quality: "1080p", url: "https://youtube.com" };

'''

offer_map = {
    'netflix': 'netflix',
    'hbo': 'hbo',
    'prime': 'prime',
    'appleTv': 'appleTv',
    'disney': 'disney',
    'hulu': 'hulu',
    'peacock': 'peacock',
    'paramount': 'paramount',
    'spotify': 'spotify',
    'appleMusic': 'appleMusic',
    'youtubeMusic': 'youtubeMusic',
    'youtube': 'youtube'
}

ts_content = header + 'export const REVIEWS: Review[] = [\n'
for item in items:
    offers_str = ', '.join([offer_map.get(o, 'netflix') for o in item['streamingOffers']])
    tags_str = ', '.join([f'"{t}"' for t in item['tags']])
    cast_str = ', '.join([f'"{c}"' for c in item['cast']])
    
    title_esc = item['title'].replace('"', '\\"')
    creator_esc = item['creator'].replace('"', '\\"')
    excerpt_esc = item['excerpt'].replace('"', '\\"')
    desc_esc = item['description'].replace('"', '\\"')

    ts_content += f'''  {{
    id: {item['id']},
    title: "{title_esc}",
    category: "{item['category']}",
    creator: "{creator_esc}",
    year: {item['year']},
    rating: {item['rating']},
    audienceRating: {item['audienceRating']},
    coverColor: "{item['coverColor']}",
    tags: [{tags_str}],
    excerpt: "{excerpt_esc}",
    description: "{desc_esc}",
    duration: "{item['duration']}",
    platform: "{item['platform']}",
    cast: [{cast_str}],
    trailerUrl: "{item['trailerUrl']}",
    streamingOffers: [{offers_str}],
    imageUrl: "{item['imageUrl']}",
  }},\n'''

ts_content += '];\n\n'

ts_content += '''export const YEARS = ["All", "2024", "2023", "2022", "2021", "2020", "2019", "2014", "2010", "2008", "2001", "1994"];
export const PLATFORMS = ["All", "HBO Max", "Netflix", "Apple TV+", "Hulu", "Disney+", "Paramount+", "Peacock", "Amazon Prime", "Spotify", "Apple Music"];
export const GENRES = ["All", "Sci-Fi", "Drama", "Comedy", "Action", "Animation", "Thriller", "Crime", "Hip-Hop", "Pop", "R&B", "True Crime", "Science", "Business", "News"];

export const COLLECTIONS: EditorialCollection[] = [
  {
    id: 1,
    title: "Cinema Masterpieces",
    subtitle: "Visually stunning cinematic gems demanding to be seen on the big screen",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
    reviewIds: [1, 2, 5, 7],
    gradient: "from-coral to-rose-400",
  },
  {
    id: 2,
    title: "Peak TV Drama & Thrillers",
    subtitle: "Addictive multi-season TV shows that defined peak television",
    coverImage: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?q=80&w=1000&auto=format&fit=crop",
    reviewIds: [26, 27, 30, 31],
    gradient: "from-violet to-purple-500",
  },
  {
    id: 3,
    title: "Global Chart Toppers",
    subtitle: "Infectious tracks and radio hits defining modern music culture",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop",
    reviewIds: [51, 52, 53, 55],
    gradient: "from-rose-400 to-orange-400",
  },
  {
    id: 4,
    title: "Mind-Expanding Audio",
    subtitle: "Fascinating podcasts on science, human behavior, and investigative true crime",
    coverImage: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop",
    reviewIds: [76, 77, 78, 79],
    gradient: "from-teal to-cyan-500",
  },
];

export const LEADERBOARD: LeaderboardItem[] = [
  { rank: 1, title: "The Bear", category: "Series", rating: 4.9, reviews: 24800, change: "same" },
  { rank: 2, title: "Dune: Part Two", category: "Movies", rating: 4.8, reviews: 31200, change: "up" },
  { rank: 3, title: "Arcane", category: "Series", rating: 4.9, reviews: 21500, change: "up" },
  { rank: 4, title: "Breaking Bad", category: "Series", rating: 4.9, reviews: 45000, change: "same" },
  { rank: 5, title: "Not Like Us", category: "Songs", rating: 4.7, reviews: 42100, change: "up" },
  { rank: 6, title: "Good Luck, Babe!", category: "Songs", rating: 4.8, reviews: 19800, change: "up" },
  { rank: 7, title: "Shogun", category: "Series", rating: 4.9, reviews: 18900, change: "same" },
  { rank: 8, title: "Severance", category: "Series", rating: 4.8, reviews: 17400, change: "same" },
  { rank: 9, title: "Huberman Lab", category: "Podcasts", rating: 4.6, reviews: 15600, change: "down" },
  { rank: 10, title: "Oppenheimer", category: "Movies", rating: 4.7, reviews: 28900, change: "down" },
];
'''

with open('src/data/reviews.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print('Successfully updated src/data/reviews.ts with 100 items!')
