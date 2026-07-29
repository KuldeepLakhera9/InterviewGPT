import { describe, expect, it } from 'vitest';
import { analyticsService } from '../analytics/services/analytics.service';

describe('Resume Analytics Service', () => {
  it('should aggregate ATS history, keyword trends, improvement trends, profile completion, and domain skill coverage', async () => {
    const analytics = await analyticsService.getResumeAnalytics('test-user-id');

    // Verify Overall Completion Percentage
    expect(analytics.overallCompletionPercentage).toBeGreaterThanOrEqual(0);
    expect(analytics.overallCompletionPercentage).toBeLessThanOrEqual(100);

    // 1. Verify ATS History Points
    expect(analytics.atsHistory.length).toBeGreaterThan(0);
    expect(analytics.atsHistory[0]).toHaveProperty('version');
    expect(analytics.atsHistory[0]).toHaveProperty('score');

    // 2. Verify Keyword Trends
    expect(analytics.keywordTrends.length).toBeGreaterThan(0);
    expect(analytics.keywordTrends[0]).toHaveProperty('category');
    expect(analytics.keywordTrends[0]).toHaveProperty('optimisedCount');

    // 3. Verify Improvement Trends
    expect(analytics.improvementTrends.length).toBeGreaterThan(0);
    expect(analytics.improvementTrends[0]).toHaveProperty('actionVerbStrength');

    // 4. Verify Profile Completion Breakdown
    expect(analytics.profileCompletionSections.length).toBe(7);
    expect(analytics.profileCompletionSections[0]).toHaveProperty('sectionName');

    // 5. Verify Skill Coverage Domains
    expect(analytics.skillCoverageDomains.length).toBe(5);
    expect(analytics.skillCoverageDomains[0]).toHaveProperty('domain');
    expect(analytics.skillCoverageDomains[0]).toHaveProperty('coveragePercentage');
  });
});
