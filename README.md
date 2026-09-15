# 🚀 SocialPilot AI

<div align="center">

![SocialPilot AI Banner](https://raw.githubusercontent.com/username/socialpilot-ai/main/public/banner.png)

### **Create once. Publish everywhere. Manage everything.**

*An enterprise-grade, modern, AI-powered social media management and client collaboration SaaS platform.*

[![Next.js](https://img.shields.io/badge/Next.js-16.3.5_(Turbopack)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Live Demo](http://localhost:3000) • [Features](#-core-features) • [Architecture](#-system-architecture) • [Getting Started](#-getting-started) • [Environment Setup](#-environment-variables)

</div>

---

## 🌟 Executive Overview

**SocialPilot AI** is an all-in-one social media intelligence and automation ecosystem engineered specifically for digital marketing agencies, multi-brand organizations, content creators, and growth teams.

Designed with a high-impact **Midnight Intelligence** design system (Deep Navy `#0B1020`, Electric Lime `#D4FF32`, and Soft Lavender `#C4B5FD`), it bridges the gap between high-velocity AI content generation, cross-platform social publishing, unified inbox management, and friction-free external client approvals.

---

## ✨ Core Features

### 1. 🤖 AI Content Studio & Multichannel Adapter
- **One-Prompt Multichannel Generation**: Enter a central concept or campaign brief, and the AI automatically adapts voice, tone, character constraints, and hashtag clusters for LinkedIn, Instagram, Facebook, X, Threads, and WhatsApp.
- **AI Image & Creative Generation**: Integrated prompt engineering for visual assets with aspect ratio presets (1:1 Square, 4:5 Portrait, 16:9 Landscape, 9:16 Stories/Reels).
- **Tone & Persona Modulation**: Switch between Thought Leadership, Conversational, Promotional, Storytelling, and Urgent tones.

### 2. 🧠 Brand Brain™ Guardrails
- **Brand Consistency Engine**: Store custom voice guidelines, target audience personas, value pillars, and brand vocabulary.
- **Automated Compliance & Safety**: Real-time filtering for prohibited terms, off-brand phrases, and sensitive keywords before publication.
- **Multi-Brand Profiles**: Agency workspaces can maintain distinct Brand Brain configurations for every client account.

### 3. 📅 Interactive Content Calendar
- **Omnichannel Visual Timeline**: View planned, scheduled, and published content across month, week, or day grids.
- **Drag-and-Drop Rescheduling**: Effortlessly adjust publishing cadences and optimize posting times based on audience engagement heatmaps.
- **Multi-Platform Filter**: Focus on specific channels (Instagram, LinkedIn, Facebook, etc.) or campaign tags.

### 4. 💬 Unified Social Inbox & AI Copilot
- **Universal Conversation Stream**: Aggregate incoming direct messages, post comments, and mentions across connected channels into one real-time inbox.
- **AI Sentiment Analysis**: Automatically categorize incoming inquiries (Positive, Neutral, Negative, Urgent Lead).
- **1-Click AI Suggested Replies**: Context-aware, brand-aligned response drafts that agents can inspect, edit, and send in seconds.

### 5. 👥 Passwordless Client Approval Portal
- **Zero-Friction Client Review**: Generate secure, tokenized review URLs (`/client/approval/[token]`) for external clients.
- **No Sign-Up Required**: Clients can review upcoming scheduled posts, inspect high-res media previews, approve content, or leave actionable feedback directly on individual drafts.
- **Real-Time Agency Sync**: Feedback and approval status immediately reflect in the agency workspace.

### 6. 📊 Real-Time Analytics & Growth Insights
- **Cross-Network Metrics**: Aggregate impressions, engagement rate, click-through rates, and audience follower velocity.
- **Post-Level Benchmarking**: Identify top-performing content formats and optimal publishing timeframes.
- **Exportable Client Reports**: Generate clean visual summaries for stakeholders.

---

## 🏗️ System Architecture

```
socialpilot-ai/
├── prisma/
│   └── schema.prisma            # Production PostgreSQL relational schema
├── src/
│   ├── app/                     # Next.js 16 App Router (32 routes)
│   │   ├── (marketing)          # Public marketing & conversion pages
│   │   │   ├── page.tsx         # High-converting Hero, Platform Matrix, Showcase
│   │   │   ├── features/        # Deep-dive feature breakdown
│   │   │   ├── pricing/         # Transparent tiered pricing & FAQ
│   │   │   ├── integrations/    # Supported platforms & API matrix
│   │   │   ├── about/           # Mission, team, and company narrative
│   │   │   └── contact/         # Contact & enterprise inquiry portal
│   │   ├── (auth)               # Authentication system
│   │   │   ├── login/           # Email/password & 1-click demo login
│   │   │   ├── register/        # Account creation & onboarding link
│   │   │   ├── forgot-password/ # Password recovery request
│   │   │   ├── reset-password/  # Token-based credential update
│   │   │   └── verify-email/    # Account activation notice
│   │   ├── app/                 # Authenticated SaaS Dashboard
│   │   │   ├── page.tsx         # Operational overview & quick actions
│   │   │   ├── content-studio/  # AI creation & multichannel composer
│   │   │   ├── calendar/        # Visual publishing schedule
│   │   │   ├── inbox/           # Unified social inbox & copilot
│   │   │   ├── brand-brain/     # Voice guidelines & guardrails
│   │   │   ├── approvals/       # Internal & client review queue
│   │   │   ├── analytics/       # Performance metrics & reports
│   │   │   ├── social-accounts/ # Platform connections & OAuth tokens
│   │   │   └── settings/        # Workspace & billing configuration
│   │   ├── client/approval/     # External passwordless client portal
│   │   ├── api/                 # Secure REST & webhook endpoints
│   │   ├── icon.svg             # Crisp vector favicon
│   │   ├── apple-icon.svg       # iOS touch icon
│   │   └── layout.tsx           # Global shell & SEO metadata
│   ├── components/
│   │   ├── dashboard/           # Sidebar, header, modals, widgets
│   │   ├── marketing/           # Sticky glass navbar, footer, showcases
│   │   └── ui/                  # Logo, buttons, badges, tabs, cards
│   ├── lib/
│   │   ├── auth/                # Session cookies & authentication context
│   │   ├── publishing/          # Provider abstractions (Meta, LinkedIn, etc.)
│   │   ├── security/            # AES-256-GCM encryption & HMAC signatures
│   │   ├── store/               # Demo store with SSR-safe hydration
│   │   └── types/               # TypeScript interfaces and contracts
│   └── middleware.ts            # Edge route protection & auth redirects
```

---

## 🔒 Enterprise Security & Reliability

| Security Pillar | Implementation Details |
| :--- | :--- |
| **Token Encryption** | OAuth access & refresh tokens are encrypted at rest using **AES-256-GCM** with unique initialization vectors (`IV`) and authentication tags. |
| **Edge Protection** | Next.js Edge Middleware intercepts unauthorized requests to `/app/*` and seamlessly routes to `/login?redirect=...`. |
| **Publishing Idempotency** | Every scheduled publishing task generates a deterministic `idempotencyKey` preventing duplicate broadcasts during network retries. |
| **Media Pre-Flight Validation** | Uploaded media is validated against platform-specific aspect ratios, file size limits, and formats prior to dispatch. |
| **Staged Integrity** | Features currently in staging (e.g., live payment processor or real-time SMTP dispatch) are honestly labeled to maintain complete operational transparency. |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/)
- **Frontend**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) & Bespoke SVG Logo System
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Security & Cryptography**: Native Node.js `crypto` (`aes-256-gcm`, `pbkdf2`)
- **State Architecture**: Deterministic SSR Hydration with Local Storage Mirroring

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.18.0` or later
- **npm** or **pnpm** / **yarn**
- *(Optional)* **PostgreSQL** (if connecting a live database instead of Demo Mode)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/socialpilot-ai.git
cd socialpilot-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Duplicate `.env.example` to create your local `.env.local` configuration:

```bash
cp .env.example .env.local
```

Populate the required secrets (see [Environment Variables](#-environment-variables) below).

### 4. Initialize Database (Optional for Production)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations against your PostgreSQL instance
npx prisma migrate dev --name init
```

### 5. Launch Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

The project includes an exhaustive configuration template in [`.env.example`](.env.example):

```env
# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/socialpilot?schema=public"

# Token Encryption (32-byte hex for AES-256-GCM)
ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# AI Models (Optional - Simulated fallbacks included)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""

# Social OAuth Credentials (Tier 1 Providers)
META_APP_ID=""
META_APP_SECRET=""
LINKEDIN_CLIENT_ID=""
LINKEDIN_CLIENT_SECRET=""

# Webhook Secrets
WEBHOOK_SECRET_META=""
```

---

## 🧪 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack on port `3000`. |
| `npm run build` | Compiles the production build and verifies static/dynamic routes. |
| `npm start` | Boots the optimized production server. |
| `npm run lint` | Runs ESLint across all TypeScript and React files. |
| `npx prisma studio` | Opens the graphical Prisma Database browser. |

---

## 🎨 Design System: Midnight Intelligence

SocialPilot AI is styled with custom aesthetic tokens engineered for low eye fatigue and high visual clarity:

- **Background Canvas**: Deep Void Navy (`#0B1020` / `#0E1528`)
- **Card Surfaces**: Elevated Obsidian Glass (`#121A2B` with `rgba(255, 255, 255, 0.05)` border)
- **Primary Accent**: Electric Lime (`#D4FF32`) — High-contrast CTA focus
- **Secondary Accent**: Soft Lavender (`#C4B5FD`) — Balanced informational highlights
- **Typography**: Inter / Geist Sans with crisp tabular numerals

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for complete details.

---

<div align="center">

**Built with precision for the modern social enterprise.**

[Back to top ⬆](#-socialpilot-ai)

</div>
