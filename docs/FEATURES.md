# InterviewGPT — Comprehensive Feature Specification

## Overview

This document defines the functional scope of InterviewGPT across 7 core system modules. Features are explicitly split into **MVP (Phase 1)** and **Post-MVP (Phase 2 / Enterprise)**.

---

## Module 1: Workspace & Authentication Management

### 1.1 MVP Features

#### FEAT-AUTH-01: Multi-Provider Authentication
- **Description**: Secure user authentication supporting Email/Password, Google OAuth, and GitHub OAuth via Clerk/NextAuth.
- **Acceptance Criteria**:
  - Sign-up completed in under 15 seconds.
  - Multi-factor authentication (MFA) supported for enterprise domain logins.
  - Session tokens managed via secure HTTP-only cookies.

#### FEAT-AUTH-02: Personal Workspace Isolation
- **Description**: Isolated workspace tenant created automatically upon candidate onboarding.
- **Acceptance Criteria**:
  - All user resumes, interview transcripts, scorecards, and roadmap data strictly scoped to workspace tenant ID.
  - Cross-tenant data leaks impossible at database schema policy level (Row-Level Security).

### 1.2 Post-MVP / Enterprise Features
- **FEAT-AUTH-03 (B2B)**: Team & Institutional Multi-Tenancy (University/Bootcamp admin licenses).
- **FEAT-AUTH-04 (B2B)**: SAML 2.0 / Okta SSO Integration.

---

## Module 2: Resume Intelligence & Target JD Parser

### 2.1 MVP Features

#### FEAT-RES-01: Document Parsing & Entity Extraction
- **Description**: Upload PDF or DOCX resume to generate a structured JSON profile of candidate competencies.
- **Acceptance Criteria**:
  - File size up to 10MB processed in <3 seconds.
  - Accurately extracts work history, job titles, tenure, education, technical skills, and key project metrics.
  - Generates semantic embeddings stored in PostgreSQL `pgvector`.

#### FEAT-RES-02: Target Job Description Match Engine
- **Description**: Match uploaded resume against a target Job Description (text input or job posting URL).
- **Acceptance Criteria**:
  - Computes **Target Alignment Index (0-100%)**.
  - Highlights top 5 matched competencies and top 5 critical missing skill gaps.
  - Automatically seeds context for custom mock interview questions.

### 2.2 Post-MVP / Enterprise Features
- **FEAT-RES-03**: Auto-Sync from LinkedIn Profile / GitHub Repository metadata.
- **FEAT-RES-04**: Resume Bullet Optimization Generator based on target job postings.

---

## Module 3: Dynamic Mock Interview Simulator

### 3.1 MVP Features

#### FEAT-INT-01: Dual-Track Interview Configuration
- **Description**: Choose between Technical (Algorithms, System Design, Architecture) and HR/Behavioral (STAR Method, Culture, Conflict) interview tracks.
- **Acceptance Criteria**:
  - Selection of Target Role Level (Junior, Mid, Senior, Staff/Principal).
  - Selection of Target Company Tier (FAANG, Enterprise SaaS, High-Growth Startup).
  - Configurable duration (15 min / 30 min / 45 min).

#### FEAT-INT-02: Adaptive Question & Deep-Dive Engine
- **Description**: Dynamic interviewer persona that adjusts follow-up questions in real time based on candidate response quality.
- **Acceptance Criteria**:
  - Drills deeper when candidate gives vague or incomplete answers.
  - Increases question difficulty when candidate demonstrates mastery.
  - Enforces realistic interviewer persona tone (Professional, Technical, Attentive).

### 3.2 Post-MVP / Enterprise Features
- **FEAT-INT-03**: Mock Company-Specific Question Sets (e.g., "Google System Design Track", "Amazon Leadership Principles Track").
- **FEAT-INT-04**: Dual-Interviewer Panel Simulation (Two AI interviewers with distinct roles/tones).

---

## Module 4: Real-time Speech & Communication Telemetry

### 4.1 MVP Features

