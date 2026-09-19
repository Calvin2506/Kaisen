import { findPlatformByName } from "@/lib/ott-platforms-india";

export const FREE_ALTERNATIVES = {
  netflix: [
    {
      name: "YouTube",
      reason: "Free movies, trailers, and originals with ads. No subscription required.",
      url: "https://youtube.com",
      icon: "youtube-premium",
    },
    {
      name: "JioCinema (free tier)",
      reason: "Ad-supported TV and films, including a large Hindi and regional library.",
      url: "https://jiocinema.com",
      icon: "jio-cinema",
    },
  ],
  "disney-hotstar": [
    {
      name: "JioCinema (free tier)",
      reason: "Sports clips and a large free catalog if you do not need live premium events.",
      url: "https://jiocinema.com",
      icon: "jio-cinema",
    },
    {
      name: "YouTube",
      reason: "Official clips, recaps, and free shows from many of the same studios.",
      url: "https://youtube.com",
      icon: "youtube-premium",
    },
  ],
  "amazon-prime": [
    {
      name: "YouTube",
      reason: "Plenty of free films and Amazon-published clips without a Prime membership.",
      url: "https://youtube.com",
      icon: "youtube-premium",
    },
  ],
  "jio-cinema": [
    {
      name: "JioCinema free",
      reason: "Keep the free ad-supported library and skip Premium if you rarely use 4K extras.",
      url: "https://jiocinema.com",
      icon: "jio-cinema",
    },
  ],
  "sony-liv": [
    {
      name: "YouTube",
      reason: "Sony and sports highlight channels cover a lot of the same content for free.",
      url: "https://youtube.com",
      icon: "youtube-premium",
    },
  ],
  ze5: [
    {
      name: "ZEE5 free with ads",
      reason: "A large share of serials and films stay available without a paid plan.",
      url: "https://zee5.com",
      icon: "ze5",
    },
  ],
  spotify: [
    {
      name: "YouTube Music / YouTube",
      reason: "Ad-supported listening and official artist uploads at no monthly fee.",
      url: "https://music.youtube.com",
      icon: "youtube-premium",
    },
    {
      name: "Wynk free",
      reason: "Ad-supported tracks if you mainly need background music on mobile.",
      url: "https://wynk.in",
      icon: "wynk",
    },
  ],
  "apple-music": [
    {
      name: "YouTube Music",
      reason: "Free radio-style listening if lossless and offline downloads are not essential.",
      url: "https://music.youtube.com",
      icon: "youtube-premium",
    },
  ],
  gaana: [
    {
      name: "Gaana free",
      reason: "Keep the ad-supported catalog instead of Gaana Plus.",
      url: "https://gaana.com",
      icon: "gaana",
    },
  ],
  wynk: [
    {
      name: "Wynk free",
      reason: "The free tier still covers most playlists with ads.",
      url: "https://wynk.in",
      icon: "wynk",
    },
  ],
  "youtube-premium": [
    {
      name: "YouTube free",
      reason: "Same library with ads if you do not need background play or downloads.",
      url: "https://youtube.com",
      icon: "youtube-premium",
    },
  ],
  "sun-nxt": [
    {
      name: "YouTube",
      reason: "Many Sun TV clips and full episodes appear on official channels.",
      url: "https://youtube.com",
      icon: "youtube-premium",
    },
  ],
  ahavideo: [
    {
      name: "YouTube",
      reason: "Telugu clips and official uploads cover casual viewing without a plan.",
      url: "https://youtube.com",
      icon: "youtube-premium",
    },
  ],
  voot: [
    {
      name: "JioCinema free",
      reason: "Voot catalog largely moved here; the free tier is enough for many shows.",
      url: "https://jiocinema.com",
      icon: "jio-cinema",
    },
  ],
};

