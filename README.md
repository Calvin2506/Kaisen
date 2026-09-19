# ✦ Kaisen

> A professional subscription tracking app built to help you track, analyze, and reduce your monthly expenses — inspired by the Japanese philosophy of continuous improvement (_Kaizen_).

## ✨ Features

- **📊 Smart Dashboard** — View monthly/yearly spend, active subscriptions, and upcoming renewals at a glance
- **💳 Subscription Management** — Add, edit, delete, and filter subscriptions by status (active, paused, cancelled)
- **🎬 Regional Streaming Catalog** — Browse 15+ major streaming services (Netflix, Disney+ Hotstar, Amazon Prime Video, JioCinema, SonyLIV, ZEE5, Spotify, Apple Music, Gaana, Wynk, YouTube Premium, Sun NXT, Aha, Voot) with real-time plan pricing and yearly savings calculations
- **✍️ Manual Entry** — "Other" category for custom subscriptions not in the catalog
- **📈 Analytics Page** — Horizontal bar charts, pie charts, most expensive subscriptions, and category breakdown table
- **🤖 AI-Powered Suggestions** — Get personalized optimization tips via Hugging Face Llama 3.1 8B (with rule-based fallback)
- **💡 Cost Suggestions** — Duplicate category detection, yearly plan savings, free alternatives, unused subscription alerts
- **🔔 Renewal Alerts** — Color-coded countdown showing days until next payment (red = urgent, yellow = soon, green = safe)
- **🔒 Authentication** — Secure signup/login with encrypted passwords using NextAuth + bcrypt
- **🛡️ Route Protection** — Middleware-protected routes redirect unauthenticated users to login
- **🎨 Professional UI** — Dark corporate design with DM Serif Display + DM Sans typography

---

## 🛠️ Tech Stack

| Layer          | Technology                                         |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 16 (App Router, Turbopack)                 |
| Styling        | Tailwind CSS v4                                    |
| Database       | Firebase Firestore (NoSQL)                         |
| Auth           | NextAuth.js v4 + bcryptjs                          |
| Charts         | Recharts                                           |
| AI Suggestions | Hugging Face Inference API (Llama-3.1-8B-Instruct) |
| Deployment     | Vercel                                             |

---

## 📁 Project Structure

```
subscription-tracker/
├── app/
│   ├── page.jsx                  # Landing page
│   ├── layout.jsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── dashboard/
│   │   └── page.jsx              # Dashboard with charts
│   ├── subscriptions/
│   │   └── page.jsx              # Subscription CRUD + Platform picker
│   ├── analytics/
│   │   └── page.jsx              # Analytics & insights
│   ├── suggestions/
│   │   └── page.jsx              # AI + rule-based suggestions
│   ├── auth/
│   │   ├── login/page.jsx        # Login page
│   │   └── signup/page.jsx       # Signup page
│   └── api/
│       ├── auth/[...nextauth]/   # NextAuth handler
│       ├── auth/signup/          # Signup API route
│       ├── subscriptions/        # CRUD API routes
│       └── ai-suggestions/       # Hugging Face AI endpoint
├── components/
│   ├── ui/                       # Reusable UI components (Button, Input, Select, Modal, Card, Badge, Avatar)
│   ├── Navbar.jsx                # Navigation bar
│   ├── NavbarWrapper.jsx         # Hides navbar on auth pages
│   └── SessionProvider.jsx       # NextAuth session wrapper
├── lib/
│   ├── firebase.js               # Firebase Admin SDK init
│   ├── db.js                     # Firestore CRUD helpers (Prisma-compatible interface)
│   ├── helpers.js                # Date & currency utilities
│   └── ott-platforms-india.js    # 15 regional streaming platforms with plans
├── proxy.js                      # Route protection middleware
└── .env                          # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- A [Firebase](https://console.firebase.google.com) project with Firestore enabled
- A [Hugging Face](https://huggingface.co) account (for AI suggestions)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/subscription-tracker.git
cd subscription-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project → Enable **Firestore Database** (test mode)
3. Go to **Project Settings → Service Accounts** → **Generate new private key**
4. Save the JSON file securely

### 4. Set up Hugging Face (AI suggestions)

1. Go to [Hugging Face Tokens](https://huggingface.co/settings/tokens)
2. Create a new token with **Read** access
3. Copy the token

### 5. Create `.env` file

```env
# Firebase (from service account JSON)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_WITH_\\n_AS_LITERAL_BACKSLASH_N\n-----END PRIVATE KEY-----\n"

