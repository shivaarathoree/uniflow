# UNIFLOW - Co-Founder's Master Document 🌊

Welcome co-founder! This document serves as the high-level overview, technical architecture, and brutal business truth of the UNIFLOW project right now.

## 1. What is UNIFLOW?
UNIFLOW is currently a web-based **habit tracker** wrapped in a neo-brutalist aesthetic. 
Users can log their habits, view GitHub-style consistency heatmaps, and chat with an AI coach (Aura) who summarizes their data.

### The Stack:
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Neo-brutalism design style)
- **Database / Auth**: Supabase (PostgreSQL with Row Level Security)
- **AI Integration**: Google Gemini API (`gemini-2.5-flash`)
- **Payments**: Razorpay (setup pending)

## 2. Technical Architecture & Database

Our entire database is housed in Supabase. Everything is locked down with **Row Level Security (RLS)** meaning users can only query their own data.

### Core Tables:
1. **`auth.users`**: Handled automatically by Supabase.
2. **`habits`**: Tracks the habits the user creates (Name, Icon, Color, Frequency, Target Minutes).
3. **`habit_logs`**: The daily check-ins. One row per habit per day.
4. **`coach_messages`**: Chat history for the Gemini AI. Tracks what the user says and what Aura responds.
5. **`subscriptions`**: Automatically generated on sign-up (via database trigger). Tracks if they are on `free` or `pro`.

## 3. Current Business & Monetization Model

Right now, UNIFLOW operates on a **Freemium** model.

**Free Tier Restrictions:**
- Users can only create **up to 3 habits**.
- Users can only send **up to 5 messages to the AI coach per day**.

These limits are hardcoded on the server-side via API routes (`app/api/habits/route.ts` and `app/api/coach/route.ts`). If a user hits the limit, the server returns an error prompting them to upgrade.

**Pro Tier (₹399/month):**
- Handled through `app/dashboard/billing/page.tsx` using Razorpay popup.
- Intended to offer unlimited habits, unlimited AI coaching, and deep analytics.

## 4. The Brutal Business Reality 📉

As your AI co-founder, I need to give you the honest truth: **People will not pay ₹399/month for this in its current form.**

* **The Moat Problem:** We are a checklist app. Apps like Habitica, Strides, and Loop Habit Tracker already do this for free with heavily developed mobile apps.
* **The AI Gimmick:** The AI coach is currently just reading back the user's dashboard data. "You completed 2/3 habits today." They don't need to pay an AI to tell them what they can see on the screen.
* **The Platform Issue:** Nobody logs into a browser on their laptop just to check off "Drank water." Habits are tracked on-the-go.

## 5. Where Do We Pivot? (The Action Plan) 🚀

To generate actual revenue, we need to offer something people *must* pay for. 

### Pivot Idea 1: "Do-Or-Die" Monetary Stakes (Highest Priority)
This is an idea we already have but haven't fully built. Users stake real money (e.g. ₹500) that they will do a habit for 30 days. If they fail, they lose the money. We take a 15% platform cut. Loss aversion works, and users are paying to lock *themselves* in, not paying for premium features.

### Pivot Idea 2: The WhatsApp Bot
Instead of a web app, we turn UNIFLOW into a WhatsApp Bot. People text "done with gym" and Aura logs it. Aura sends morning reminders right on WhatsApp. Zero friction. 

### Pivot Idea 3: Niche Down 
We stop being a general "habit tracker" and become a tool for a specific audience. Example: "UNIFLOW for JEE/NEET Aspirants". We track study hours, compare them against peers anonymously, and the AI tests them on the syllabus. Parents will gladly pay ₹300/month for that.

## 6. How to Run This Project Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Make sure your `.env.local` file has the Supabase and Gemini keys (already setup).
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000)

---
*Let's stop building cool features nobody will pay for, and start building specific solutions people can't live without. What's our next move?*


# UNIFLOW - Investor & Co-Founder Memo 🚀

> **Elevator Pitch:** UNIFLOW is an AI-driven behavioral accountability platform. We combine neo-brutalist design, data-dense analytics, and an intelligent AI coach (Aura) to transform habit tracking from a passive checklist into an active, conversational accountability system.

---

## 1. The Problem Space 📉
The self-improvement and productivity market is booming, but current toolsets are broken:
1. **Passive Tracking:** Apps like Habitica or Loop Habit Tracker are just digital checklists. They require high manual input and provide no contextual feedback.
2. **Zero Accountability:** When a user breaks a streak, the app just resets to zero. There is no friction in failing.
3. **Data Silos:** Users track habits in one app, journal in another, and review data in a spreadsheet.
4. **Lack of Personalization:** Push notifications are generic ("Time to drink water!"). They don't adapt to the user's actual behavior or day.

