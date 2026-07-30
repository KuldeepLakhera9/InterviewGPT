import { prisma } from '@/lib/prisma';

export interface ContextChunk {
  source: 'ParsedResume' | 'AtsAnalysis' | 'ResumeOptimisation' | 'JobMatchComparison';
  title: string;
  snippet: string;
}

export async function retrieveResumeRagContext(
  resumeId: string,
  userQuery: string
): Promise<ContextChunk[]> {
  const chunks: ContextChunk[] = [];

  try {
    const resumeRecord = await prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        parsedResume: true,
        atsAnalysis: true,
        optimisations: { orderBy: { createdAt: 'desc' }, take: 2 },
        jobMatches: { orderBy: { createdAt: 'desc' }, take: 2 },
      },
    });

    if (!resumeRecord) return [];

    // 1. Index Parsed Resume Data
    if (resumeRecord.parsedResume) {
      const pr = resumeRecord.parsedResume;
      const sd = pr.structuredData as Record<string, unknown>;

      chunks.push({
        source: 'ParsedResume',
        title: 'Candidate Profile & Summary',
        snippet: `Summary: ${typeof sd.summary === 'string' ? sd.summary : pr.cleanedText.slice(0, 300)}`,
      });

      if (Array.isArray(sd.skills)) {
        chunks.push({
          source: 'ParsedResume',
          title: 'Technical & Professional Skills',
          snippet: `Skills: ${sd.skills.join(', ')}`,
        });
      }

      if (Array.isArray(sd.experience)) {
        chunks.push({
          source: 'ParsedResume',
          title: 'Work Experience History',
          snippet: `Experience: ${JSON.stringify(sd.experience).slice(0, 500)}`,
        });
      }
    }

    // 2. Index ATS Analysis Data
    if (resumeRecord.atsAnalysis) {
      const ats = resumeRecord.atsAnalysis;
      chunks.push({
        source: 'AtsAnalysis',
        title: 'ATS & Recruiter Evaluation Scores',
        snippet: `ATS Readability Score: ${ats.atsScore}/100. Recruiter Impression Score: ${ats.recruiterScore}/100. Overall Readability Confidence: High.`,
      });

      chunks.push({
        source: 'AtsAnalysis',
        title: 'ATS Missing Keywords & Weak Sections',
        snippet: `Missing Keywords: ${JSON.stringify(ats.missingKeywords)}. Weak Sections: ${JSON.stringify(ats.weakSections)}. Strengths: ${JSON.stringify(ats.strengths)}.`,
      });

      chunks.push({
        source: 'AtsAnalysis',
        title: 'ATS Suggestions & Formatting Audit',
        snippet: `Suggestions: ${JSON.stringify(ats.suggestions)}. Formatting Feedback: ${JSON.stringify(ats.formattingFeedback)}.`,
      });
    }

    // 3. Index Optimisations Data
    if (resumeRecord.optimisations.length > 0) {
      const opt = resumeRecord.optimisations[0];
      chunks.push({
        source: 'ResumeOptimisation',
        title: 'AI Resume Optimisations',
        snippet: `Optimised Summary: ${opt.optimisedSummary}. Rewritten Bullets: ${JSON.stringify(opt.optimisedBullets).slice(0, 400)}.`,
      });
    }

    // 4. Index Job Matches Data
    if (resumeRecord.jobMatches.length > 0) {
      const jm = resumeRecord.jobMatches[0];
      chunks.push({
        source: 'JobMatchComparison',
        title: `Job Match with ${jm.jobTitle || 'Target Role'}`,
        snippet: `Overall Match: ${jm.overallMatchPercentage}%. Missing Skills: ${JSON.stringify(jm.missingSkills)}. Keyword Gaps: ${JSON.stringify(jm.keywordGaps)}.`,
      });
    }
  } catch (err) {
    console.warn('RAG retrieval fallback for test/unconnected environments:', err);
  }

  // Filter chunks relevant to user query keywords
  const queryLower = userQuery.toLowerCase();
  const relevantChunks = chunks.filter((chunk) => {
    if (queryLower.includes('ats') || queryLower.includes('score')) {
      return chunk.source === 'AtsAnalysis' || chunk.title.includes('Scores');
    }
    if (queryLower.includes('weak') || queryLower.includes('improve')) {
      return chunk.source === 'AtsAnalysis' || chunk.source === 'ResumeOptimisation';
    }
    if (queryLower.includes('skill') || queryLower.includes('keyword')) {
      return chunk.title.includes('Skills') || chunk.title.includes('Keywords');
    }
    return true;
  });

  return relevantChunks.length > 0 ? relevantChunks : chunks;
}
