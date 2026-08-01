'use client';

import * as React from 'react';
import { Sparkles, Loader2, CheckCircle2, Flame, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import type { QuestionBankItemData } from '../../question-bank/types/question-bank.types';
import type { QuestionGeneratorInput } from '../types/question-generator.types';
import { generateQuestionsAction } from '../actions/question-generator.actions';

interface QuestionGeneratorDialogProps {
  onQuestionsGenerated?: (questions: QuestionBankItemData[]) => void;
  defaultConfig?: Partial<QuestionGeneratorInput>;
}

export function QuestionGeneratorDialog({
  onQuestionsGenerated,
  defaultConfig,
}: QuestionGeneratorDialogProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Input states
  const [roleTitle, setRoleTitle] = React.useState(
    defaultConfig?.roleTitle || 'Senior Full Stack Engineer'
  );
  const [seniorityLevel, setSeniorityLevel] = React.useState<
    QuestionGeneratorInput['seniorityLevel']
  >(defaultConfig?.seniorityLevel || 'senior');
  const [companyName, setCompanyName] = React.useState(defaultConfig?.companyName || 'Google');
  const [companyTier, setCompanyTier] = React.useState<QuestionGeneratorInput['companyTier']>(
    defaultConfig?.companyTier || 'faang'
  );
  const [track, setTrack] = React.useState<QuestionGeneratorInput['track']>(
    defaultConfig?.track || 'technical'
  );
  const [difficulty, setDifficulty] = React.useState<QuestionGeneratorInput['difficulty']>(
    defaultConfig?.difficulty || 'hard'
  );
  const [questionCount, setQuestionCount] = React.useState(3);
  const [jobDescriptionText, setJobDescriptionText] = React.useState(
    defaultConfig?.jobDescriptionText || ''
  );

  // Result state
  const [generatedResult, setGeneratedResult] = React.useState<{
    summary: string;
    questions: QuestionBankItemData[];
    isFallback: boolean;
  } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const input: QuestionGeneratorInput = {
        roleTitle: roleTitle.trim(),
        seniorityLevel,
        companyName: companyName.trim(),
        companyTier,
        track,
        difficulty,
        targetQuestionCount: questionCount,
        jobDescriptionText: jobDescriptionText.trim() || undefined,
        saveToQuestionBank: true,
      };

      const res = await generateQuestionsAction(input);

      if (res.success && res.data) {
        setGeneratedResult(res.data);
        toast({
          title: 'AI Questions Generated!',
          description: `Generated ${res.data.questions.length} tailored interview questions.`,
        });
        if (onQuestionsGenerated) {
          onQuestionsGenerated(res.data.questions);
        }
      } else {
        toast({
          variant: 'danger',
          title: 'Generation Failed',
          description: res.error || 'Failed to generate questions.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected error occurred during AI question generation.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white shadow-sm hover:from-purple-500 hover:to-indigo-500"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate AI Question Set</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <form onSubmit={handleGenerate}>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-purple-400" />
              <span>AI Question Generator Engine</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)]">
              Synthesize tailored, non-repetitive interview questions with gradual difficulty
              escalation and experience references.
            </DialogDescription>
          </DialogHeader>

          {!generatedResult ? (
            <div className="space-y-4 py-4">
              {/* Target Role & Seniority */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="gen-role" className="text-xs font-semibold">
                    Target Role Title *
                  </Label>
                  <Input
                    id="gen-role"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    className="bg-[var(--bg-surface-2)] text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Seniority Level *</Label>
                  <Select
                    value={seniorityLevel}
                    onValueChange={(val) =>
                      setSeniorityLevel(val as QuestionGeneratorInput['seniorityLevel'])
                    }
                  >
                    <SelectTrigger className="bg-[var(--bg-surface-2)] text-xs">
                      <SelectValue placeholder="Select Seniority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junior">Junior (0-2 yrs)</SelectItem>
                      <SelectItem value="mid">Mid-Level (2-5 yrs)</SelectItem>
                      <SelectItem value="senior">Senior (5-8 yrs)</SelectItem>
                      <SelectItem value="staff">Staff / Principal (8+ yrs)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Target Company & Tier */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="gen-company" className="text-xs font-semibold">
                    Target Company Name
                  </Label>
                  <Input
                    id="gen-company"
                    placeholder="e.g. Google, Stripe, OpenAI"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-[var(--bg-surface-2)] text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Company Tier *</Label>
                  <Select
                    value={companyTier}
                    onValueChange={(val) =>
                      setCompanyTier(val as QuestionGeneratorInput['companyTier'])
                    }
                  >
                    <SelectTrigger className="bg-[var(--bg-surface-2)] text-xs">
                      <SelectValue placeholder="Select Tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faang">FAANG / Big Tech</SelectItem>
                      <SelectItem value="startup">High-Growth Unicorn</SelectItem>
                      <SelectItem value="enterprise">Enterprise SaaS</SelectItem>
                      <SelectItem value="fintech">FinTech / Quant</SelectItem>
                      <SelectItem value="early_stage">Early Stage Startup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Track, Base Difficulty & Question Count */}
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Interview Track *</Label>
                  <Select
                    value={track}
                    onValueChange={(val) => setTrack(val as QuestionGeneratorInput['track'])}
                  >
                    <SelectTrigger className="bg-[var(--bg-surface-2)] text-xs">
                      <SelectValue placeholder="Select Track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Algorithms</SelectItem>
                      <SelectItem value="system_design">System Design</SelectItem>
                      <SelectItem value="behavioral">Behavioral STAR</SelectItem>
                      <SelectItem value="full_loop">Full Loop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Base Difficulty *</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(val) =>
                      setDifficulty(val as QuestionGeneratorInput['difficulty'])
                    }
                  >
                    <SelectTrigger className="bg-[var(--bg-surface-2)] text-xs">
                      <SelectValue placeholder="Select Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="gen-count" className="text-xs font-semibold">
                    Question Count (1-5)
                  </Label>
                  <Input
                    id="gen-count"
                    type="number"
                    min={1}
                    max={5}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="bg-[var(--bg-surface-2)] text-xs"
                  />
                </div>
              </div>

              {/* Optional Job Description */}
              <div className="space-y-1.5">
                <Label htmlFor="gen-jd" className="text-xs font-semibold">
                  Target Job Description Text (Optional)
                </Label>
                <Textarea
                  id="gen-jd"
                  placeholder="Paste target JD requirements to anchor questions..."
                  value={jobDescriptionText}
                  onChange={(e) => setJobDescriptionText(e.target.value)}
                  className="min-h-[80px] bg-[var(--bg-surface-2)] text-xs"
                />
              </div>
            </div>
          ) : (
            /* Generated Results View */
            <div className="space-y-4 py-4">
              <div className="space-y-2 rounded-xl border border-purple-500/30 bg-purple-500/10 p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-400" />
                  <h4 className="text-xs font-bold tracking-wider text-purple-300 uppercase">
                    AI Generation Summary
                  </h4>
                </div>
                <p className="text-xs leading-relaxed text-[var(--text-primary)]">
                  {generatedResult.summary}
                </p>
              </div>

              {/* Questions Progression Ladder */}
              <div className="space-y-3">
                <h4 className="flex items-center space-x-1.5 text-xs font-bold tracking-wider text-[var(--text-primary)] uppercase">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span>
                    Generated Questions Progression Ladder ({generatedResult.questions.length})
                  </span>
                </h4>

                <div className="space-y-2.5">
                  {generatedResult.questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="space-y-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 font-semibold text-purple-300">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500/20 text-[10px] font-bold text-purple-400">
                            {idx + 1}
                          </span>
                          <span>{q.title}</span>
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 uppercase">
                            {q.category}
                          </span>
                          <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 capitalize">
                            {q.difficulty}
                          </span>
                        </div>
                      </div>

                      <p className="leading-relaxed text-[var(--text-primary)]">{q.questionText}</p>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-secondary)]">
                        <span>
                          Topic: <strong>{q.topic}</strong>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-cyan-400" />
                          <span>{Math.round(q.expectedDurationSeconds / 60)}m</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-[var(--border-subtle)] pt-3">
            {generatedResult ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGeneratedResult(null)}
                className="text-xs"
              >
                Regenerate / Adjust Parameters
              </Button>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            )}

            {!generatedResult ? (
              <Button
                type="submit"
                size="sm"
                disabled={isGenerating}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold text-white hover:from-purple-500 hover:to-indigo-500"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    <span>Synthesizing Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-300" />
                    <span>Generate Tailored Questions</span>
                  </>
                )}
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                <span>Done & View in Repository</span>
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
