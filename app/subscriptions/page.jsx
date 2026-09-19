"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency, getDaysUntilRenewal } from "@/lib/helpers";
import { Card, Badge, Modal, Button, Input, Select, Textarea } from "@/components/ui";
import PageShell from "@/components/PageShell";
import {
   CATALOG_PLATFORMS,
   startingMonthlyPrice,
   findPlatformByName,
} from "@/lib/ott-platforms-india";

const CATEGORIES = [
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

const CURRENCIES = [
   { value: "INR", label: "INR (₹)" },
   { value: "USD", label: "USD ($)" },
   { value: "EUR", label: "EUR (€)" },
   { value: "GBP", label: "GBP (£)" },
];

const BILLING_CYCLES = [
   { value: "monthly", label: "Monthly" },
   { value: "yearly", label: "Yearly" },
];

const STATUS_OPTIONS = [
   { value: "active", label: "Active" },
   { value: "paused", label: "Paused" },
   { value: "cancelled", label: "Cancelled" },
];

const MANUAL_PLATFORM = {
   id: "manual",
   name: "Custom service",
   category: "Other",
   logo: "✦",
   color: "#818cf8",
   website: "",
   plans: [],
};

const emptyForm = {
   name: "",
   amount: "",
   currency: "INR",
   billingCycle: "monthly",
   startDate: "",
   category: "",
   website: "",
   notes: "",
   status: "active",
};

export default function SubscriptionsPage() {
   const [subscriptions, setSubscriptions] = useState([]);
   const [editing, setEditing] = useState(null);
   const [selectedPlatform, setSelectedPlatform] = useState(null);
   const [selectedPlan, setSelectedPlan] = useState(null);
   const [formData, setFormData] = useState(emptyForm);
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({});
   const [platformSearch, setPlatformSearch] = useState("");
   const [activeCategory, setActiveCategory] = useState("All");

   const fetchSubscriptions = async () => {
      const res = await fetch("/api/subscriptions");
      const data = await res.json();
      if (Array.isArray(data)) setSubscriptions(data);
   };

   useEffect(() => {
      fetchSubscriptions();
   }, []);

   const resetForm = () => {
      setFormData({
         ...emptyForm,
         startDate: new Date().toISOString().split("T")[0],
      });
      setErrors({});
      setSelectedPlatform(null);
      setSelectedPlan(null);
      setEditing(null);
   };

   const openEdit = (sub) => {
      setEditing(sub);
      setSelectedPlatform(null);
      setSelectedPlan(null);
      setFormData({
         name: sub.name,
         amount: sub.amount,
         currency: sub.currency,
         billingCycle: sub.billingCycle,
         startDate: new Date(sub.startDate).toISOString().split("T")[0],
         category: sub.category,
         website: sub.website || "",
         notes: sub.notes || "",
         status: sub.status,
      });
   };

   const handlePlatformSelect = (platform) => {
      setEditing(null);
      setSelectedPlatform(platform);
      setSelectedPlan(null);
      setFormData((prev) => ({
         ...prev,
         name: platform.id === "manual" ? "" : platform.name,
         category: platform.category,
         website: platform.website,
         currency: "INR",
         amount: "",
         billingCycle: "monthly",
         startDate: prev.startDate || new Date().toISOString().split("T")[0],
      }));
   };

   const handlePlanSelect = (plan) => {
      setSelectedPlan(plan);
      const yearlyPrice =
         plan.yearlyPrice ||
         (plan.billingCycle === "yearly"
            ? plan.price
            : Math.round(plan.price * 12 * 0.8));
      setFormData((prev) => ({
         ...prev,
         amount: plan.billingCycle === "yearly" ? yearlyPrice : plan.price,
         billingCycle: plan.billingCycle,
      }));
   };

   const validateForm = () => {
      const newErrors = {};
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.amount) newErrors.amount = "Amount is required";
      if (!formData.billingCycle) newErrors.billingCycle = "Billing cycle is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      setLoading(true);
      try {
         if (editing) {
            await fetch(`/api/subscriptions/${editing.id}`, {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(formData),
            });
         } else {
            await fetch("/api/subscriptions", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify(formData),
            });
         }
         resetForm();
         fetchSubscriptions();
      } catch (error) {
         console.error("Failed to save", error);
      } finally {
         setLoading(false);
      }
   };

   const handleDelete = async (id) => {
      if (!confirm("Delete this subscription?")) return;
      await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
   };

   const catalogCategories = useMemo(() => {
      const set = new Set(CATALOG_PLATFORMS.map((p) => p.category));
      return ["All", ...Array.from(set)];
   }, []);

   const filteredPlatforms = useMemo(() => {
      const query = platformSearch.trim().toLowerCase();
      return CATALOG_PLATFORMS.filter((platform) => {
         const matchesCategory =
            activeCategory === "All" || platform.category === activeCategory;
         const matchesQuery =
            !query ||
            platform.name.toLowerCase().includes(query) ||
            platform.category.toLowerCase().includes(query);
         return matchesCategory && matchesQuery;
      });
   }, [platformSearch, activeCategory]);

   const activeSubs = subscriptions.filter((s) => s.status === "active");
   const totalMonthly = activeSubs.reduce(
      (sum, s) =>
         sum + (s.billingCycle === "monthly" ? s.amount : s.amount / 12),
      0,
   );

   return (
      <PageShell>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
               <div>
                  <p className="text-blue-300/80 text-xs uppercase tracking-[0.2em] mb-2">
                     Your stack
                  </p>
                  <h1 className="font-serif text-3xl lg:text-4xl text-white tracking-tight">
                     Subscriptions
                  </h1>
                  <p className="text-white/40 text-sm mt-2 max-w-xl">
                     Browse popular services, add what you actually pay for, and keep
                     renewals in one place.
                  </p>
               </div>
               <Button onClick={() => handlePlatformSelect(MANUAL_PLATFORM)} className="gap-2 self-start">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add custom
               </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
               <StatCard label="Tracked" value={subscriptions.length} hint="all services" />
               <StatCard label="Active" value={activeSubs.length} hint="currently billing" accent="green" />
               <StatCard
                  label="Monthly"
                  value={formatCurrency(totalMonthly)}
                  hint="active spend"
                  accent="blue"
               />
               <StatCard
                  label="Yearly"
                  value={formatCurrency(totalMonthly * 12)}
                  hint="projected"
                  accent="gold"
               />
            </div>

            <section className="mb-12">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div>
                     <h2 className="text-white text-lg font-medium">Add from catalog</h2>
                     <p className="text-white/35 text-sm">
                        Tap a platform, pick a plan, and start tracking.
                     </p>
                  </div>
                  <div className="relative w-full md:max-w-sm">
                     <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                     </svg>
                     <input
                        value={platformSearch}
                        onChange={(e) => setPlatformSearch(e.target.value)}
                        placeholder="Search Netflix, Spotify, iCloud..."
                        className="input-base pl-11 h-11"
                     />
                  </div>
               </div>

               <div className="flex gap-2 overflow-x-auto pb-3 mb-5 scrollbar-thin">
                  {catalogCategories.map((category) => {
                     const selected = activeCategory === category;
                     return (
                        <button
                           key={category}
                           onClick={() => setActiveCategory(category)}
                           className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm transition-all ${
                              selected
                                 ? "bg-white text-slate-900 font-medium"
                                 : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-white/8"
                           }`}
                        >
                           {category}
                        </button>
                     );
                  })}
               </div>

               {filteredPlatforms.length === 0 ? (
                  <Card className="p-10 text-center">
                     <p className="text-white/50">No platforms match that search.</p>
                  </Card>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                     {filteredPlatforms.map((platform) => (
                        <PlatformCard
                           key={platform.id}
                           platform={platform}
                           isSelected={selectedPlatform?.id === platform.id}
                           onClick={() => handlePlatformSelect(platform)}
                        />
                     ))}
                  </div>
               )}

               {selectedPlatform && (
                  <div className="mt-6">
                     <PlanSelector
                        platform={selectedPlatform}
                        selectedPlan={selectedPlan}
                        onPlanSelect={handlePlanSelect}
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                        onSubmit={handleSubmit}
                        loading={loading}
                        editing={editing}
                        onClose={resetForm}
                     />
                  </div>
               )}
            </section>

            <section>
               <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-white text-lg font-medium">Your subscriptions</h2>
                  <Badge variant="neutral">
                     {subscriptions.length} tracked · {activeSubs.length} active
                  </Badge>
               </div>

               {subscriptions.length === 0 ? (
                  <Card className="p-12 text-center">
                     <p className="text-white/40 text-sm max-w-sm mx-auto">
                        Nothing tracked yet. Choose a platform above or add a custom
                        service to get started.
                     </p>
                  </Card>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                     {subscriptions.map((sub) => (
                        <TrackedCard
                           key={sub.id}
                           subscription={sub}
                           onEdit={openEdit}
                           onDelete={handleDelete}
                        />
                     ))}
                  </div>
               )}
            </section>

         <Modal
            isOpen={Boolean(editing)}
            onClose={resetForm}
            title={`Edit ${editing?.name || "subscription"}`}
            size="lg"
         >
            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                     label="Name"
                     name="name"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     error={errors.name}
                  />
                  <Input
                     label="Amount"
                     name="amount"
                     type="number"
                     step="0.01"
                     value={formData.amount}
                     onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                     error={errors.amount}
                  />
                  <Select
                     label="Currency"
                     name="currency"
                     value={formData.currency}
                     onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                     options={CURRENCIES}
                  />
                  <Select
                     label="Billing cycle"
                     name="billingCycle"
                     value={formData.billingCycle}
                     onChange={(e) =>
                        setFormData({ ...formData, billingCycle: e.target.value })
                     }
                     options={BILLING_CYCLES}
                  />
                  <Select
                     label="Category"
                     name="category"
                     value={formData.category}
                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                     options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  />
                  <Input
                     label="Start date"
                     name="startDate"
                     type="date"
                     value={formData.startDate}
                     onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                     }
                     error={errors.startDate}
                  />
               </div>
               <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={STATUS_OPTIONS}
               />
               <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
               />
               <Textarea
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
               />
               <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1" loading={loading}>
                     Save changes
                  </Button>
                  <Button type="button" variant="secondary" className="flex-1" onClick={resetForm}>
                     Cancel
                  </Button>
               </div>
            </form>
         </Modal>
      </PageShell>
   );
}

function StatCard({ label, value, hint, accent = "slate" }) {
   const accents = {
      slate: "from-white/8 to-white/0",
      green: "from-emerald-500/20 to-white/0",
      blue: "from-blue-500/20 to-white/0",
      gold: "from-amber-500/20 to-white/0",
   };

   return (
      <div className={`rounded-2xl border border-white/8 bg-gradient-to-br ${accents[accent]} p-5`}>
         <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
         <p className="font-serif text-2xl text-white mt-2 tracking-tight">{value}</p>
         <p className="text-white/30 text-xs mt-1">{hint}</p>
      </div>
   );
}

function PlatformCard({ platform, isSelected, onClick }) {
   const fromPrice = startingMonthlyPrice(platform.plans);

   return (
      <button
         type="button"
         onClick={onClick}
         className={`text-left rounded-2xl p-4 border transition-all duration-200 group ${
            isSelected
               ? "border-white/20 bg-white/8 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
               : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]"
         }`}
      >
         <div
            className="h-1 w-12 rounded-full mb-4"
            style={{ backgroundColor: platform.color }}
         />
         <div className="flex items-start justify-between gap-3">
            <div
               className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border border-white/10"
               style={{ backgroundColor: `${platform.color}22` }}
            >
               {platform.logo}
            </div>
            {isSelected && (
               <span className="text-[11px] uppercase tracking-wide text-blue-300">
                  Selected
               </span>
            )}
         </div>
         <p className="text-white font-medium mt-4 truncate">{platform.name}</p>
         <p className="text-white/35 text-xs mt-1">{platform.category}</p>
         <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-white/80">
               {fromPrice != null ? `From ${formatCurrency(fromPrice)}/mo` : "Custom"}
            </span>
            <span className="text-white/30 text-xs">
               {platform.plans.length} plan{platform.plans.length === 1 ? "" : "s"}
            </span>
         </div>
      </button>
   );
}

function PlanSelector({
   platform,
   selectedPlan,
   onPlanSelect,
   formData,
   setFormData,
   errors,
   onSubmit,
   loading,
   editing,
   onClose,
}) {
   const isManual = platform.id === "manual";

   return (
      <Card className="p-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
               <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
                  style={{ backgroundColor: `${platform.color}22` }}
               >
                  {platform.logo}
               </div>
               <div>
                  <h3 className="text-white font-medium">
                     {isManual ? "Add a custom service" : `Choose a ${platform.name} plan`}
                  </h3>
                  <p className="text-white/35 text-sm">
                     {isManual
                        ? "For any service that is not in the catalog"
                        : `${platform.plans.length} plans with current pricing`}
                  </p>
               </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
               Close
            </Button>
         </div>

         {isManual ? (
            <form onSubmit={onSubmit} className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                     label="Service name"
                     name="name"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     placeholder="Notion, iCloud, Gym..."
                     error={errors.name}
                  />
                  <Input
                     label="Amount"
                     name="amount"
                     type="number"
                     step="0.01"
                     value={formData.amount}
                     onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                     placeholder="499"
                     error={errors.amount}
                  />
                  <Select
                     label="Currency"
                     value={formData.currency}
                     onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                     options={CURRENCIES}
                  />
                  <Select
                     label="Billing cycle"
                     value={formData.billingCycle}
                     onChange={(e) =>
                        setFormData({ ...formData, billingCycle: e.target.value })
                     }
                     options={BILLING_CYCLES}
                  />
                  <Select
                     label="Category"
                     value={formData.category}
                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                     options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                     placeholder="Select category"
                     error={errors.category}
                  />
                  <Input
                     label="Start date"
                     type="date"
                     value={formData.startDate}
                     onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                     }
                     error={errors.startDate}
                  />
               </div>
               <Input
                  label="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://"
               />
               <Textarea
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
               />
               <Button type="submit" className="w-full" loading={loading}>
                  Add subscription
               </Button>
            </form>
         ) : (
            <>
               <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
                  {platform.plans.map((plan) => {
                     const selected = selectedPlan?.id === plan.id;
                     const yearlyPrice =
                        plan.yearlyPrice ||
                        (plan.billingCycle === "yearly"
                           ? plan.price
                           : Math.round(plan.price * 12));
                     const monthlyPrice =
                        plan.billingCycle === "yearly"
                           ? Math.round(plan.price / 12)
                           : plan.price;
                     const yearlySavings =
                        plan.billingCycle === "monthly" && plan.yearlyPrice
                           ? Math.round(plan.price * 12 - plan.yearlyPrice)
                           : 0;

                     return (
                        <button
                           key={plan.id}
                           type="button"
                           onClick={() => onPlanSelect(plan)}
                           className={`text-left rounded-xl border p-4 transition-all ${
                              selected
                                 ? "border-blue-400/50 bg-blue-500/10"
                                 : "border-white/8 bg-white/[0.03] hover:border-white/15"
                           }`}
                        >
                           <div className="flex items-start justify-between gap-2 mb-3">
                              <div>
                                 <p className="text-white font-medium">{plan.name}</p>
                                 <p className="text-white/35 text-xs mt-1">
                                    {plan.quality} · {plan.screens} screen
                                    {plan.screens > 1 ? "s" : ""}
                                 </p>
                              </div>
                              {selected && (
                                 <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                              )}
                           </div>
                           <p className="text-white font-serif text-2xl">
                              {formatCurrency(plan.price)}
                              <span className="text-sm text-white/35 font-sans ml-1">
                                 /{plan.billingCycle === "yearly" ? "yr" : "mo"}
                              </span>
                           </p>
                           <p className="text-white/35 text-xs mt-2">
                              {formatCurrency(monthlyPrice)}/mo · {formatCurrency(yearlyPrice)}/yr
                           </p>
                           {yearlySavings > 0 && (
                              <p className="text-emerald-400 text-xs mt-2">
                                 Save {formatCurrency(yearlySavings)}/yr on yearly
                              </p>
                           )}
                        </button>
                     );
                  })}
               </div>

               <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                  <Input
                     label="Start date"
                     type="date"
                     value={formData.startDate}
                     onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                     }
                     error={errors.startDate}
                  />
                  <Input
                     label="Notes"
                     value={formData.notes}
                     onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                     placeholder="Optional"
                  />
                  <Button type="submit" loading={loading} disabled={!selectedPlan && !editing}>
                     {selectedPlan ? "Add this plan" : "Select a plan"}
                  </Button>
               </form>
            </>
         )}
      </Card>
   );
}

function TrackedCard({ subscription, onEdit, onDelete }) {
   const daysLeft = getDaysUntilRenewal(subscription.nextPayDate);
   const platform = findPlatformByName(subscription.name);
   const monthlyAmount =
      subscription.billingCycle === "monthly"
         ? subscription.amount
         : Math.round(subscription.amount / 12);
   const urgency =
      daysLeft <= 3 ? "text-red-400" : daysLeft <= 7 ? "text-amber-400" : "text-emerald-400";
   const statusVariant =
      subscription.status === "active"
         ? "success"
         : subscription.status === "paused"
           ? "warning"
           : "error";

   return (
      <Card className="p-5 overflow-hidden relative">
         <div
            className="absolute inset-y-0 left-0 w-1"
            style={{ backgroundColor: platform?.color || "#3b82f6" }}
         />
         <div className="flex items-start justify-between gap-4 pl-2">
            <div className="flex items-center gap-3 min-w-0">
               <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-lg border border-white/10 shrink-0"
                  style={{ backgroundColor: `${platform?.color || "#3b82f6"}22` }}
               >
                  {platform?.logo || "◈"}
               </div>
               <div className="min-w-0">
                  <h3 className="text-white font-medium truncate">{subscription.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <Badge variant={statusVariant}>{subscription.status}</Badge>
                     <span className="text-white/35 text-xs">{subscription.category}</span>
                  </div>
               </div>
            </div>
            <div className="text-right shrink-0">
               <p className="text-white font-serif text-xl">
                  {formatCurrency(subscription.amount, subscription.currency)}
               </p>
               <p className="text-white/35 text-xs">
                  /{subscription.billingCycle} · {formatCurrency(monthlyAmount)}/mo
               </p>
            </div>
         </div>

         <div className="mt-5 ml-2 flex items-center justify-between text-sm">
            <div>
               <p className="text-white/35 text-xs uppercase tracking-wide">Next payment</p>
               <p className="text-white mt-1">
                  {new Date(subscription.nextPayDate).toLocaleDateString("en-IN", {
                     day: "numeric",
                     month: "short",
                     year: "numeric",
                  })}
               </p>
            </div>
            <p className={`text-sm font-medium ${urgency}`}>
               {daysLeft === 0 ? "Due today" : `${daysLeft} days left`}
            </p>
         </div>

         <div className="flex gap-2 mt-5 ml-2">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => onEdit(subscription)}>
               Edit
            </Button>
            <Button variant="danger" size="sm" className="flex-1" onClick={() => onDelete(subscription.id)}>
               Delete
            </Button>
         </div>
      </Card>
   );
}