#### FEAT-AUD-01: Low-Latency Voice Streaming Pipeline
- **Description**: Sub-second full-duplex voice stream for interactive speaking questions.
- **Acceptance Criteria**:
  - End-to-end voice latency < 800ms P95.
  - Visual audio waveform indicator showing real-time mic input levels.
  - Automatic Voice Activity Detection (VAD) to trigger turn completion when user stops speaking for >1.2s.

#### FEAT-AUD-02: Real-time Speech Telemetry Extraction
- **Description**: Continuous background analysis of speech patterns during audio answers.
- **Acceptance Criteria**:
  - Calculation of Words Per Minute (WPM), target range: 130–160 WPM.
  - Detection and classification of filler words (`um`, `uh`, `like`, `basically`, `you know`).
  - Pause density detection (highlighting long silent gaps >3.5 seconds).

### 4.2 Post-MVP / Enterprise Features
- **FEAT-AUD-03**: Vocal Pitch Variance & Stress Level Detection.
- **FEAT-AUD-04**: Multi-Language Support (Spanish, French, German, Mandarin, Hindi).

---

## Module 5: Interactive Code Execution Sandbox

### 5.1 MVP Features

#### FEAT-CODE-01: Monaco Code Editor Integration
- **Description**: VS Code-grade code editor built directly into technical interview sessions.
- **Acceptance Criteria**:
  - Full syntax highlighting, auto-indentation, and bracket matching.
  - Supported languages: TypeScript/JavaScript, Python, Go, Java, C++.
  - Command hotkey execution (`⌘ + Enter` to run code / submit answer).

#### FEAT-CODE-02: Simulated Code Execution Engine
- **Description**: Secure execution of candidate code against problem test cases.
- **Acceptance Criteria**:
  - Isolated execution return within 1.5 seconds.
  - Returns stdout, stderr, execution duration (ms), and pass/fail test status.
  - Provides AI interviewer visibility into code changes in real time.

### 5.2 Post-MVP / Enterprise Features
- **FEAT-CODE-03**: Interactive Architecture Whiteboard / Diagramming Canvas (Mermaid / Excalidraw integration for System Design rounds).

---

## Module 6: Post-Interview Evaluation & Scorecard

### 6.1 MVP Features

#### FEAT-EVAL-01: Multi-Pillar Scorecard Generation
- **Description**: Comprehensive diagnostic report generated instantly upon session finish.
- **Acceptance Criteria**:
  - Scorecard delivered in <10 seconds.
  - Evaluates 4 pillars: Technical Depth (0-100), Communication Clarity (0-100), Problem Solving (0-100), STAR Method Framing (0-100).
  - Includes weighted overall **Session Benchmark Score**.

#### FEAT-EVAL-02: Transcript Deep-Dive & Model Comparison
- **Description**: Itemized breakdown of every question asked during the interview.
- **Acceptance Criteria**:
  - Side-by-side view of Candidate Verbatim Answer vs. AI Model Ideal Answer.
  - Explicit highlight of missing key technical concepts or missed trade-off discussions.

### 6.2 Post-MVP / Enterprise Features
- **FEAT-EVAL-03**: Score Card Export (PDF generation & shareable candidate link).
- **FEAT-EVAL-04**: Peer Benchmark Comparison (Compare performance against top 10% of candidates for same target role level).

---

## Module 7: Dynamic Skill Gap & Career Roadmap

### 7.1 MVP Features

#### FEAT-ROAD-01: Automated Skill Gap Tree
- **Description**: Dynamic learning graph created and updated automatically from interview scorecard results.
- **Acceptance Criteria**:
  - Visual node graph displaying mastered skills, active target skills, and critical weak spots.
  - Weak spot nodes link directly to 10-minute micro-practice exercises.

#### FEAT-ROAD-02: Candidate Progress Dashboard
- **Description**: Historical timeline tracking performance improvement over time.
- **Acceptance Criteria**:
  - Line charts showing WPM stability, filler word reduction, and technical score growth over last 30 days.

### 7.2 Post-MVP / Enterprise Features
- **FEAT-ROAD-03**: AI Mentorship Assistant (Chat with personalized coach on overall career trajectory).