# NextAuth
NEXTAUTH_SECRET="your-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"

# Hugging Face AI
HUGGINGFACE_API_TOKEN="hf_xxxxxxxxxxxxxxxxxxxx"
```

> **Important:** In `FIREBASE_PRIVATE_KEY`, replace actual newlines with the two characters `\n` (backslash + n).

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema (Firestore)

### Collections

**users**

```
{
  id: string (auto-generated)
  name: string
  email: string (unique)
  password: string (bcrypt hash)
  createdAt: timestamp
}
```

**subscriptions**

```
{
  id: string (auto-generated)
  userId: string (ref: users)
  name: string
  amount: number
  currency: string (default: "INR")
  billingCycle: "monthly" | "yearly"
  startDate: timestamp
  nextPayDate: timestamp
  category: string
  status: "active" | "paused" | "cancelled"
  notes?: string
  website?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

### Indexes Required

Create a **composite index** in Firestore Console → Indexes:

- Collection: `subscriptions`
- Fields: `userId` (Ascending) + `nextPayDate` (Ascending)

---

## 📡 API Routes

| Method | Endpoint                 | Description                                  |
| ------ | ------------------------ | -------------------------------------------- |
| POST   | `/api/auth/signup`       | Register a new user                          |
| POST   | `/api/auth/signin`       | Login (NextAuth)                             |
| GET    | `/api/subscriptions`     | Get all user subscriptions                   |
| POST   | `/api/subscriptions`     | Create a new subscription                    |
| PUT    | `/api/subscriptions/:id` | Update a subscription                        |
| DELETE | `/api/subscriptions/:id` | Delete a subscription                        |
| POST   | `/api/ai-suggestions`    | Get AI-powered cost optimization suggestions |

---

## 🤖 AI Suggestions API

**Request:**

```json
POST /api/ai-suggestions
{
  "subscriptions": [
    {
      "name": "Netflix",
      "amount": 649,
      "currency": "INR",
      "billingCycle": "monthly",
      "category": "Entertainment",
      "startDate": "2024-01-01T00:00:00.000Z",
      "nextPayDate": "2024-12-01T00:00:00.000Z",
      "status": "active"
    }
  ]
}
```

**Response:**

```json
{
   "suggestions": [
      {
         "type": "yearly_savings",
         "title": "Switch Netflix to Yearly",
         "description": "Netflix Premium at ₹649/mo = ₹7,788/yr. Yearly plan saves ~20% (₹1,557/yr).",
         "potentialSavings": 1557,
         "savingsPeriod": "yearly",
         "priority": "high",
         "actionItems": [
            "Check Netflix yearly pricing",
            "Switch to annual billing"
         ],
         "affectedSubscriptions": ["Netflix"]
      }
   ],
   "summary": {
      "totalMonthlySpend": 649,
      "totalYearlySpend": 7788,
      "potentialMonthlySavings": 0,
      "potentialYearlySavings": 1557,
      "topCategory": "Entertainment",
      "topCategorySpend": 649
   }
}
```

**Fallback:** If AI service is unavailable, rule-based suggestions are shown automatically (duplicate detection, yearly savings, unused subscriptions).

---

## 🔐 Authentication Flow

```
Signup → Password encrypted with bcrypt → Saved to Firestore (users collection)
Login  → NextAuth verifies credentials → JWT session created
Pages  → Middleware checks session → Redirect if unauthenticated
```

---

## 💡 Key Concepts Learned

- **Next.js App Router** — File-based routing with layouts, pages, and API routes
- **Server vs Client Components** — When to use `"use client"` directive
- **Firebase Firestore** — NoSQL document database with real-time listeners
- **NextAuth.js** — Session management with JWT and credentials provider
- **bcrypt** — Secure password hashing
- **Recharts** — Data visualization with React components
- **Middleware** — Route protection for authenticated pages
- **Hugging Face Inference API** — Free LLM integration for AI features
- **Composite Firestore Indexes** — Required for ordered queries with filters

---

## 🙌 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Hugging Face](https://huggingface.co/)

---

## 📄 License

MIT License — feel free to use this project for learning or as a portfolio piece.