export const CARRIER_BUNDLES = [
  {
    carrier: "Airtel",
    planName: "₹279 entertainment add-on",
    price: 279,
    validityDays: 30,
    data: "1 GB total (content add-on)",
    includesIds: ["netflix", "disney-hotstar", "ze5"],
    includesLabels: ["Netflix Basic", "JioHotstar", "ZEE5 Premium", "Xstream Play"],
    claim: "Claim Netflix and ZEE5 in the Airtel Thanks app.",
    url: "https://www.airtel.in/recharge/prepaid",
    icon: "airtel",
  },
  {
    carrier: "Airtel",
    planName: "₹598 entertainment recharge",
    price: 598,
    validityDays: 28,
    data: "2 GB/day + 5G, unlimited calls",
    includesIds: ["netflix", "disney-hotstar", "ze5"],
    includesLabels: ["Netflix Basic", "JioHotstar", "ZEE5 Premium", "Xstream Play"],
    claim: "Recharge in Airtel Thanks, then claim Netflix/ZEE5 in the app.",
    url: "https://www.airtel.in/recharge/prepaid",
    icon: "airtel",
  },
  {
    carrier: "Airtel",
    planName: "₹1,729 84-day entertainment pack",
    price: 1729,
    validityDays: 84,
    data: "2 GB/day + 5G, unlimited calls",
    includesIds: ["netflix", "disney-hotstar", "ze5"],
    includesLabels: ["Netflix Basic", "JioHotstar", "ZEE5 Premium", "Xstream Play"],
    claim: "Best if you already want a 3-month Airtel recharge.",
    url: "https://www.airtel.in/recharge/prepaid",
    icon: "airtel",
  },
  {
    carrier: "Airtel",
    planName: "₹1,798 Netflix + high data",
    price: 1798,
    validityDays: 84,
    data: "3 GB/day + 5G, unlimited calls",
    includesIds: ["netflix"],
    includesLabels: ["Netflix Basic"],
    claim: "Use this if you mainly need Netflix plus a high-data recharge.",
    url: "https://www.airtel.in/recharge/prepaid",
    icon: "airtel",
  },
  {
    carrier: "Jio",
    planName: "Selected Jio Netflix prepaid plans",
    price: 599,
    validityDays: 28,
    data: "Varies by circle — check MyJio",
    includesIds: ["netflix", "jio-cinema", "disney-hotstar"],
    includesLabels: ["Netflix (selected plans)", "JioCinema", "JioHotstar"],
    claim: "Open MyJio → Recharge and filter plans that list Netflix.",
    url: "https://www.jio.com/prepaid",
    icon: "jio",
  },
  {
    carrier: "Vi",
    planName: "Vi entertainment bundles",
    price: 499,
    validityDays: 28,
    data: "Varies by circle",
    includesIds: ["sony-liv", "disney-hotstar", "amazon-prime"],
    includesLabels: ["SonyLIV", "JioHotstar", "Prime Video (selected packs)"],
    claim: "Check the Vi app for the current SonyLIV / Hotstar / Prime combo.",
    url: "https://www.myvi.in/prepaid-recharge-online",
    icon: "vi",
  },
];

function monthlyAmount(sub) {
  const amount = Number(sub.amount) || 0;
  return sub.billingCycle === "yearly" ? amount / 12 : amount;
}

export function buildFreeAlternatives(activeSubs) {
  const items = [];
  for (const sub of activeSubs) {
    const platform = findPlatformByName(sub.name);
    const key = platform?.id;
    const options = (key && FREE_ALTERNATIVES[key]) || [];
    for (const option of options) {
      items.push({
        forSubscription: sub.name,
        forPlatformId: key,
        name: option.name,
        reason: option.reason,
        url: option.url,
        icon: option.icon,
        potentialSavings: Math.round(monthlyAmount(sub)),
      });
    }
  }
  return items;
}

export function buildCarrierBundles(activeSubs) {
  return CARRIER_BUNDLES.map((pack) => {
    const covered = activeSubs.filter((sub) => {
      const platform = findPlatformByName(sub.name);
      return platform && pack.includesIds.includes(platform.id);
    });
    if (covered.length === 0) return null;

    const coveredMonthly = covered.reduce((sum, sub) => sum + monthlyAmount(sub), 0);
    const packMonthly = (pack.price / pack.validityDays) * 30;
    const potentialSavings = Math.max(0, Math.round(coveredMonthly - packMonthly));

    return {
      carrier: pack.carrier,
      planName: pack.planName,
      price: pack.price,
      validityDays: pack.validityDays,
      data: pack.data,
      includes: pack.includesLabels,
      coversSubscriptions: covered.map((sub) => sub.name),
      claim: pack.claim,
      url: pack.url,
      icon: pack.icon,
      potentialSavings,
      description: `This ${pack.carrier} pack includes ${pack.includesLabels.join(", ")}. It covers ${covered.map((s) => s.name).join(", ")} from your stack.`,
    };
  })
    .filter(Boolean)
    .sort((a, b) => b.coversSubscriptions.length - a.coversSubscriptions.length || b.potentialSavings - a.potentialSavings);
}
