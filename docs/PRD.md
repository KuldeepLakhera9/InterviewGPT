# InterviewGPT — Product Requirements Document (PRD)

## 1. Document Control & Overview

| Document Version | Status         | Target Launch | Target Audience                  |
| :--------------- | :------------- | :------------ | :------------------------------- |
| **v1.0.0 (MVP)** | Draft Approved | Q4 2026       | Engineering, Product, Design, AI |

---

## 2. Product Scope & Boundaries

### 2.1 In-Scope (MVP - Phase 1)

- User Authentication (Clerk / OAuth 2.0 / Magic Links).
- Single & Multi-tenant Workspace isolation.
- Resume Upload (PDF/DOCX) & Deep Structuring Parser.
- Job Description (JD) Target Analyzer & Skill Matrix Extraction.
- Mock Interview Engine (Technical Coding & System Design text/voice, HR/Behavioral STAR method).
- Low-latency Audio Voice Stream Engine (STT -> LLM -> TTS).
- Integrated Monaco Code Sandbox with syntax highlighting & simulated execution.
- Real-time Speech Telemetry (WPM, filler words, pause frequency, pitch variance).
- Post-Interview Scorecard & Granular Performance Evaluation.
- Automated Personalized Skill Gap & Career Roadmap Generator.

### 2.2 Out-of-Scope (Post-MVP - Phase 2 & Beyond)

- Live Human Peer-to-Peer Mock Interviews.
- Enterprise Recruiter Hiring Pipeline Integration (Greenhouse/Lever APIs).
- Automated Video Webcam Body Language AI Analysis (Focusing purely on voice/text first to maximize quality and avoid low-signal computer vision AI gimmicks).
- Mobile Native Applications (iOS/Android)—MVP is web-responsive desktop PWA.

---

## 3. Functional Requirements

### 3.1 Authentication & Workspace Management

- **FR-AUTH-01**: Users must be able to sign up and authenticate via Email/Password, Google OAuth, or GitHub OAuth.
- **FR-AUTH-02**: Workspace support allowing individual candidate profiles and multi-member team/institutional spaces.
- **FR-AUTH-03**: Role-Based Access Control (RBAC): `Owner`, `Member`, `Viewer`.

### 3.2 Resume & Target JD Intelligence Engine

- **FR-RES-01**: Candidates can upload PDF/DOCX resumes (up to 10MB).
- **FR-RES-02**: System automatically extracts structured entities: Work History, Technical Skills, Core Projects, Education, Certifications, and Implicit Competencies.
- **FR-RES-03**: Candidates can input a target Job Description (URL or text block).
- **FR-RES-04**: System generates a **Target Alignment Index (0–100%)**, identifying key skill overlaps and critical experience gaps.

### 3.3 Mock Interview Simulation Engine

- **FR-INT-01**: Candidate can choose between two primary tracks:
  1. _Technical Track_ (Data Structures & Algorithms, System Design, Frontend/Backend Architecture).
  2. _HR & Behavioral Track_ (Leadership, Conflict Resolution, STAR Method, Culture Fit).
- **FR-INT-02**: Candidate can select interview parameters: Role Seniority (Junior, Mid, Senior, Staff), Target Company Type (FAANG, High-Growth Startup, Enterprise), and Interview Duration (15m, 30m, 45m).
- **FR-INT-03**: AI Interviewer conducts dynamic turn-taking conversation, adapting question selection based on candidate's uploaded resume and prior responses.
- **FR-INT-04**: Technical track provides an embedded interactive code sandbox with support for TypeScript, Python, Go, and Java.

### 3.4 Audio & Communication Telemetry Engine

- **FR-AUD-01**: Low-latency voice interaction allowing candidates to speak naturally via browser microphone.
- **FR-AUD-02**: Real-time word-level transcription displaying live candidate input.
- **FR-AUD-03**: Automatic extraction of communication metrics:
  - Speaking rate (Words Per Minute).
  - Filler word count (`um`, `uh`, `like`, `you know`, `basically`).
  - Long pause duration detection (>3.5s silent gaps).
  - Tone & Confidence level estimate.

