import Groq from "groq-sdk";
import { CATALOG_PLATFORMS } from "@/lib/ott-platforms-india";

const GROQ_MODELS = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
];

const SYSTEM_PROMPT = `You are a subscription optimization expert. Analyze the user's subscriptions and provide personalized, actionable suggestions to save money.

Return ONLY valid JSON in this exact format:
{
  "suggestions": [
    {
      "type": "duplicate" | "yearly_savings" | "free_alternative" | "unused" | "price_alert" | "bundle_opportunity",
      "title": "Short catchy title",
      "description": "Detailed explanation with numbers",
      "potentialSavings": number,
      "savingsPeriod": "monthly" | "yearly",
      "priority": "high" | "medium" | "low",
      "actionItems": ["Specific action 1", "Specific action 2"],
      "affectedSubscriptions": ["subscription name 1", "subscription name 2"]
    }
  ],
  "summary": {
    "totalMonthlySpend": number,
    "totalYearlySpend": number,
    "potentialMonthlySavings": number,
    "potentialYearlySavings": number,
    "topCategory": "category name",
    "topCategorySpend": number
  }
}

Rules:
- Only suggest REAL alternatives from the provided catalog
- Calculate savings accurately using catalog prices
- Flag duplicates in the same category
- Suggest yearly plans when monthly is used and yearly is cheaper
- Identify unused subscriptions (paused/cancelled or old start date)
- Be specific with currency amounts
- Keep suggestions practical and actionable
- Prioritize high-impact savings first
- If there are no savings ideas, return an empty suggestions array and still fill summary`;

function monthlyAmount(sub) {
  const amount = Number(sub.amount) || 0;
  return sub.billingCycle === "yearly" ? amount / 12 : amount;
}

function catalogSnapshot() {
  return CATALOG_PLATFORMS.map((platform) => ({
    name: platform.name,
    category: platform.category,
    plans: platform.plans.map((plan) => ({
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
      yearlyPrice: plan.yearlyPrice || null,
    })),
  }));
}

