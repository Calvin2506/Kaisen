export const CATALOG_PLATFORMS = [
  {
    id: "netflix",
    name: "Netflix",
    category: "Entertainment",
    logo: "🎬",
    color: "#E50914",
    website: "https://netflix.com",
    plans: [
      { id: "mobile", name: "Mobile", price: 149, billingCycle: "monthly", quality: "480p", screens: 1, device: "Phone/Tablet only" },
      { id: "basic", name: "Basic", price: 199, billingCycle: "monthly", quality: "720p", screens: 1, device: "Phone/Tablet/TV/Computer" },
      { id: "standard", name: "Standard", price: 499, billingCycle: "monthly", quality: "1080p", screens: 2, device: "All devices" },
      { id: "premium", name: "Premium", price: 649, billingCycle: "monthly", quality: "4K+HDR", screens: 4, device: "All devices" },
    ],
  },
  {
    id: "disney-hotstar",
    name: "Disney+ Hotstar",
    category: "Entertainment",
    logo: "🎭",
    color: "#1C1C1C",
    website: "https://hotstar.com",
    plans: [
      { id: "mobile", name: "Mobile", price: 149, billingCycle: "monthly", quality: "720p", screens: 1, device: "Mobile only", yearlyPrice: 899 },
      { id: "super", name: "Super", price: 299, billingCycle: "monthly", quality: "1080p", screens: 2, device: "All devices", yearlyPrice: 1499 },
      { id: "premium", name: "Premium", price: 499, billingCycle: "monthly", quality: "4K", screens: 4, device: "All devices", yearlyPrice: 2999 },
    ],
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime Video",
    category: "Entertainment",
    logo: "📦",
    color: "#00A8E1",
    website: "https://primevideo.com",
    plans: [
      { id: "monthly", name: "Monthly", price: 299, billingCycle: "monthly", quality: "4K", screens: 3, device: "All devices", includes: "Prime delivery, Prime Music, Prime Reading" },
      { id: "yearly", name: "Yearly", price: 1499, billingCycle: "yearly", quality: "4K", screens: 3, device: "All devices", includes: "Prime delivery, Prime Music, Prime Reading" },
    ],
  },
  {
    id: "jio-cinema",
    name: "JioCinema Premium",
    category: "Entertainment",
    logo: "🎥",
    color: "#0066FF",
    website: "https://jiocinema.com",
    plans: [
      { id: "monthly", name: "Monthly", price: 29, billingCycle: "monthly", quality: "4K", screens: 4, device: "All devices" },
      { id: "yearly", name: "Yearly", price: 299, billingCycle: "yearly", quality: "4K", screens: 4, device: "All devices" },
    ],
  },
  {
    id: "sony-liv",
    name: "SonyLIV",
    category: "Entertainment",
    logo: "📺",
    color: "#E81E25",
    website: "https://sonyliv.com",
    plans: [
      { id: "monthly", name: "Monthly", price: 299, billingCycle: "monthly", quality: "4K", screens: 2, device: "All devices", yearlyPrice: 599 },
      { id: "premium-yearly", name: "Premium Yearly", price: 599, billingCycle: "yearly", quality: "4K", screens: 5, device: "All devices" },
    ],
  },
  {
    id: "ze5",
    name: "ZEE5",
    category: "Entertainment",
    logo: "🎞️",
    color: "#E81E25",
    website: "https://zee5.com",
    plans: [
      { id: "monthly", name: "Monthly", price: 99, billingCycle: "monthly", quality: "1080p", screens: 1, device: "All devices" },
      { id: "yearly", name: "Yearly", price: 699, billingCycle: "yearly", quality: "4K", screens: 5, device: "All devices" },
      { id: "premium", name: "Premium Yearly", price: 1499, billingCycle: "yearly", quality: "4K", screens: 5, device: "All devices", includes: "Global content, Ad-free" },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    category: "Music",
    logo: "🎵",
    color: "#1DB954",
    website: "https://spotify.com",
    plans: [
      { id: "individual", name: "Individual", price: 119, billingCycle: "monthly", quality: "320kbps", screens: 1, device: "All devices", yearlyPrice: 1189 },
      { id: "duo", name: "Duo", price: 149, billingCycle: "monthly", quality: "320kbps", screens: 2, device: "All devices", yearlyPrice: 1489 },
      { id: "family", name: "Family", price: 179, billingCycle: "monthly", quality: "320kbps", screens: 6, device: "All devices", yearlyPrice: 1789 },
      { id: "student", name: "Student", price: 59, billingCycle: "monthly", quality: "320kbps", screens: 1, device: "All devices", yearlyPrice: 589 },
    ],
  },
  {
    id: "apple-music",
    name: "Apple Music",
    category: "Music",
    logo: "🎶",
    color: "#FA233B",
    website: "https://apple.com/music",
    plans: [
      { id: "individual", name: "Individual", price: 99, billingCycle: "monthly", quality: "Lossless", screens: 1, device: "All devices", yearlyPrice: 999 },
      { id: "family", name: "Family", price: 149, billingCycle: "monthly", quality: "Lossless", screens: 6, device: "All devices", yearlyPrice: 1499 },
      { id: "student", name: "Student", price: 49, billingCycle: "monthly", quality: "Lossless", screens: 1, device: "All devices" },
    ],
  },
  {
    id: "gaana",
    name: "Gaana Plus",
    category: "Music",
    logo: "🎧",
    color: "#000000",
    website: "https://gaana.com",
    plans: [
      { id: "monthly", name: "Monthly", price: 99, billingCycle: "monthly", quality: "320kbps", screens: 1, device: "All devices" },
      { id: "yearly", name: "Yearly", price: 399, billingCycle: "yearly", quality: "320kbps", screens: 1, device: "All devices" },
    ],
  },
  {
    id: "wynk",
    name: "Wynk Music",
    category: "Music",
    logo: "🎤",
    color: "#E81E25",
    website: "https://wynk.in",
    plans: [
      { id: "monthly", name: "Monthly", price: 49, billingCycle: "monthly", quality: "320kbps", screens: 1, device: "All devices" },
      { id: "yearly", name: "Yearly", price: 299, billingCycle: "yearly", quality: "320kbps", screens: 1, device: "All devices" },
    ],
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    category: "Entertainment",
    logo: "▶️",
    color: "#FF0000",
    website: "https://youtube.com/premium",
    plans: [
      { id: "individual", name: "Individual", price: 129, billingCycle: "monthly", quality: "4K", screens: 1, device: "All devices", includes: "YouTube Music, Background play, Offline" },
      { id: "family", name: "Family", price: 189, billingCycle: "monthly", quality: "4K", screens: 6, device: "All devices", includes: "YouTube Music, Background play, Offline" },
      { id: "student", name: "Student", price: 79, billingCycle: "monthly", quality: "4K", screens: 1, device: "All devices", includes: "YouTube Music, Background play, Offline" },
    ],
  },
  {
    id: "sun-nxt",
    name: "Sun NXT",
    category: "Entertainment",
    logo: "☀️",
    color: "#FF6B00",
    website: "https://sunnxt.com",
    plans: [
      { id: "monthly", name: "Monthly", price: 50, billingCycle: "monthly", quality: "1080p", screens: 2, device: "All devices" },
      { id: "yearly", name: "Yearly", price: 480, billingCycle: "yearly", quality: "4K", screens: 5, device: "All devices" },
    ],
  },
  {
    id: "ahavideo",
    name: "Aha Video",
    category: "Entertainment",
    logo: "🎬",
    color: "#FF6B00",
    website: "https://aha.video",
    plans: [
      { id: "monthly", name: "Monthly", price: 149, billingCycle: "monthly", quality: "4K", screens: 2, device: "All devices" },
      { id: "yearly", name: "Yearly", price: 699, billingCycle: "yearly", quality: "4K", screens: 4, device: "All devices" },
    ],
  },
  {
    id: "voot",
    name: "Voot Select",
    category: "Entertainment",
    logo: "📺",
    color: "#2E7D32",
    website: "https://voot.com",
    plans: [
      { id: "monthly", name: "Monthly", price: 99, billingCycle: "monthly", quality: "1080p", screens: 2, device: "All devices" },
      { id: "yearly", name: "Yearly", price: 499, billingCycle: "yearly", quality: "4K", screens: 5, device: "All devices" },
    ],
  },
];

export const PLATFORM_CATEGORIES = [
  "Entertainment",
  "Music",
  "Productivity",
  "Health & Fitness",
  "Education",
  "Cloud Storage",
  "Gaming",
  "News",
  "Shopping",
  "Other",
];

export function getPlatformById(id) {
  return CATALOG_PLATFORMS.find(p => p.id === id);
}

export function getPlanById(platformId, planId) {
  const platform = getPlatformById(platformId);
  return platform?.plans.find(p => p.id === planId);
}

export function getAllPlatformNames() {
  return CATALOG_PLATFORMS.map(p => p.name);
}

export function getPlatformsByCategory(category) {
  return CATALOG_PLATFORMS.filter(p => p.category === category);
}

export function startingMonthlyPrice(plans = []) {
  if (!plans.length) return null;
  const monthly = plans.map((plan) =>
    plan.billingCycle === "monthly" ? plan.price : plan.price / 12,
  );
  return Math.round(Math.min(...monthly));
}

export function findPlatformByName(name) {
  const needle = String(name || "").toLowerCase();
  return CATALOG_PLATFORMS.find((platform) => {
    const platformName = platform.name.toLowerCase();
    const platformId = platform.id.replace(/-/g, " ");
    return (
      needle === platformName ||
      needle.includes(platformName) ||
      platformName.includes(needle) ||
      needle.includes(platformId)
    );
  });
}