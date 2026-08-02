import { prisma } from '@/lib/prisma';
import type { LearningHubItemData } from '../types/career.types';

export function getDefaultLearningHubItems(): LearningHubItemData[] {
  return [
    {
      id: 'hub-1',
      type: 'note',
      title: 'Saga Pattern vs Two-Phase Commit Summary',
      category: 'System Design',
      content: {
        text: 'Saga breaks distributed transactions into local transactions coordinated via events or orchestrators. 2PC locks resources across nodes, making Saga preferable for microservices latency.',
      },
      isBookmarked: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hub-2',
      type: 'flashcard',
      title: 'Distributed Systems Core Flashcards',
      category: 'Architecture',
      content: {
        flashcards: [
          {
            question: 'What is CAP Theorem?',
            answer:
              'A distributed system can guarantee at most 2 out of 3: Consistency, Availability, and Partition Tolerance.',
          },
          {
            question: 'What is Idempotency in HTTP APIs?',
            answer:
              'An API method is idempotent if executing it multiple times with the same parameters produces the same server state as a single invocation (e.g., PUT, DELETE).',
          },
        ],
      },
      isBookmarked: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'hub-3',
      type: 'quiz',
      title: 'System Design & State Machine Quiz',
      category: 'Quiz',
      content: {
        quiz: [
          {
            question: 'Which caching strategy writes data to cache and database concurrently?',
            options: ['Cache-Aside', 'Write-Through', 'Write-Behind (Write-Back)', 'Read-Through'],
            correctAnswerIndex: 1,
            explanation:
              'Write-Through updates the cache and the primary DB in a single synchronous transaction.',
          },
        ],
      },
      isBookmarked: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function getLearningHubItems(userId: string): Promise<LearningHubItemData[]> {
  try {
    const items = await prisma.learningHubItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (items.length === 0) {
      return getDefaultLearningHubItems();
    }

    return items.map((item) => ({
      id: item.id,
      type: item.type as LearningHubItemData['type'],
      title: item.title,
      category: item.category,
      content: item.content as LearningHubItemData['content'],
      isBookmarked: item.isBookmarked,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch (err) {
    console.warn('DB getLearningHubItems failed, returning default items:', err);
    return getDefaultLearningHubItems();
  }
}