## 2. The Solution: UNIFLOW 🌊
UNIFLOW unifies habit logging, analytics, and coaching into a single platform.

* **Aura AI Coach (Gemini Powered):** Users don't just click a checkbox; they tell Aura, *"I read for 30 minutes but skipped the gym."* Aura logs the data, analyzes the trend, and responds with direct, honest feedback—free of toxic positivity.
* **Deep Analytics:** GitHub-style 90-day heatmaps and completion percentages visualize consistency instantly. 
* **Frictionless UI:** Built with an aggressive, highly engaging neo-brutalist aesthetic that stands out in a sea of minimalist, sterile corporate apps.

---

## 3. Target Audience & User Personas 🎯

Who is UNIFLOW for? We are targeting high-intent, self-optimization communities.

1. **The High Achiever (Founders, Creators, Professionals)**
   * *Pain:* Overwhelmed by tools, lacks time to manually fiddle with trackers.
   * *Value:* AI integration allows for rapid voice/text logging and instant weekly summaries. 
2. **The Competitive Student (JEE / NEET / UPSC Aspirants)**
   * *Pain:* Needs ruthless consistency over a multi-year timeframe. 
   * *Value:* Streaks, data visualization, and an AI coach that acts as a digital study partner holding them accountable.
3. **The Quantified-Self Enthusiast**
   * *Pain:* Wants micro-level data on their habits but hates maintaining Excel sheets.
   * *Value:* Lifetime analytics, heatmaps, and exportable data capabilities.

---

## 4. Business Model & Monetization 💰

UNIFLOW operates on a **Freemium SaaS** model with distinct up-sell triggers.

### Current Model
* **Free Tier (Acquisition Hook):** Limits users to 3 active habits and 5 AI Coach messages per day. Enough to experience the magic, not enough for power users.
* **Pro Tier (₹399/month or ₹3,999/year):** Unlocks unlimited habits, unlimited AI coaching, and lifetime lifetime analytics. 

### Expansions & The "Real" Moat (Next Phase)
* **Monetary Accountability Stakes:** Taking a page from behavioral economics (like stickK or Beeminder), users stake real money on a 30-day habit. If they fail, they lose the cash. UNIFLOW takes a 10-15% platform fee from failed stakes. **This creates immediate revenue and an incredibly high-switching cost.**
* **B2B / Corporate Wellness:** Selling structured team-habit challenges to startups and corporations.

---

## 5. Technical Architecture & Scalability ⚡

UNIFLOW is built on a modern, deeply scalable stack designed to handle millions of users with near-zero initial dev-ops overhead.

### The Stack
* **Frontend:** Next.js 14 (App Router), React 18, TailwindCSS.
* **Backend:** Next.js Serverless API routes deployed on Vercel (Auto-scaling edge network).
* **Database & Auth:** Supabase (Enterprise-grade PostgreSQL).
* **AI Engine:** Google Gemini (`gemini-2.5-flash`) for low-latency conversational processing.

### Why It Scales
1. **Row Level Security (RLS) in Supabase:** The database strictly enforcing privacy rules at the Postgres level means we can scale read/write operations without complex middle-tier validation bottlenecks. The data is fundamentally secure.
2. **Serverless Infrastructure:** We don't maintain servers. As traffic spikes, Next.js serverless functions simply scale horizontally.
3. **Optimized AI Calls:** We manage database context dynamically so we only send necessary habit data to Gemini, keeping token costs aggressively low for the business.

---

## 6. Go-To-Market (GTM) Strategy 🚀

1. **Phase 1: Build in Public & Niche Communities**
   * Target communities on X (Twitter), Reddit (`r/productivity`, `r/getdisciplined`), and IndieHackers.
   * Leverage the neo-brutalist design to drive visual engagement on social media.
2. **Phase 2: Influencer / Creator Partnerships**
   * Partner with YouTube creators in the "StudyTube" and Productivity niches. "How I use UNIFLOW + AI to organize my life."
3. **Phase 3: The WhatsApp / Telegram Expansion**
   * Expand from the web app into a WhatsApp bot. Meeting Indian/Global users *where they already are*, reducing friction to literally zero.

---

## 7. Setup & Local Development 💻

For engineering reviews or running the app locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Environment Variables (`.env.local`):**
   Ensure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `GEMINI_API_KEY` are configured.
3. **Initialize the local server:**
   ```bash
   npm run dev
   ```
4. Application runs at [http://localhost:3000](http://localhost:3000)

---
*UNIFLOW isn't just another tracker. It's an intelligent accountability partner designed to monetize consistency and generate recurring revenue.*
