'use client';

import * as React from 'react';
import { Plus, Check, Sparkles } from 'lucide-react';
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
import type {
  CreateQuestionInput,
  QuestionBankItemData,
  QuestionCategory,
  QuestionDifficulty,
} from '../types/question-bank.types';
import { createQuestionAction } from '../actions/question-bank.actions';

interface CreateQuestionModalProps {
  onQuestionCreated?: (question: QuestionBankItemData) => void;
}

export function CreateQuestionModal({ onQuestionCreated }: CreateQuestionModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form State
  const [title, setTitle] = React.useState('');
  const [questionText, setQuestionText] = React.useState('');
  const [category, setCategory] = React.useState<QuestionCategory>('technical');
  const [topic, setTopic] = React.useState('');
  const [difficulty, setDifficulty] = React.useState<QuestionDifficulty>('medium');
  const [companyTagsInput, setCompanyTagsInput] = React.useState('');
  const [roleTagsInput, setRoleTagsInput] = React.useState('');
  const [durationMinutes, setDurationMinutes] = React.useState(5);
  const [idealOutline, setIdealOutline] = React.useState('');
  const [keyConceptsInput, setKeyConceptsInput] = React.useState('');
  const [followUpInput, setFollowUpInput] = React.useState('');
  const [isAiGenerated, setIsAiGenerated] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !questionText.trim() || !topic.trim() || !idealOutline.trim()) {
      toast({
        variant: 'danger',
        title: 'Validation Error',
        description: 'Please fill in Title, Question Text, Topic, and Ideal Answer Outline.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const companyTags = companyTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const roleTags = roleTagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const keyConcepts = keyConceptsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const followUpReferences = followUpInput.trim()
        ? [
            {
              id: `fu-${Date.now()}`,
              promptText: followUpInput.trim(),
              targetDepth: 'intermediate' as const,
            },
          ]
        : [];

      const input: CreateQuestionInput = {
        title: title.trim(),
        questionText: questionText.trim(),
        category,
        topic: topic.trim(),
        difficulty,
        companyTags,
        roleTags,
        expectedDurationSeconds: durationMinutes * 60,
        followUpReferences,
        evaluationMetadata: {
          idealAnswerOutline: idealOutline.trim(),
          keyConcepts: keyConcepts.length > 0 ? keyConcepts : ['General Mastery'],
          tradeOffPoints: [],
          scoringCriteria: [],
        },
        isAiGenerated,
        source: isAiGenerated ? 'ai_generated' : 'user_custom',
      };

      const res = await createQuestionAction(input);

      if (res.success && res.data) {
        toast({
          title: 'Question Created',
          description: `Question "${res.data.title}" added to repository.`,
        });
        if (onQuestionCreated) {
          onQuestionCreated(res.data);
        }
        setIsOpen(false);
        // Reset form
        setTitle('');
        setQuestionText('');
        setTopic('');
        setIdealOutline('');
        setCompanyTagsInput('');
        setRoleTagsInput('');
        setKeyConceptsInput('');
        setFollowUpInput('');
      } else {
        toast({
          variant: 'danger',
          title: 'Creation Failed',
          description: res.error || 'Failed to create question.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected error occurred while creating question.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="space-x-1.5 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-500"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Question</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg font-bold">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <span>Create Question Repository Entry</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)]">
              Add a new structured interview question with topic, tags, duration, and evaluation
              rubric.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title & Category */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-title" className="text-xs font-semibold">
                  Question Title *
                </Label>
                <Input
                  id="q-title"
                  placeholder="e.g. Design Distributed Cache"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Category *</Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as QuestionCategory)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="system_design">System Design</SelectItem>
                    <SelectItem value="behavioral">Behavioral (STAR)</SelectItem>
                    <SelectItem value="coding">Coding</SelectItem>
                    <SelectItem value="architecture">Architecture</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-1.5">
              <Label htmlFor="q-text" className="text-xs font-semibold">
                Question Prompt Text *
              </Label>
              <Textarea
                id="q-text"
                placeholder="Full question prompt asked to candidate..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="min-h-[90px] text-xs"
                required
              />
            </div>

            {/* Topic, Difficulty & Duration */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="q-topic" className="text-xs font-semibold">
                  Topic Name *
                </Label>
                <Input
                  id="q-topic"
                  placeholder="e.g. Distributed Memory"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Difficulty *</Label>
                <Select
                  value={difficulty}
                  onValueChange={(val) => setDifficulty(val as QuestionDifficulty)}
                >
                  <SelectTrigger className="text-xs">
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
                <Label htmlFor="q-duration" className="text-xs font-semibold">
                  Duration (Minutes)
                </Label>
                <Input
                  id="q-duration"
                  type="number"
                  min={1}
                  max={60}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Company & Role Tags */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-ctags" className="text-xs font-semibold">
                  Company Tags (Comma Separated)
                </Label>
                <Input
                  id="q-ctags"
                  placeholder="Google, Meta, Stripe"
                  value={companyTagsInput}
                  onChange={(e) => setCompanyTagsInput(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-rtags" className="text-xs font-semibold">
                  Role Tags (Comma Separated)
                </Label>
                <Input
                  id="q-rtags"
                  placeholder="Senior Frontend, Systems Architect"
                  value={roleTagsInput}
                  onChange={(e) => setRoleTagsInput(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Ideal Answer Outline */}
            <div className="space-y-1.5">
              <Label htmlFor="q-outline" className="text-xs font-semibold">
                Ideal Answer Outline & Rubric *
              </Label>
              <Textarea
                id="q-outline"
                placeholder="Key solution steps, expectations, and evaluation points..."
                value={idealOutline}
                onChange={(e) => setIdealOutline(e.target.value)}
                className="min-h-[80px] text-xs"
                required
              />
            </div>

            {/* Key Concepts & Follow-up Prompt */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="q-concepts" className="text-xs font-semibold">
                  Key Concepts (Comma Separated)
                </Label>
                <Input
                  id="q-concepts"
                  placeholder="Concurrency, Hashing, Failover"
                  value={keyConceptsInput}
                  onChange={(e) => setKeyConceptsInput(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="q-followup" className="text-xs font-semibold">
                  Sample Follow-up Probe
                </Label>
                <Input
                  id="q-followup"
                  placeholder="How would you handle node crash?"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            {/* AI Generated Flag Toggle */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="ai-generated-chk"
                checked={isAiGenerated}
                onChange={(e) => setIsAiGenerated(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="ai-generated-chk" className="cursor-pointer text-xs">
                Flag as AI-Generated Question
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-blue-600 text-xs font-medium text-white hover:bg-blue-500"
            >
              {isSubmitting ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Check className="mr-1 h-3.5 w-3.5" />
                  <span>Save Question to Bank</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
