# InterviewGPT — API Architecture & Contracts Specification

## Executive Summary

InterviewGPT exposes a hybrid API surface:
1. **REST API (v1)** for resource management (Auth, Workspaces, Resumes, Scorecards, Roadmaps).
2. **WebSocket & SSE Streams** for sub-second, real-time voice, live audio telemetry, and AI interviewer turn-taking.

---

## 1. Authentication & Security Headers

### 1.1 Bearer JWT Scheme
All REST API requests require a valid Bearer token in the `Authorization` header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Workspace-Id: 9f82d1c4-2a6b-4c7e-9d10-8e5f2a1b3c4d
```

### 1.2 Standard Error Schema (RFC 7807 Problem Details)
All API errors return a standard JSON payload:

```json
{
  "type": "https://api.interviewgpt.com/v1/errors/RATE_LIMIT_EXCEEDED",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "Session creation limit exceeded (5 active sessions max per user tier).",
  "instance": "/api/v1/sessions",
  "code": "ERR_RATE_LIMIT",
  "timestamp": "2026-07-28T21:36:00Z"
}
```

---

## 2. REST API v1 Specifications

### 2.1 Resumes & Job Intelligence

#### `POST /api/v1/resumes/upload`
Uploads resume file and triggers asynchronous background parsing.

- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: PDF or DOCX file payload (max 10MB).
  - `target_role` *(optional)*: String (e.g. `"Senior Full Stack Engineer"`).

- **Response (202 Accepted)**:
```json
{
  "id": "e3a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c",
  "status": "processing",
  "file_name": "alex_chen_resume.pdf",
  "estimated_processing_ms": 2500,
  "created_at": "2026-07-28T21:36:00Z"
}
```

#### `GET /api/v1/resumes/{id}`
Fetches parsed resume profile and competency matrix.

- **Response (200 OK)**:
```json
{
  "id": "e3a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c",
  "status": "completed",
  "parsed_profile": {
    "candidate_name": "Alex Chen",
    "years_experience": 2,
    "top_skills": ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
    "work_history": [
      {
        "company": "Tech Corp",
        "role": "Junior Full Stack Engineer",
        "tenure_months": 18
      }
    ]
  },
  "created_at": "2026-07-28T21:36:00Z"
}
```

---

### 2.2 Interview Session Management

#### `POST /api/v1/sessions`
Initializes a new mock interview session.

- **Request Body**:
```json
{
  "track": "technical",
  "seniority_level": "senior",
  "company_tier": "faang",
  "resume_id": "e3a1b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c",
  "job_description_id": "8a7b6c5d-4e3f-2a1b-0c9d-8e7f6a5b4c3d",
  "duration_minutes": 30
}
```

- **Response (201 Created)**:
```json
{
  "session_id": "7f8e9d0c-1b2a-3f4e-5d6c-7b8a9e0f1a2b",
  "status": "created",
  "websocket_stream_url": "wss://stream.interviewgpt.com/v1/session/7f8e9d0c-1b2a-3f4e-5d6c-7b8a9e0f1a2b",
  "auth_ticket": "st_ticket_998877665544332211",
  "created_at": "2026-07-28T21:36:00Z"
}
```

---

### 2.3 Code Execution Engine

#### `POST /api/v1/code/execute`
Executes candidate code in an isolated sandbox.

- **Request Body**:
```json
{
  "session_id": "7f8e9d0c-1b2a-3f4e-5d6c-7b8a9e0f1a2b",
  "question_id": "11223344-5566-7788-9900-aabbccddeeff",
  "language": "typescript",
  "code_content": "function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}"
}
```

- **Response (200 OK)**:
```json
{
  "execution_id": "exec_9900112233",
  "status": "passed",
  "test_cases_passed": 5,
  "test_cases_total": 5,
  "stdout": "All test cases passed successfully.\n",
  "stderr": "",
  "runtime_ms": 42
}
```

---

### 2.4 Scorecard & Evaluation

#### `GET /api/v1/scorecards/{session_id}`
Retrieves complete evaluation scorecard for a completed session.

- **Response (200 OK)**:
```json
{
  "scorecard_id": "sc_445566778899",
  "session_id": "7f8e9d0c-1b2a-3f4e-5d6c-7b8a9e0f1a2b",
  "overall_score": 86.4,
  "pillars": {
    "technical_depth": 88.0,
    "communication_clarity": 82.5,
    "problem_solving": 90.0,
    "behavioral_star": 85.0
  },
  "communication_telemetry": {
    "avg_words_per_minute": 145,
    "total_filler_words": 8,
    "filler_word_breakdown": { "um": 5, "like": 3 },
    "long_pauses_count": 1
  },
  "strengths": [
    "Optimal linear time complexity solution implemented in TypeScript.",
    "Clear verbal explanation of spatial tradeoffs during map storage initialization."
  ],
  "weaknesses": [
    "Did not proactively address potential integer overflow edge cases.",
    "Used 3 filler words during opening problem statement framing."
  ]
}
```

---

## 3. Real-time WebSocket Protocol Specification

### 3.1 Connection Handshake
- **URI**: `wss://stream.interviewgpt.com/v1/session/{session_id}?ticket={auth_ticket}`

### 3.2 Client-to-Server Event Payloads

#### `audio_chunk` (Binary Stream)
PCM 16-bit 16kHz mono audio buffer chunks sent every 100ms.

#### `turn_complete` (JSON Frame)
Sent when client VAD detects microphone silence >1.2 seconds.
```json
{
  "event": "turn_complete",
  "timestamp_ms": 1722199000123
}
```

### 3.3 Server-to-Client Event Payloads

#### `interviewer_audio_stream` (Binary Stream)
Audio chunk output stream from TTS engine.

#### `live_caption` (JSON Frame)
Interim and final speech-to-text transcriptions.
```json
{
  "event": "live_caption",
  "speaker": "candidate",
  "is_final": true,
  "transcript": "I would approach this system design by introducing a distributed Redis cache layer in front of the PostgreSQL primary database.",
  "wpm": 142
}
```

#### `session_state_update` (JSON Frame)
```json
{
  "event": "session_state_update",
  "current_question_index": 2,
  "elapsed_seconds": 645,
  "interviewer_status": "speaking"
}
```

---

## 4. Rate Limiting Strategy

| Endpoint Category | Limit | Enforcement Window | Action on Breach |
| :--- | :--- | :--- | :--- |
| **Auth & Workspace** | 20 req/min | Sliding Window | 429 Too Many Requests |
| **Resume Upload** | 5 files/hour | Fixed Window | 429 + Error message |
| **Session Start** | 10 start/day (Free) | Fixed Window | Prompt Upgrade to Pro |
| **Code Execution** | 30 runs/min | Sliding Window | 429 + Delay execution |
