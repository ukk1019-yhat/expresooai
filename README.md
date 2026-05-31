<!-- EXPRESSO AI — README -->

<div align="center">

```
███████╗██╗  ██╗██████╗ ██████╗ ███████╗███████╗███████╗ ██████╗
██╔════╝╚██╗██╔╝██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██╔═══██╗
█████╗   ╚███╔╝ ██████╔╝██████╔╝█████╗  ███████╗███████╗██║   ██║
██╔══╝   ██╔██╗ ██╔═══╝ ██╔══██╗██╔══╝  ╚════██║╚════██║██║   ██║
███████╗██╔╝ ██╗██║     ██║  ██║███████╗███████║███████║╚██████╔╝
╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝
                                                              A  I
```

### *Train your mind. Not just your skills.*

**Behavioral Intelligence Platform** · **AI-Powered Simulations** · **Real-time Emotional Scoring**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-expresooai.vercel.app-FF4E00?style=for-the-badge&logo=vercel&logoColor=white)](https://expresooai.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-89%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev)

</div>

---

## ◈ What Is EXPRESSO AI?

> Most platforms teach you **what** to say.  
> EXPRESSO AI teaches you **how** to be heard.

EXPRESSO AI is a **Behavioral Intelligence Infrastructure** — a simulation engine that recreates the cognitive and emotional complexity of real human interactions. Instead of static courses, you're dropped into live AI conversations with dynamic personas: a skeptical investor, a difficult team member, a high-stakes negotiator.

Every word you say is **scored in real-time**. Every emotional shift is **tracked and analyzed**. Every session ends with a behavioral report that shows you exactly where you succeeded, where you hesitated, and where you lost the room.

---

## ◈ Core Capabilities

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE EXPRESSO ENGINE                         │
│                                                                 │
│   SIMULATE ──────► SCORE ──────► ADAPT ──────► REPORT          │
│                                                                 │
│   Real-world         Behavioral     Emotional     Performance   │
│   AI Personas        Analysis       Feedback      Analytics     │
└─────────────────────────────────────────────────────────────────┘
```

| Module | What It Does |
|---|---|
| 🎭 **Persona Engine** | AI characters with distinct personalities, emotional states, and behavioral triggers |
| 🧠 **Behavioral Scoring** | Real-time analysis of empathy, assertiveness, clarity, and persuasion |
| 💬 **Adaptive Dialogue** | Conversations that evolve based on your choices — no two sessions are identical |
| 📊 **Emotional Analytics** | Tracks sentiment trajectory, confidence peaks, and communication breakdowns |
| 🏆 **Progress Intelligence** | Longitudinal performance insights across sessions and scenarios |
| 🔌 **Chrome Extension** | Practice behavioral intelligence in any web conversation, anywhere |

---

## ◈ Use Cases

```
  Communication       Negotiation        Leadership         Decision-Making
  ─────────────       ───────────        ──────────         ───────────────
  Practice tough    Close the deal     Lead under         Navigate high-stakes
  conversations     before the real    pressure without   decisions in real-time
  before they       one. Read the      losing the room.   simulations with
  happen.           room. Adapt.       Stay composed.     real consequences.
```

---

## ◈ Tech Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                  │
│              Next.js 15  ·  TypeScript  ·  Tailwind              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────────┐
  │  Clerk   │  │ Supabase │  │  Vercel Edge │
  │  Auth    │  │    DB    │  │   Deployment │
  └──────────┘  └──────────┘  └──────────────┘
        │              │
        └──────┬───────┘
               ▼
    ┌──────────────────────┐
    │     AI / LLM Layer   │
    │  Persona Generation  │
    │  Behavioral Scoring  │
    │  Sentiment Analysis  │
    └──────────────────────┘
               │
    ┌──────────▼───────────┐
    │   Chrome Extension   │
    │  In-context practice │
    └──────────────────────┘
```

**Stack at a Glance:**

- **Framework** — Next.js 15 (App Router) + TypeScript
- **Database** — Supabase (PostgreSQL with real-time capabilities)
- **Authentication** — Clerk (multi-session, OAuth, SSO-ready)
- **AI Layer** — LLM-powered persona simulation & behavioral scoring
- **Deployment** — Vercel Edge Network
- **Extension** — Chromium-compatible extension (`/extension`)
- **Languages** — TypeScript `89%` · JavaScript `9%` · HTML/CSS `2%`

---

## ◈ Repository Structure

```
expresooai/
├── src/                    # Core application source
│   ├── app/                # Next.js App Router pages & layouts
│   ├── components/         # Reusable UI components
│   └── lib/                # Utilities, hooks, AI integrations
├── clerk-nextjs/           # Clerk authentication configuration
├── extension/              # Chrome extension source
├── public/                 # Static assets
├── supabase-schema.sql     # Full database schema
├── CLAUDE.md               # AI coding agent instructions
└── AGENTS.md               # Agent behavior configuration
```

---

## ◈ Quick Start

**Prerequisites:** Node.js 18+, a Supabase project, a Clerk application

```bash
# Clone the repository
git clone https://github.com/ukk1019-yhat/expresooai.git
cd expresooai

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# → Add your NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# → Add your CLERK_SECRET_KEY
# → Add your NEXT_PUBLIC_SUPABASE_URL
# → Add your NEXT_PUBLIC_SUPABASE_ANON_KEY

# Initialize the database
# → Run supabase-schema.sql in your Supabase SQL editor

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your behavioral intelligence platform is live.

---

## ◈ Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key (frontend auth) |
| `CLERK_SECRET_KEY` | Clerk secret key (server-side auth) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

> ⚠️ Never commit `.env` to version control. The `.gitignore` covers this, but double-check before pushing.

---

## ◈ Chrome Extension

The `/extension` directory contains the EXPRESSO AI Chrome extension — bringing behavioral intelligence directly into any web conversation.

```bash
# Load in Chrome
1. Open chrome://extensions
2. Enable "Developer Mode" (top right)
3. Click "Load Unpacked"
4. Select the /extension folder
```

---

## ◈ Database

The full Supabase schema lives in `supabase-schema.sql`. It defines the data model for users, sessions, personas, behavioral scores, and analytics events.

To initialize:
1. Open your Supabase dashboard → SQL Editor
2. Paste and run `supabase-schema.sql`
3. Verify tables are created under the `public` schema

---

## ◈ Deployment

EXPRESSO AI is optimized for Vercel deployment with `vercel.json` pre-configured.

```bash
# Deploy to production
npx vercel --prod
```

Or connect your GitHub repo directly in the [Vercel Dashboard](https://vercel.com/new) for automatic deployments on every push to `main`.

---

## ◈ The Philosophy

Most communication training gives you scripts. Scripts break the moment reality diverges from the expected.

EXPRESSO AI takes a different approach — it trains the **behavioral layer beneath the words**: how you respond under pressure, how you read emotional shifts, how you adapt when someone pushes back harder than expected.

The goal isn't to make you sound better. It's to make you think faster, feel more clearly, and communicate with precision when it actually matters.

---

<div align="center">

**Built with intention** · **Deployed at [expresooai.vercel.app](https://expresooai.vercel.app)**

*© 2025 EXPRESSO AI. All rights reserved.*

</div>
