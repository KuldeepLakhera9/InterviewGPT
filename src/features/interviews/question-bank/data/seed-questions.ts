import type { CreateQuestionInput } from '../types/question-bank.types';

export const SEED_QUESTION_BANK: CreateQuestionInput[] = [
  {
    title: 'Design a High-Throughput Distributed Rate Limiter',
    questionText:
      'Design a scalable distributed rate limiting service for an API gateway handling 500,000 requests/second. Compare Token Bucket, Leaky Bucket, and Sliding Window Counter algorithms. How do you handle race conditions across multi-region Redis clusters?',
    category: 'system_design',
    topic: 'Distributed Systems & Rate Limiting',
    difficulty: 'hard',
    companyTags: ['Google', 'Stripe', 'Meta', 'FAANG'],
    roleTags: ['Systems Architect', 'Senior Backend Engineer', 'Staff Software Engineer'],
    expectedDurationSeconds: 600, // 10 mins
    followUpReferences: [
      {
        id: 'fu-1',
        promptText:
          'How would you handle Redis node failover without dropping active rate limit counters?',
        targetDepth: 'deep',
        hint: 'Consider Redis Sentinel, Cluster sharding, and local memory fallback timers.',
      },
      {
        id: 'fu-2',
        promptText:
          'What client-side HTTP headers should your rate limiter return on HTTP 429 Too Many Requests?',
        targetDepth: 'shallow',
        hint: 'X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After headers.',
      },
    ],
    evaluationMetadata: {
      idealAnswerOutline:
        '1. Functional & Non-functional requirements (500k RPS, <2ms latency, high availability).\n2. Algorithm comparison (Sliding Window Log vs Counter vs Token Bucket).\n3. Centralized vs Local hybrid architecture with Redis + local memory counters.\n4. Concurrency handling using Redis Lua scripts or atomic INCR.\n5. Multi-region synchronization trade-offs (eventual consistency vs strictly consistent bounds).',
      keyConcepts: [
        'Sliding Window Counter',
        'Redis Lua Scripts',
        'API Gateway',
        'Multi-Region Replication',
        'HTTP 429 Status',
      ],
      tradeOffPoints: [
        'Centralized Redis memory overhead vs accuracy of sliding window',
        'Strict global synchronization latency vs local node approximation bucket',
      ],
      scoringCriteria: [
        {
          pillar: 'technical_depth',
          weight: 0.4,
          description:
            'Demonstrates deep mastery of Redis atomic operations and distributed algorithms.',
        },
        {
          pillar: 'problem_solving',
          weight: 0.3,
          description:
            'Clearly structures trade-offs between consistency and sub-2ms latency goals.',
        },
        {
          pillar: 'communication',
          weight: 0.3,
          description: 'Communicates system boundary diagrams and failure modes articulately.',
        },
      ],
      sampleGoodResponse:
        'A strong candidate proposes Sliding Window Counter executed via Redis Lua scripts to eliminate race conditions, paired with local in-memory token buffering for fast fallback during network partitions.',
    },
    isAiGenerated: false,
    source: 'system',
  },
  {
    title: 'React Concurrent Rendering & Fiber Reconciliation',
    questionText:
      'Explain how React 18 Concurrent Rendering works under the hood. How does the Fiber reconciler prioritize state updates using lane models, and how do custom hooks like useTransition and useDeferredValue prevent main-thread UI blocking during heavy re-renders?',
    category: 'technical',
    topic: 'React Internals & Web Performance',
    difficulty: 'medium',
    companyTags: ['Meta', 'Vercel', 'Stripe', 'Unicorn'],
    roleTags: ['Senior Frontend Engineer', 'Full Stack Engineer'],
    expectedDurationSeconds: 450, // 7.5 mins
    followUpReferences: [
      {
        id: 'fu-3',
        promptText:
          'What is the difference between useTransition and useDeferredValue in terms of input responsiveness?',
        targetDepth: 'intermediate',
        hint: 'useTransition wraps state setters; useDeferredValue wraps calculated values.',
      },
    ],
    evaluationMetadata: {
      idealAnswerOutline:
        '1. Fiber node structure vs old recursive virtual DOM diffing.\n2. Work loop breaking work into units executed via MessageChannel / scheduler.\n3. Priority lanes (SyncLane, InputContinuousLane, TransitionLane).\n4. Practical usage of useTransition for non-blocking search filtering.',
      keyConcepts: [
        'React Fiber',
        'Priority Lanes',
        'useTransition',
        'Main Thread Blocking',
        'Scheduler API',
      ],
      tradeOffPoints: [
        'Immediate rendering responsiveness vs eventual UI updates',
        'Memory allocation overhead of dual-buffering Fiber trees',
      ],
      scoringCriteria: [
        {
          pillar: 'technical_depth',
          weight: 0.5,
          description: 'Accurately explains Fiber unit-of-work scheduling and Priority Lanes.',
        },
        {
          pillar: 'communication',
          weight: 0.5,
          description:
            'Translates internal React mechanics into practical UI performance guidelines.',
        },
      ],
    },
    isAiGenerated: false,
    source: 'system',
  },
  {
    title: 'STAR Behavioral: Navigating Technical Disagreements in Architecture',
    questionText:
      'Describe a situation where you had a significant architectural disagreement with a senior teammate or principal engineer regarding a critical project choice. How did you structure your argument, test hypotheses, and arrive at alignment using data?',
    category: 'behavioral',
    topic: 'Leadership & Conflict Resolution',
    difficulty: 'medium',
    companyTags: ['Amazon', 'Google', 'Apple', 'FAANG'],
    roleTags: [
      'Senior Frontend Engineer',
      'Systems Architect',
      'Full Stack Engineer',
      'Engineering Manager',
    ],
    expectedDurationSeconds: 300, // 5 mins
    followUpReferences: [
      {
        id: 'fu-4',
        promptText:
          'If the team ultimately decided to go with your peer’s proposal instead of yours, how did you commit and ensure project momentum?',
        targetDepth: 'intermediate',
        hint: 'Demonstrate "Disagree and Commit" principles and accountability.',
      },
    ],
    evaluationMetadata: {
      idealAnswerOutline:
        '1. Situation: Context of the project and specific architectural dispute (e.g. REST vs GraphQL vs gRPC).\n2. Task: Responsibility to resolve disagreement without causing friction.\n3. Action: Benchmarking, prototype spikes, trade-off matrix documentation, unbiased data presentation.\n4. Result: Outcome, team trust impact, and post-launch telemetry performance.',
      keyConcepts: [
        'STAR Method',
        'Disagree and Commit',
        'Benchmarking Data',
        'Stakeholder Management',
      ],
      tradeOffPoints: ['Persisting on technical perfection vs project deadline delivery'],
      scoringCriteria: [
        {
          pillar: 'star_framework',
          weight: 0.5,
          description: 'Clearly structures Situation, Task, Action, and measurable Result.',
        },
        {
          pillar: 'communication',
          weight: 0.5,
          description:
            'Shows emotional intelligence, psychological safety, and data-driven conviction.',
        },
      ],
    },
    isAiGenerated: false,
    source: 'system',
  },
  {
    title: 'LRU Cache Design with O(1) Time Complexity',
    questionText:
      'Implement a Least Recently Used (LRU) Cache data structure supporting get(key) and put(key, value) operations in O(1) time complexity. Explain your choice of underlying data structures and write clean, fully executable code.',
    category: 'coding',
    topic: 'Data Structures & Algorithms',
    difficulty: 'medium',
    companyTags: ['Amazon', 'Google', 'Microsoft', 'Uber'],
    roleTags: ['Senior Frontend Engineer', 'Full Stack Engineer', 'Junior Engineer'],
    expectedDurationSeconds: 450,
    followUpReferences: [
      {
        id: 'fu-5',
        promptText:
          'How would you make this LRU Cache thread-safe for a multi-threaded C++ or Java runtime?',
        targetDepth: 'deep',
        hint: 'Consider mutex locks, Read-Write Locks, or ConcurrentHashMap + ConcurrentLinkedQueue.',
      },
    ],
    evaluationMetadata: {
      idealAnswerOutline:
        '1. Combine HashMap (for O(1) key lookup) with Doubly Linked List (for O(1) node insertion & removal).\n2. Head and Tail dummy nodes to prevent null checks on boundaries.\n3. Implement moveToHead and removeNode helper methods.\n4. Handle capacity limit overflow by evicting tail.prev node.',
      keyConcepts: ['Doubly Linked List', 'HashMap', 'O(1) Complexity', 'Memory Eviction Policy'],
      tradeOffPoints: ['Doubly linked list pointer memory overhead vs O(1) time complexity'],
      scoringCriteria: [
        {
          pillar: 'technical_depth',
          weight: 0.6,
          description: 'Writes bug-free O(1) code handling edge cases cleanly.',
        },
        {
          pillar: 'problem_solving',
          weight: 0.4,
          description: 'Explains trade-offs of combining hash tables and pointers.',
        },
      ],
    },
    isAiGenerated: false,
    source: 'system',
  },
  {
    title: 'Design a Distributed Real-time Collaborative Document Editor',
    questionText:
      'Design a real-time collaborative document editing system like Google Docs or Figma. Compare Operational Transformation (OT) versus Conflict-free Replicated Data Types (CRDTs). How do you manage WebSocket scaling, offline edits, and event ordering?',
    category: 'architecture',
    topic: 'Distributed Systems & Real-time Collaboration',
    difficulty: 'expert',
    companyTags: ['Google', 'Figma', 'Meta', 'OpenAI'],
    roleTags: ['Systems Architect', 'Staff Software Engineer'],
    expectedDurationSeconds: 900, // 15 mins
    followUpReferences: [
      {
        id: 'fu-6',
        promptText:
          'How do you handle CRDT garbage collection when documents accumulate millions of deleted tombstone markers?',
        targetDepth: 'deep',
        hint: 'State snapshotting, causal tree pruning, and periodic compaction.',
      },
    ],
    evaluationMetadata: {
      idealAnswerOutline:
        '1. Functional requirements (sub-100ms latency, multi-user concurrency, offline sync).\n2. Operational Transformation (centralized server needed) vs CRDTs (decentralized causal ordering).\n3. WebSocket Gateway cluster with Redis Pub/Sub for session routing.\n4. Persistence layer using append-only log + periodic vector clock snapshots.',
      keyConcepts: ['CRDTs vs OT', 'WebSocket Pub/Sub', 'Vector Clocks', 'State Snapshotting'],
      tradeOffPoints: ['Server-centric OT coordination vs CRDT client memory tombstones'],
      scoringCriteria: [
        {
          pillar: 'technical_depth',
          weight: 0.5,
          description:
            'Demonstrates mastery of CRDT mathematical convergence and distributed state sync.',
        },
        {
          pillar: 'problem_solving',
          weight: 0.5,
          description: 'Designs resilient system handling network latency and offline edits.',
        },
      ],
    },
    isAiGenerated: false,
    source: 'system',
  },
  {
    title: 'AI Prompt Engineering & RAG Context Window Optimization',
    questionText:
      'You are building a Retrieval-Augmented Generation (RAG) agent for a technical documentation search. How do you design chunking strategies, vector index embeddings (HNSW), and re-ranking models to maximize precision while minimizing context window LLM token costs?',
    category: 'technical',
    topic: 'AI Systems & RAG Architecture',
    difficulty: 'hard',
    companyTags: ['OpenAI', 'Anthropic', 'Unicorn'],
    roleTags: ['AI / ML Engineer', 'Full Stack Engineer', 'Systems Architect'],
    expectedDurationSeconds: 600,
    followUpReferences: [
      {
        id: 'fu-7',
        promptText:
          'When should you choose BM25 hybrid search over pure vector cosine distance search?',
        targetDepth: 'intermediate',
        hint: 'BM25 excels at exact keyword match (code identifiers, function names).',
      },
    ],
    evaluationMetadata: {
      idealAnswerOutline:
        '1. Semantic chunking strategies (parent-document vs fixed token overlap).\n2. Embedding generation & pgvector HNSW indexing.\n3. Hybrid search combining BM25 keyword matching and vector dense retrieval.\n4. Cohere/Cross-Encoder re-ranking to pass top-K snippets to LLM.',
      keyConcepts: ['RAG Architecture', 'HNSW Indexing', 'BM25 Hybrid Search', 'Re-ranking Models'],
      tradeOffPoints: ['Vector search latency vs LLM token cost & accuracy'],
      scoringCriteria: [
        {
          pillar: 'technical_depth',
          weight: 0.5,
          description:
            'Understands vector embeddings, similarity metrics, and LLM context constraints.',
        },
        {
          pillar: 'communication',
          weight: 0.5,
          description: 'Explains AI retrieval pipelines with clarity.',
        },
      ],
    },
    isAiGenerated: true,
    source: 'ai_generated',
  },
];