function emptySummary() {
  return {
    totalMonthlySpend: 0,
    totalYearlySpend: 0,
    potentialMonthlySavings: 0,
    potentialYearlySavings: 0,
    topCategory: null,
    topCategorySpend: 0,
  };
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function summarize(subs, suggestions) {
  const monthlyByCategory = {};
  let totalMonthlySpend = 0;

  for (const sub of subs) {
    const monthly = monthlyAmount(sub);
    totalMonthlySpend += monthly;
    monthlyByCategory[sub.category] =
      (monthlyByCategory[sub.category] || 0) + monthly;
  }

  const topCategory = Object.entries(monthlyByCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const potentialMonthlySavings = suggestions.reduce((sum, suggestion) => {
    const value = Number(suggestion.potentialSavings) || 0;
    return sum + (suggestion.savingsPeriod === "yearly" ? value / 12 : value);
  }, 0);

  return {
    totalMonthlySpend: round2(totalMonthlySpend),
    totalYearlySpend: round2(totalMonthlySpend * 12),
    potentialMonthlySavings: round2(potentialMonthlySavings),
    potentialYearlySavings: round2(potentialMonthlySavings * 12),
    topCategory: topCategory?.[0] || null,
    topCategorySpend: round2(topCategory?.[1] || 0),
  };
}

function parseAiJson(text) {
  if (!text) return null;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed || !Array.isArray(parsed.suggestions)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function normalizePayload(parsed, activeSubs) {
  const suggestions = (parsed.suggestions || []).map((suggestion) => ({
    type: suggestion.type || "price_alert",
    title: suggestion.title || "Optimization idea",
    description: suggestion.description || "",
    potentialSavings: Number(suggestion.potentialSavings) || 0,
    savingsPeriod: suggestion.savingsPeriod === "yearly" ? "yearly" : "monthly",
    priority: ["high", "medium", "low"].includes(suggestion.priority)
      ? suggestion.priority
      : "medium",
    actionItems: Array.isArray(suggestion.actionItems)
      ? suggestion.actionItems
      : [],
    affectedSubscriptions: Array.isArray(suggestion.affectedSubscriptions)
      ? suggestion.affectedSubscriptions
      : [],
  }));

  return {
    suggestions,
    summary: {
      ...emptySummary(),
      ...(parsed.summary || {}),
      ...summarize(activeSubs, suggestions),
    },
  };
}

function findPlatform(name) {
  const needle = String(name || "").toLowerCase();
  return CATALOG_PLATFORMS.find((platform) => {
    const platformName = platform.name.toLowerCase();
    const platformId = platform.id.replace(/-/g, " ");
    return (
      needle.includes(platformName) ||
      platformName.includes(needle) ||
      needle.includes(platformId)
    );
  });
}

function cheapestMonthlyPlan(platform) {
  const monthlyPlans = platform.plans.filter(
    (plan) => plan.billingCycle === "monthly",
  );
  if (monthlyPlans.length === 0) return null;
  return monthlyPlans.reduce((best, plan) =>
    plan.price < best.price ? plan : best,
  );
}

function yearlyOption(platform, currentMonthly) {
  const yearlyPlans = platform.plans.filter(
    (plan) => plan.billingCycle === "yearly",
  );
  const withYearlyPrice = platform.plans
    .map((plan) => {
      if (plan.yearlyPrice) {
        return { name: `${plan.name} Yearly`, price: plan.yearlyPrice };
      }
      if (plan.billingCycle === "yearly") {
        return { name: plan.name, price: plan.price };
      }
      return null;
    })
    .filter(Boolean);

  const options = [...yearlyPlans.map((plan) => ({ name: plan.name, price: plan.price })), ...withYearlyPrice];
  if (options.length === 0) return null;

  const best = options.reduce((min, plan) =>
    plan.price < min.price ? plan : min,
  );
  const monthlyEquivalent = best.price / 12;
  const savings = currentMonthly - monthlyEquivalent;
  if (savings < 10) return null;
  return { ...best, monthlyEquivalent, savings };
}

function buildCatalogSuggestions(activeSubs) {
  const suggestions = [];

  const categoryGroups = {};
  for (const sub of activeSubs) {
    const key = sub.category || "Other";
    categoryGroups[key] = categoryGroups[key] || [];
    categoryGroups[key].push(sub);
  }

  for (const [category, subs] of Object.entries(categoryGroups)) {
    if (subs.length < 2) continue;
    const monthlyTotal = subs.reduce((sum, sub) => sum + monthlyAmount(sub), 0);
    suggestions.push({
      type: "duplicate",
      title: `Multiple ${category} subscriptions`,
      description: `You have ${subs.length} active ${category} services costing about ₹${round2(monthlyTotal)}/month. Keeping the one you actually use would cut overlap.`,
      potentialSavings: round2(monthlyTotal * 0.5),
      savingsPeriod: "monthly",
      priority: "high",
      actionItems: [
        `Compare usage across ${subs.map((s) => s.name).join(", ")}`,
        "Cancel the least-used service before the next billing date",
      ],
      affectedSubscriptions: subs.map((s) => s.name),
    });
  }

  for (const sub of activeSubs) {
    const platform = findPlatform(sub.name);
    if (!platform) continue;
    const currentMonthly = monthlyAmount(sub);

    if (sub.billingCycle === "monthly") {
      const yearly = yearlyOption(platform, currentMonthly);
      if (yearly) {
        suggestions.push({
          type: "yearly_savings",
          title: `Switch ${platform.name} to yearly`,
          description: `${platform.name} ${yearly.name} is ₹${yearly.price}/year (₹${round2(yearly.monthlyEquivalent)}/month) vs your current ₹${round2(currentMonthly)}/month. That saves about ₹${round2(yearly.savings)} every month.`,
          potentialSavings: round2(yearly.savings),
          savingsPeriod: "monthly",
          priority: yearly.savings > 50 ? "high" : "medium",
          actionItems: [
            `Open ${platform.name} billing and choose ${yearly.name}`,
            "Cancel monthly auto-renew after the yearly plan starts",
          ],
          affectedSubscriptions: [sub.name],
        });
      }
    }

    const cheapest = cheapestMonthlyPlan(platform);
    if (cheapest && currentMonthly - cheapest.price > 30) {
      suggestions.push({
        type: "price_alert",
        title: `Cheaper ${platform.name} plan available`,
        description: `You pay about ₹${round2(currentMonthly)}/month. ${platform.name} ${cheapest.name} is ₹${cheapest.price}/month, saving ₹${round2(currentMonthly - cheapest.price)} if the cheaper plan still covers your needs.`,
        potentialSavings: round2(currentMonthly - cheapest.price),
        savingsPeriod: "monthly",
        priority: "medium",
        actionItems: [
          `Check if ${cheapest.name} quality/screens are enough`,
          `Downgrade ${platform.name} before the next renewal`,
        ],
        affectedSubscriptions: [sub.name],
      });
    }
  }

  const oldSubs = activeSubs.filter((sub) => {
    if (!sub.startDate) return false;
    const months =
      (Date.now() - new Date(sub.startDate).getTime()) /
      (1000 * 60 * 60 * 24 * 30);
    return months > 6;
  });
  if (oldSubs.length > 0) {
    suggestions.push({
      type: "unused",
      title: "Review long-running subscriptions",
      description: `${oldSubs.length} subscription${oldSubs.length === 1 ? " has" : "s have"} been active for 6+ months. Confirm you still use ${oldSubs.map((s) => s.name).join(", ")} regularly.`,
      potentialSavings: round2(
        oldSubs.reduce((sum, sub) => sum + monthlyAmount(sub), 0) * 0.3,
      ),
      savingsPeriod: "monthly",
      priority: "low",
      actionItems: [
        "Check last watch/listen date on each service",
        "Pause anything unused before the next billing cycle",
      ],
      affectedSubscriptions: oldSubs.map((s) => s.name),
    });
  }

  const unique = [];
  const seen = new Set();
  for (const suggestion of suggestions) {
    const key = `${suggestion.type}:${suggestion.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(suggestion);
  }

  return normalizePayload({ suggestions: unique }, activeSubs);
}

function buildMessages(subsForAI) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Analyze these subscriptions and provide optimization suggestions.

Subscriptions:
${JSON.stringify(subsForAI, null, 2)}

Service catalog (use these prices):
${JSON.stringify(catalogSnapshot(), null, 2)}

Use the catalog for realistic plan comparisons and keep amounts in the user's currency.`,
    },
  ];
}

async function generateWithGroq(groq, subsForAI) {
  const messages = buildMessages(subsForAI);
  let lastError = new Error("All Groq models failed");

  for (const model of GROQ_MODELS) {
    try {
      const completion = await groq.chat.completions.create({
        model,
        temperature: 0.2,
        max_completion_tokens: 2500,
        response_format: { type: "json_object" },
        messages,
      });
      const parsed = parseAiJson(completion.choices?.[0]?.message?.content);
      if (parsed) return parsed;
      lastError = new Error(`Invalid JSON from ${model}`);
    } catch (error) {
      lastError = error;
      console.warn(`Groq model ${model} failed:`, error.message);
    }
  }

  throw lastError;
}

export async function POST(req) {
  try {
    const { subscriptions } = await req.json();

    if (!subscriptions || !Array.isArray(subscriptions)) {
      return Response.json(
        { error: "Invalid subscriptions data" },
        { status: 400 },
      );
    }

    const activeSubs = subscriptions.filter((s) => s.status === "active");

    if (activeSubs.length === 0) {
      return Response.json({
        suggestions: [],
        summary: emptySummary(),
      });
    }

    const subsForAI = activeSubs.map((s) => ({
      name: s.name,
      amount: s.amount,
      currency: s.currency || "INR",
      billingCycle: s.billingCycle,
      category: s.category,
      startDate: s.startDate,
      nextPayDate: s.nextPayDate,
      status: s.status,
    }));

    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groq = new Groq({ apiKey: groqKey });
        const parsed = await generateWithGroq(groq, subsForAI);
        return Response.json(normalizePayload(parsed, activeSubs));
      } catch (error) {
        console.error("Groq unavailable, using catalog fallback:", error);
      }
    } else {
      console.warn("No GROQ_API_KEY configured, using catalog fallback");
    }

    return Response.json(buildCatalogSuggestions(activeSubs));
  } catch (error) {
    console.error("AI Suggestions Error:", error);
    return Response.json(buildCatalogSuggestions([]));
  }
}