### 3.5 Evaluation & Scorecard Engine

- **FR-EVAL-01**: Instant post-interview report generated within 10 seconds of session completion.
- **FR-EVAL-02**: Overall Score breakdown across 4 primary pillars:
  1. _Technical Accuracy & Depth (0-100)_
  2. _Communication Clarity & Structure (0-100)_
  3. _Problem Solving & Methodology (0-100)_
  4. _Behavioral Framing / STAR Quality (0-100)_
- **FR-EVAL-03**: Question-by-question deep dive with verbatim transcript, optimal model answer comparison, and targeted improvement suggestions.

### 3.6 Personalized Career & Skill Roadmap

- **FR-ROAD-01**: Automatic generation of a dynamic learning tree based on detected interview weak points.
- **FR-ROAD-02**: Nodes represent specific micro-skills (e.g., "Distributed Caching Strategies", "STAR Framing for Project Failures").
- **FR-ROAD-03**: Each node contains curated practice questions, flashcards, and quick simulation exercises.

---

## 4. Non-Functional Requirements (NFRs)

### 4.1 Latency & Performance SLA

- **NFR-PERF-01**: Voice streaming end-to-end turn-taking latency must be **<800ms** at P95 (Mic Stop -> STT -> LLM First Byte -> TTS Audio Start).
- **NFR-PERF-02**: Code execution response returned in **<1.5s**.
- **NFR-PERF-03**: Dashboard Core Web Vitals targets:
  - Largest Contentful Paint (LCP) < 1.2s.
  - Interaction to Next Paint (INP) < 50ms.
  - Cumulative Layout Shift (CLS) < 0.02.

### 4.2 Scalability & Availability

- **NFR-SCALE-01**: System must handle **5,000 concurrent active voice interview streams** without audio degradation or dropped frames.
- **NFR-SCALE-02**: Database architecture must support horizontal scaling up to 10M interview transcript records with vector search response times **<50ms**.
- **NFR-AVAIL-01**: 99.9% monthly uptime SLA across core API endpoints.

### 4.3 Security & Data Privacy (SOC2 & GDPR Compliance)

- **NFR-SEC-01**: All data in transit encrypted using TLS 1.3; data at rest encrypted via AES-256.
- **NFR-SEC-02**: PII (Personally Identifiable Information) scrubber automatically masks phone numbers, home addresses, and SSNs prior to sending raw text to third-party LLM APIs.
- **NFR-PRIV-01**: Full GDPR/CCPA compliance: One-click "Export My Data" and "Delete Account & Audio Data" options.
- **NFR-PRIV-02**: Audio buffer recordings discarded immediately after transcript generation unless user explicitly opts into session audio playback storage.

---

## 5. Risk Analysis & Mitigation Matrix

| Risk Event                                | Severity | Impact                        | Mitigation Strategy                                                                                                                                                  |
| :---------------------------------------- | :------- | :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **LLM Provider API Outage**               | High     | Interview failure mid-session | Automatic failover routing between Anthropic Claude 3.5 Sonnet, OpenAI GPT-4o, and backup Llama 3.3 instances.                                                       |
| **High STT Latency / Audio Stutter**      | High     | Degraded user experience      | Use streaming WebSockets with Deepgram Nova-2 STT & client-side VAD (Voice Activity Detection).                                                                      |
| **AI Hallucination in Technical Grading** | Medium   | False feedback to candidate   | Enforce strict ground-truth evaluation rubrics, multi-stage RAG prompt validation, and JSON-schema structured output forcing.                                        |
| **Cost Overrun on Voice & LLM Tokens**    | Medium   | Low gross margins             | Enforce session token caps per tier (e.g., 30m max per session), rate limits, and model routing efficiency (Haiku/Flash for light turns, Sonnet/4o for evaluations). |
