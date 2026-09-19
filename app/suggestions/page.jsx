"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/helpers";
import { Card, CardContent, Badge, Button } from "@/components/ui";
import PageShell, { LoadingScreen } from "@/components/PageShell";
import PlatformIcon from "@/components/PlatformIcon";

const GENERAL_TIPS = [
   {
      icon: "🔍",
      title: "Do a monthly audit",
      desc: "Every month, review all your subscriptions and ask: did I use this enough to justify the cost?",
   },
   {
      icon: "👨‍👩‍👧‍👦",
      title: "Share plans with family",
      desc: "Netflix, Spotify, iCloud and many others offer family plans that are significantly cheaper per person.",
   },
   {
      icon: "⏱️",
      title: "Use free trials wisely",
      desc: "Sign up for free trials when you need a service for a short project, then cancel before billing.",
   },
   {
      icon: "🎓",
      title: "Check student discounts",
      desc: "Spotify, Apple Music, Adobe and many others offer 50%+ discounts for students.",
   },
];

export default function Suggestions() {
   const [subscriptions, setSubscriptions] = useState([]);
   const [aiSuggestions, setAiSuggestions] = useState(null);
   const [loading, setLoading] = useState(true);
   const [aiLoading, setAiLoading] = useState(false);
   const [aiError, setAiError] = useState(null);

   useEffect(() => {
      const fetchSubscriptions = async () => {
         try {
            const res = await fetch("/api/subscriptions");
            const data = await res.json();
            if (Array.isArray(data)) {
               setSubscriptions(data);
            } else {
               console.error("Unexpected response:", data);
               setSubscriptions([]);
            }
         } catch (error) {
            console.error(error);
            setSubscriptions([]);
         } finally {
            setLoading(false);
         }
      };
      fetchSubscriptions();
   }, []);

   const fetchAiSuggestions = async () => {
      if (subscriptions.length === 0) return;
      setAiLoading(true);
      setAiError(null);
      try {
         const res = await fetch("/api/ai-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptions }),
         });
         const data = await res.json();
         if (!res.ok || data.error) {
            setAiError(data.error || "AI suggestions unavailable");
            setAiSuggestions(null);
            return;
         }
         setAiSuggestions(data);
      } catch (err) {
         setAiError(err.message || "AI suggestions failed");
         setAiSuggestions(null);
      } finally {
         setAiLoading(false);
      }
   };

   useEffect(() => {
      if (subscriptions.length > 0 && !aiSuggestions) {
         fetchAiSuggestions();
      }
   }, [subscriptions]);

   const active = subscriptions.filter((s) => s.status === "active");

   if (loading) {
      return <LoadingScreen label="Loading suggestions..." />;
   }

   return (
      <PageShell>
         <div className="max-w-4xl">
            {/* Header */}
            <div className="mb-10">
               <p className="text-blue-300/80 text-xs uppercase tracking-[0.2em] mb-2">
                  Optimize
               </p>
               <div className="flex items-end justify-between gap-4 mb-2">
                  <h1 className="font-serif text-3xl lg:text-4xl text-white tracking-tight">
                     AI Suggestions
                  </h1>
                  <Button
                     variant="secondary"
                     onClick={fetchAiSuggestions}
                     loading={aiLoading}
                     className="gap-2"
                  >
                     <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                     </svg>
                     Refresh AI
                  </Button>
               </div>
               <p className="text-white/35 text-sm">
                  Personalized recommendations to reduce your monthly spend
               </p>
            </div>

            {aiError && (
               <Card className="mb-6 border-red-400/20">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                     <p className="text-red-300 text-sm">
                        AI analysis failed: {aiError}. Showing rule-based tips
                        instead.
                     </p>
                     <Button
                        variant="secondary"
                        size="sm"
                        onClick={fetchAiSuggestions}
                        loading={aiLoading}
                     >
                        Retry
                     </Button>
                  </CardContent>
               </Card>
            )}

            {aiLoading && !aiSuggestions && (
               <Card className="mb-6">
                  <CardContent className="p-8 flex flex-col items-center gap-3">
                     <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                     <p className="text-white/40 text-sm">
                        Analyzing your subscriptions...
                     </p>
                  </CardContent>
               </Card>
            )}

            {/* AI Suggestions */}
            {aiSuggestions &&
               aiSuggestions.suggestions &&
               aiSuggestions.suggestions.length > 0 && (
                  <>
                     {/* Summary Cards */}
                     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <SummaryCard
                           label="Monthly Spend"
                           value={formatCurrency(
                              aiSuggestions.summary.totalMonthlySpend,
                           )}
                           color="red"
                        />
                        <SummaryCard
                           label="Potential Monthly Savings"
                           value={formatCurrency(
                              aiSuggestions.summary.potentialMonthlySavings,
                           )}
                           color="green"
                        />
                        <SummaryCard
                           label="Potential Yearly Savings"
                           value={formatCurrency(
                              aiSuggestions.summary.potentialYearlySavings,
                           )}
                           color="gold"
                        />
                        <SummaryCard
                           label="Top Category"
                           value={aiSuggestions.summary.topCategory || "N/A"}
                           color="blue"
                        />
                     </div>

                     {/* Suggestions List */}
                     <div className="space-y-4 mb-8">
                        {aiSuggestions.suggestions.map((suggestion, index) => (
                           <SuggestionCard
                              key={index}
                              suggestion={suggestion}
                              index={index}
                           />
                        ))}
                     </div>
                  </>
               )}

            {aiSuggestions &&
               aiSuggestions.suggestions &&
               aiSuggestions.suggestions.length === 0 &&
               !(aiSuggestions.freeAlternatives || []).length &&
               !(aiSuggestions.carrierBundles || []).length && (
                  <Card className="mb-6 border-green-400/20" variant="default">
                     <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
                           ✨
                        </div>
                        <h3 className="text-white font-medium mb-2">
                           You're fully optimized!
                        </h3>
                        <p className="text-white/30 text-sm max-w-xs mx-auto">
                           No savings opportunities found. Your subscriptions
                           are well-managed.
                        </p>
                     </CardContent>
                  </Card>
               )}

            {aiError && !aiLoading && !aiSuggestions && active.length > 0 && (
               <RuleBasedSuggestions subscriptions={active} />
            )}

            {active.length === 0 && (
               <Card className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-2xl">
                     📦
                  </div>
                  <h3 className="text-white font-medium mb-2">
                     No subscriptions to analyze
                  </h3>
                  <p className="text-white/30 text-sm mb-6 max-w-xs mx-auto">
                     Add your subscriptions to get personalized money-saving
                     suggestions.
                  </p>
                  <a href="/subscriptions">
                     <Button>Add your first subscription</Button>
                  </a>
               </Card>
            )}

            {(aiSuggestions?.freeAlternatives || []).length > 0 && (
               <section className="mb-8">
                  <div className="mb-4">
                     <p className="text-emerald-300/80 text-xs uppercase tracking-[0.18em] mb-1">
                        No cost
                     </p>
                     <h2 className="text-white text-xl font-medium">Free alternatives</h2>
                     <p className="text-white/40 text-sm mt-1">
                        Options that can replace a paid plan if you do not need the extras.
                     </p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                     {aiSuggestions.freeAlternatives.map((item, index) => (
                        <a
                           key={`${item.forSubscription}-${item.name}-${index}`}
                           href={item.url || "#"}
                           target="_blank"
                           rel="noreferrer"
                           className="card-base p-4 flex gap-3 no-underline hover:-translate-y-0.5"
                        >
                           <PlatformIcon
                              platform={{ id: item.icon || "youtube-premium", name: item.name }}
                              size="sm"
                           />
                           <div className="min-w-0">
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-white/40 text-xs mt-0.5">
                                 Instead of {item.forSubscription}
                              </p>
                              <p className="text-white/55 text-sm mt-2 leading-relaxed">
                                 {item.reason}
                              </p>
                              {item.potentialSavings > 0 && (
                                 <p className="text-emerald-400 text-xs mt-2">
                                    Could save {formatCurrency(item.potentialSavings)}/mo
                                 </p>
                              )}
                           </div>
                        </a>
                     ))}
                  </div>
               </section>
            )}

            {(aiSuggestions?.carrierBundles || []).length > 0 && (
               <section className="mb-8">
                  <div className="mb-4">
                     <p className="text-blue-300/80 text-xs uppercase tracking-[0.18em] mb-1">
                        Recharge packs
                     </p>
                     <h2 className="text-white text-xl font-medium">Carrier bundles</h2>
                     <p className="text-white/40 text-sm mt-1">
                        Airtel, Jio, and Vi plans that already include apps you pay for separately.
                     </p>
                  </div>
                  <div className="space-y-3">
                     {aiSuggestions.carrierBundles.map((pack, index) => (
                        <a
                           key={`${pack.carrier}-${pack.planName}-${index}`}
                           href={pack.url || "#"}
                           target="_blank"
                           rel="noreferrer"
                           className="card-base p-5 block no-underline hover:-translate-y-0.5"
                        >
                           <div className="flex items-start gap-4">
                              <PlatformIcon
                                 platform={{ id: pack.icon || "airtel", name: pack.carrier }}
                                 size="md"
                              />
                              <div className="flex-1 min-w-0">
                                 <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-white font-medium">{pack.planName}</p>
                                    <Badge variant="primary">{pack.carrier}</Badge>
                                 </div>
                                 <p className="text-white/50 text-sm mt-2">{pack.description}</p>
                                 <div className="flex flex-wrap gap-2 mt-3">
                                    {(pack.includes || []).map((label) => (
                                       <Badge key={label} variant="neutral">
                                          {label}
                                       </Badge>
                                    ))}
                                 </div>
                                 <p className="text-white/35 text-xs mt-3">
                                    {pack.data ? `${pack.data} · ` : ""}
                                    {pack.validityDays} days · {pack.claim}
                                 </p>
                              </div>
                              <div className="text-right shrink-0">
                                 <p className="font-serif text-white text-xl">
                                    {formatCurrency(pack.price)}
                                 </p>
                                 {pack.potentialSavings > 0 && (
                                    <p className="text-emerald-400 text-xs mt-1">
                                       Save {formatCurrency(pack.potentialSavings)}/mo
                                    </p>
                                 )}
                              </div>
                           </div>
                        </a>
                     ))}
                  </div>
               </section>
            )}

            {/* General Tips */}
            <Card>
               <div className="px-6 py-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-lg">
                        💪
                     </div>
                     <h2 className="font-medium text-white">General Tips</h2>
                  </div>
               </div>
               <CardContent className="p-6 pt-4">
                  <div className="space-y-4">
                     {GENERAL_TIPS.map((item, index) => (
                        <div
                           key={item.title}
                           className="flex gap-4 p-4 bg-white/3 border border-white/5 rounded-xl animate-slide-up"
                           style={{ animationDelay: `${index * 50}ms` }}
                        >
                           <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-xl flex-shrink-0">
                              {item.icon}
                           </div>
                           <div>
                              <p className="text-white font-medium mb-1">
                                 {item.title}
                              </p>
                              <p className="text-white/35 text-sm leading-relaxed">
                                 {item.desc}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>
      </PageShell>
   );
}

function SummaryCard({ label, value, color }) {
   const colors = {
      red: "from-red-500/20",
      green: "from-emerald-500/20",
      gold: "from-amber-500/20",
      blue: "from-blue-500/20",
   };
   return (
      <div className={`rounded-2xl border border-white/8 bg-gradient-to-br ${colors[color]} to-transparent p-4 animate-slide-up`}>
         <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
         <p className="font-serif text-xl text-white mt-2">{value}</p>
      </div>
   );
}

function SuggestionCard({ suggestion, index }) {
   const priorityColors = {
      high: "border-red-400/30 bg-red-500/5",
      medium: "border-yellow-400/30 bg-yellow-500/5",
      low: "border-blue-400/30 bg-blue-500/5",
   };
   const priorityIcons = { high: "🔴", medium: "🟡", low: "🔵" };
   const typeIcons = {
      duplicate: "🔄",
      yearly_savings: "📅",
      free_alternative: "🆓",
      unused: "💤",
      price_alert: "📈",
      bundle_opportunity: "📦",
   };

   return (
      <Card
         variant="default"
         className={`p-5 relative overflow-hidden animate-slide-up ${priorityColors[suggestion.priority] || ""}`}
      style={{ animationDelay: `${index * 70}ms` }}
      >
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
         <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
               <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                     backgroundColor: priorityColors[
                        suggestion.priority
                     ].includes("red")
                        ? "rgba(239,68,68,0.1)"
                        : priorityColors[suggestion.priority].includes("yellow")
                          ? "rgba(234,179,8,0.1)"
                          : "rgba(59,130,246,0.1)",
                  }}
               >
                  {typeIcons[suggestion.type] || "💡"}
               </div>
               <div>
                  <div className="flex items-center gap-3 mb-2">
                     <h3 className="text-white font-semibold text-lg">
                        {suggestion.title}
                     </h3>
                     <Badge
                        variant={
                           suggestion.priority === "high"
                              ? "error"
                              : suggestion.priority === "medium"
                                ? "warning"
                                : "info"
                        }
                        className="text-xs"
                     >
                        {(suggestion.priority || "medium").toUpperCase()}
                     </Badge>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-3">
                     {suggestion.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                     {(suggestion.actionItems || []).map((action, i) => (
                        <Badge
                           key={i}
                           variant="primary"
                           className="text-xs gap-1"
                           style={{
                              backgroundColor: "rgba(59,130,246,0.15)",
                              borderColor: "rgba(59,130,246,0.3)",
                           }}
                        >
                           {action}
                        </Badge>
                     ))}
                  </div>
               </div>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
               {suggestion.potentialSavings > 0 && (
                  <>
                     <p className="text-green-400 font-bold text-lg">
                        Save {formatCurrency(suggestion.potentialSavings)}
                     </p>
                     <p className="text-white/30 text-xs">
                        per {suggestion.savingsPeriod}
                     </p>
                  </>
               )}
               {suggestion.affectedSubscriptions &&
                  suggestion.affectedSubscriptions.length > 0 && (
                     <p className="text-white/30 text-xs max-w-xs">
                        Affects: {suggestion.affectedSubscriptions.join(", ")}
                     </p>
                  )}
            </div>
         </div>
      </Card>
   );
}

function RuleBasedSuggestions({ subscriptions }) {
   const active = subscriptions.filter((s) => s.status === "active");
   const suggestions = [];

   // Duplicate categories
   const categoryCount = {};
   active.forEach((s) => {
      categoryCount[s.category] = (categoryCount[s.category] || 0) + 1;
   });
   Object.entries(categoryCount)
      .filter(([_, count]) => count > 1)
      .forEach(([category, count]) => {
         const subs = active.filter((s) => s.category === category);
         const monthlyTotal = subs.reduce(
            (sum, s) =>
               sum + (s.billingCycle === "monthly" ? s.amount : s.amount / 12),
            0,
         );
         suggestions.push({
            type: "duplicate",
            title: `Multiple ${category} Subscriptions`,
            description: `You have ${count} active ${category} subscriptions costing ${formatCurrency(monthlyTotal)}/month. Consider keeping only the most used one.`,
            potentialSavings: monthlyTotal * 0.5,
            savingsPeriod: "monthly",
            priority: "high",
            actionItems: [
               "Review usage of each service",
               "Cancel the least used",
               "Consider family sharing",
            ],
            affectedSubscriptions: subs.map((s) => s.name),
         });
      });

   // Yearly savings
   const monthlySubs = active.filter((s) => s.billingCycle === "monthly");
   if (monthlySubs.length > 0) {
      const yearlySavings = monthlySubs.reduce(
         (sum, s) => sum + s.amount * 12 * 0.2,
         0,
      );
      suggestions.push({
         type: "yearly_savings",
         title: "Switch to Yearly Plans",
         description: `${monthlySubs.length} monthly subscriptions could save ~20% by switching to yearly billing.`,
         potentialSavings: yearlySavings,
         savingsPeriod: "yearly",
         priority: "high",
         actionItems: [
            "Check yearly pricing for each",
            "Switch high-cost monthly plans first",
         ],
         affectedSubscriptions: monthlySubs.map((s) => s.name),
      });
   }

   // Unused (old subscriptions)
   const oldSubs = active.filter((s) => {
      const start = new Date(s.startDate);
      const monthsSinceStart =
         (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsSinceStart > 6;
   });
   if (oldSubs.length > 0) {
      suggestions.push({
         type: "unused",
         title: "Review Long-running Subscriptions",
         description: `${oldSubs.length} subscriptions active for 6+ months. Verify you still use them regularly.`,
         potentialSavings:
            oldSubs.reduce(
               (sum, s) =>
                  sum +
                  (s.billingCycle === "monthly" ? s.amount : s.amount / 12),
               0,
            ) * 0.3,
         savingsPeriod: "monthly",
         priority: "medium",
         actionItems: [
            "Check last usage date",
            "Pause unused services",
            "Set calendar reminders to review",
         ],
         affectedSubscriptions: oldSubs.map((s) => s.name),
      });
   }

   if (suggestions.length === 0) {
      return (
         <Card className="p-8 text-center border-green-400/20">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4 text-2xl">
               ✨
            </div>
            <h3 className="text-white font-medium mb-2">
               No obvious savings found
            </h3>
            <p className="text-white/30 text-sm">
               Your subscriptions look well-managed. Click "Refresh AI" for
               deeper analysis.
            </p>
         </Card>
      );
   }

   return (
      <div className="space-y-4 mb-8">
         <p className="text-white/40 text-sm mb-4">
            Rule-based analysis (click Refresh AI for smarter suggestions):
         </p>
         {suggestions.map((s, i) => (
            <SuggestionCard key={i} suggestion={s} index={i} />
         ))}
      </div>
   );
}
