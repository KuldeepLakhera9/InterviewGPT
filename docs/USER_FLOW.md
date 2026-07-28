# InterviewGPT — User Flow Architecture

## Overview

InterviewGPT prioritizes low-friction, high-velocity user journeys. Candidates move seamlessly from onboarding to interactive mock sessions, instant performance scorecards, and personalized practice roadmaps.

---

## 1. Global System Flowchart

```mermaid
flowchart TD
    Start([User Arrives]) --> Auth{Authenticated?}
    Auth -- No --> SignUp[Sign Up / OAuth Login via Clerk]
    SignUp --> WorkspaceSetup[Initialize Personal Workspace]
    Auth -- Yes --> Dashboard[Candidate Command Dashboard]

    WorkspaceSetup --> Dashboard

    Dashboard --> Choice{Primary User Action}

    Choice -- 1. Upload Resume --> ResumeFlow[Resume Parsing & Entity Extraction]
    Choice -- 2. Configure Interview --> ConfigFlow[Session Parameter Selection]
    Choice -- 3. View Roadmap --> RoadmapFlow[Career & Skill Gap Matrix]

    ResumeFlow --> ResumeScore[Resume & JD Alignment Index]
    ResumeScore --> ConfigFlow

    ConfigFlow --> SystemCheck[Mic / Audio & Sandbox Pre-flight Check]
    SystemCheck -- Check Passed --> SessionLive[Live Mock Interview Session]
    SystemCheck -- Check Failed --> TroubleGuide[Audio Troubleshooting Wizard]
    TroubleGuide --> SystemCheck

    SessionLive --> AudioLoop[Low-Latency STT/TTS + Code Sandbox Loop]
    AudioLoop --> SessionComplete[End Session / Auto-Submit]

    SessionComplete --> EvalEngine[Background Evaluation & Scoring Engine]
    EvalEngine --> Scorecard[Detailed Interactive Scorecard]
    Scorecard --> RoadmapUpdate[Update Dynamic Career Roadmap]
    RoadmapUpdate --> Dashboard
```

---

## 2. Detailed User Flow Breakdowns

### 2.1 Resume & Target JD Intelligence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant UI as Frontend App Router
    participant API as Fastify API Gateway
    participant Parser as Resume Parser Service
    participant VectorDB as PgVector Store
    participant LLM as LLM Intelligence Service

    Candidate->>UI: Upload Resume (PDF/DOCX) + Target JD
    UI->>API: POST /api/v1/resumes/upload
    API->>Parser: Extract raw text & structural entities
    Parser->>LLM: Identify skills, projects, tenure & gap areas
    LLM-->>Parser: Structured JSON Resume Profile
    Parser->>VectorDB: Store embeddings for RAG contextual retrieval
    Parser-->>API: Return Resume Profile ID
    API-->>UI: Display Resume Intelligence Summary & Target Match Score (0-100%)
```

---

### 2.2 Live Mock Interview Execution Loop

```mermaid
sequenceDiagram
    autonumber
    actor Candidate
    participant Client as Web Client (Voice/Monaco)
    participant WS as WebSocket Gateway
    participant STT as Deepgram STT Stream
    participant Orchestration as AI Interview Agent
    participant TTS as ElevenLabs TTS Stream

    Candidate->>Client: Click "Start Interview"
    Client->>WS: Connect wss://stream.interviewgpt.com/v1/session/{id}
    WS-->>Client: WebSocket Connected (Session Active)

    WS->>Orchestration: Fetch Session Context (Resume + JD + Type)
    Orchestration->>LLM: Generate Opening Question
    LLM-->>Orchestration: Text Opening Turn
    Orchestration->>TTS: Stream Text to Speech
    TTS-->>Client: Stream Audio Chunks (Speaker Output)

    loop Interactive Conversation Turns
        Candidate->>Client: Speaks into Microphone (Audio Stream)
        Client->>STT: PCM Audio Buffer via WebSocket
        STT-->>WS: Interim & Final Speech Transcripts
        WS-->>Client: Render Live Captions

        opt Technical Coding Session
            Candidate->>Client: Writes Code in Monaco Sandbox
            Client->>WS: Code State Payload (Language, AST, Code)
        end

        Candidate->>Client: Voice Activity Detection (VAD) Silence detected (>1.2s)
        Client->>WS: Turn Complete Signal
        WS->>Orchestration: Evaluate Candidate Response + Code Context
        Orchestration->>LLM: Generate Dynamic Follow-up or Next Question
        LLM-->>Orchestration: Response Text & Internal Evaluation Token
        Orchestration->>TTS: Convert Response Text to Audio
        TTS-->>Client: Audio Stream Output
    end

    Candidate->>Client: Click "End Interview" / Timer Expires
    Client->>WS: Terminate Session
    WS->>Orchestration: Trigger Evaluation Pipeline
```

---

### 2.3 Post-Session Evaluation & Scorecard Flow

```mermaid
flowchart LR
    A[Session Ended] --> B[Aggregate Transcript & Code Payloads]
    B --> C[Run Multi-Pillar Rubric Evaluator]
    C --> D1[Pillar 1: Technical Depth]
    C --> D2[Pillar 2: Communication & WPM/Fillers]
    C --> D3[Pillar 3: Problem Solving]
    C --> D4[Pillar 4: Behavioral STAR Quality]

    D1 & D2 & D3 & D4 --> E[Synthesize Final Scorecard JSON]
    E --> F[Persist to PostgreSQL]
    F --> G[Push Notification to UI]
    G --> H[Render Interactive Scorecard Page]
```

---

### 2.4 Skill Gap & Roadmap Generation Loop

```mermaid
flowchart TD
    Scorecard[Scorecard Generated] --> SkillDiff[Identify Detected Weaknesses]
    SkillDiff --> CompareTree[Compare with Existing User Roadmap]

    CompareTree --> Decision{Node Exists in Roadmap?}
    Decision -- Yes --> UpdateWeight[Increase Priority Weight of Node]
    Decision -- No --> InsertNode[Create New Micro-Skill Practice Node]

    UpdateWeight --> RenderRoadmap[Render Updated Career Roadmap Graph]
    InsertNode --> RenderRoadmap

    RenderRoadmap --> PracticeAction[Candidate Selects Targeted Practice Micro-Session]
    PracticeAction --> FastSession[10-Minute Focused Micro-Mock]
```

---

## 3. Failure & Edge Case Handling Flows

### 3.1 Network Disconnection / WebSocket Drop

1. **Client Detection**: Client detects WebSocket close event (`code != 1000`).
2. **UI State**: Instant banner: _"Reconnecting to interview stream... Session paused."_
3. **Auto-Retry**: Exponential backoff reconnection algorithm (1s, 2s, 4s, max 10s).
4. **State Recovery**: Upon reconnection, Server sends state snapshot containing last transcript turn and timer offset.

### 3.2 Audio Permission Denied / Browser Failure

1. **Pre-flight Check**: System runs browser mic check before entering live room.
2. **Fallback Mode**: If mic access is refused or unsupported, system offers **Keyboard Text Mode** with explicit prompt warning candidate that communication telemetry (WPM/filler words) will be disabled.

### 3.3 LLM API Rate Limit / Provider Failure

1. **Primary Circuit Breaker**: If Anthropic Sonnet times out (>2.5s), request automatically shifts to OpenAI GPT-4o.
2. **Secondary Fallback**: If secondary LLM fails, shift to high-throughput backup model (Llama 3.3 / Groq).
3. **Candidate Experience**: Zero session crash; slight response delay with status badge: _"Synthesizing follow-up..."_
