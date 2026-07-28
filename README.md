# InterviewGPT — Premium AI-Powered Interview Preparation Platform

> Production-Grade Engineering Blueprint & Technical Specification

InterviewGPT is an AI-powered interview preparation SaaS platform designed for software engineers and technology professionals. It combines AI-driven resume parsing, real-time voice and code mock interview simulation, communication telemetry assessment, detailed diagnostic scorecards, and automated personalized career roadmaps.

Designed to meet the software craft standards of tools like **Linear**, **Vercel**, **Stripe**, **Notion**, and **Raycast**, InterviewGPT prioritizes low latency, high information density, dark-mode elegance, and zero AI gimmicks.

---

## 🏛️ System Architecture Overview

```
                               ┌───────────────────────────┐
                               │     Next.js Web Client    │
                               │  (RSC + Zustand + Monaco) │
                               └─────────────┬─────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
             ┌───────────────────┐                       ┌───────────────────┐
             │    REST API v1    │                       │  WebSocket Stream │
             │  (Data & Config)  │                       │  (Audio & VAD)    │
             └─────────┬─────────┘                       └─────────┬─────────┘
                       │                                           │
                       ▼                                           ▼
             ┌───────────────────┐                       ┌───────────────────┐
             │ PostgreSQL 16 +   │                       │ Deepgram STT /    │
             │     pgvector      │                       │ ElevenLabs TTS    │
             └───────────────────┘                       └─────────┬─────────┘
                                                                   │
                                                                   ▼
                                                         ┌───────────────────┐
                                                         │ Multi-LLM Router  │
                                                         │ (Sonnet / Haiku / │
                                                         │     GPT-4o)       │
                                                         └───────────────────┘
```

---

## 📁 Blueprint Documentation Index

This repository contains the complete production-grade architectural specification for InterviewGPT under `/docs/`:

| Document                                                                                                      | Description                                                                                       |
| :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------ |
| **[PRODUCT_VISION.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/PRODUCT_VISION.md)**   | Core product mission, strategic North Star, SaaS anti-patterns, and growth KPIs.                  |
| **[PRD.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/PRD.md)**                         | Product Requirements Document covering functional/NFR specs, SLAs, and risk matrices.             |
| **[PERSONAS.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/PERSONAS.md)**               | Detailed user personas, target candidate backgrounds, and Jobs-to-Be-Done (JTBD).                 |
| **[USER_FLOW.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/USER_FLOW.md)**             | End-to-end user journeys with interactive Mermaid sequence and flow diagrams.                     |
| **[FEATURES.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/FEATURES.md)**               | Feature module specs categorized explicitly by MVP vs Post-MVP / Enterprise.                      |
| **[DATABASE.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/DATABASE.md)**               | PostgreSQL 16 schema, `pgvector` HNSW index specs, ER diagrams, and RLS multi-tenancy.            |
| **[API.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/API.md)**                         | REST API schemas, WebSocket streaming protocol, SSE contracts, and rate limiting.                 |
| **[UI_ARCHITECTURE.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/UI_ARCHITECTURE.md)** | Next.js App Router setup, Zustand state management, Web Audio API hooks, and performance budgets. |
| **[DESIGN_SYSTEM.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/DESIGN_SYSTEM.md)**     | HSL dark theme tokens, component matrices, Command Palette (`⌘+K`), and WCAG AA standards.        |
| **[AI_ARCHITECTURE.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/docs/AI_ARCHITECTURE.md)** | Multi-LLM routing, RAG pipeline, STT/TTS low-latency voice loops, and prompt rubrics.             |
| **[PROJECT_RULES.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/PROJECT_RULES.md)**          | Mandatory engineering guidelines, commit conventions, security standards, and testing rules.      |

---

## 🛠️ Technology Stack Summary

- **Frontend**: Next.js 14+ (App Router, React Server Components), TailwindCSS, Zustand, Monaco Editor, `cmdk`.
- **Backend / API**: Node.js / TypeScript, Fastify API Gateway, WebSockets (`ws`), Server-Sent Events (SSE).
- **Database & Vectors**: PostgreSQL 16 with `pgvector` extension, Redis 7+ for streaming cache.
- **AI & Audio Pipeline**:
  - **LLM Engine**: Anthropic Claude 3.5 Sonnet / Haiku, OpenAI GPT-4o / `text-embedding-3-small`.
  - **Speech-to-Text (STT)**: Deepgram Nova-2 Streaming WebSockets.
  - **Text-to-Speech (TTS)**: ElevenLabs Low-Latency Streaming TTS.
- **Authentication**: Clerk / NextAuth (OAuth 2.0, GitHub, Google, Magic Links).
- **Infrastructure**: Vercel (Edge Client), AWS / Cloudflare R2 (Object Storage), Railway / AWS ECS (Database & WebSocket Gateway).

---

## 🔒 Engineering & Security Standards

All contributions to this repository must follow the engineering guidelines set in **[PROJECT_RULES.md](file:///Users/kuldeeplakhera/Nexoraa/Projects/interview_gpt/PROJECT_RULES.md)**:

- **Strict TypeScript (`strict: true`)** across all files.
- **Conventional Commit Messages** (`feat:`, `fix:`, `docs:`, `refactor:`).
- **Row Level Security (RLS)** for multi-tenant data isolation.
- **Sub-800ms Voice P95 Latency SLA**.
