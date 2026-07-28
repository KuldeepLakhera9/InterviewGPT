# InterviewGPT — Project Rules & Engineering Guidelines

## Executive Summary

This document establishes the mandatory engineering standards, architectural constraints, security rules, and workflow expectations for all developers working on the InterviewGPT codebase.

---

## 1. Architectural Principles

### 1.1 Strict Decoupling of Concerns
- **UI Presentation Layer**: React components must remain pure presentation functions. Zero business logic, raw API fetch calls, or direct SQL queries inside components.
- **Domain & Application Services**: Business logic, evaluation formulas, and AI prompt assembly must live inside dedicated domain service modules (`lib/services/`).
- **Feature-First Architecture**: Group code by business domain (e.g. `features/interviews`, `features/resumes`, `features/scorecards`) rather than arbitrary technical types (`components/`, `utils/`).

### 1.2 TypeScript Standards
- `strict: true` enabled in `tsconfig.json`.
- **NO `any` types permitted**. Use strict interfaces, generics, or `unknown` with type guards.
- All API request/response payloads must be validated at the boundary using `zod` schemas.

---

## 2. Code Quality & Style Standards

### 2.1 Code Formatting & Linting
- **Prettier**: Single quotes, 2-space indentation, trailing commas (`es5`), print width 100.
- **ESLint**: `eslint-config-next`, `@typescript-eslint/recommended`, `eslint-plugin-react-hooks`.
- CI pipeline automatically rejects any pull request with unformatted code or lint warnings.

### 2.2 Naming Conventions
- **Files & Directories**: `kebab-case.ts` / `kebab-case.tsx` (e.g. `use-audio-stream.ts`, `scorecard-gauge.tsx`).
- **Components**: `PascalCase` (e.g. `ScorecardGauge`).
- **Types & Interfaces**: `PascalCase` prefixed with domain if ambiguous (e.g. `InterviewSession`, `ResumeProfile`).
- **Hooks**: `camelCase` prefixed with `use` (e.g. `useAudioStream`).

---

## 3. Git Workflow & Commit Conventions

### 3.1 Branch Naming Convention
- Feature branches: `feat/short-description` (e.g. `feat/audio-vad-processor`).
- Bug fixes: `fix/short-description` (e.g. `fix/scorecard-pillar-calculation`).
- Documentation/Refactoring: `docs/short-description` or `refactor/short-description`.

### 3.2 Commit Message Standards (Conventional Commits)
All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short summary>

[optional body]
```

#### Approved Types
- `feat`: A new feature added to the application.
- `fix`: A bug fix.
- `docs`: Documentation updates only.
- `style`: Code style changes (formatting, missing semi-colons).
- `refactor`: Code change that neither fixes a bug nor adds a feature.
- `test`: Adding missing tests or updating existing tests.
- `chore`: Infrastructure, build configuration, or package updates.

#### Commit Examples
- `feat(audio): add voice activity detection silence timer`
- `fix(db): enforce workspace id row level security policy`
- `docs(api): update websocket payload schemas`

---

## 4. Security & Data Protection Rules

1. **Zero Secrets in Code**: Never hardcode API keys, database connection strings, or JWT secrets in source code. All configuration must be injected via environment variables (`.env.local` / Secret Manager).
2. **PII Masking**: Candidate uploaded resumes and live transcripts must pass through the PII scrubbing utility before being sent to third-party LLM providers.
3. **Database Security (RLS)**: Every SQL table containing workspace data must have Row Level Security enabled with a mandatory `workspace_id` tenant filter.

---

## 5. Testing & Verification Requirements

### 5.1 Test Coverage Expectations
- **Unit Tests**: Minimum 80% coverage on core domain services (`lib/services/`), calculation rubrics, and utility functions using **Vitest**.
- **Integration Tests**: API endpoints tested using **Supertest / Vitest** against a local test PostgreSQL instance.
- **End-to-End (E2E) Tests**: Core candidate user flows (Resume upload -> Configurator -> Scorecard) validated using **Playwright**.

### 5.2 CI/CD Verification Gates
Every Pull Request must pass the following automated checks before merge:
1. `npm run lint` (Zero ESLint warnings).
2. `npm run type-check` (Zero TypeScript compilation errors).
3. `npm run test` (100% unit & integration test pass rate).
4. `npm run build` (Successful Next.js production build).
