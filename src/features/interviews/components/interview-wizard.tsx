'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  Loader2,
  Play,
  Save,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import type {
  InterviewConfigData,
  InterviewPresetItem,
  InterviewWizardState,
  ResumeRecommendationItem,
  StepStatus,
} from '../types/interview-wizard.types';
import { interviewConfigSchema, validateInterviewStep } from '../schemas/interview-wizard.schema';
import { calculateConfigCompletion } from '../services/interview-wizard.service';
import {
  createInterviewSessionAction,
  saveInterviewDraftAction,
} from '../actions/interview-wizard.actions';

import { ProgressStepper, STEP_CONFIGS } from './progress-stepper';
import { PresetSelector } from './preset-selector';
import { ResumeRecommendationCard } from './resume-recommendation-card';
import { Step1Role } from './steps/step-1-role';
import { Step2Company } from './steps/step-2-company';
import { Step3Type } from './steps/step-3-type';
import { Step4Difficulty } from './steps/step-4-difficulty';
import { Step5Duration } from './steps/step-5-duration';
import { Step6Review } from './steps/step-6-review';

interface InterviewWizardProps {
  initialState: InterviewWizardState;
}

export function InterviewWizard({ initialState }: InterviewWizardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = React.useState<number>(initialState.currentStep || 1);
  const [isSavingDraft, setIsSavingDraft] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [presets, setPresets] = React.useState<InterviewPresetItem[]>(initialState.presets || []);

  const form = useForm<InterviewConfigData>({
    resolver: zodResolver(interviewConfigSchema),
    defaultValues: initialState.data,
    mode: 'onTouched',
  });

  const formValues = form.watch();

  // Dynamically compute completion %
  const completionPercentage = React.useMemo(() => {
    return calculateConfigCompletion(formValues);
  }, [formValues]);

  // Compute validation status for each step
  const stepStatuses: StepStatus[] = React.useMemo(() => {
    return STEP_CONFIGS.map((config) => {
      const stepNum = config.stepNumber;
      if (stepNum === 6) {
        return {
          stepNumber: 6,
          title: config.title,
          subtitle: config.subtitle,
          isCompleted: completionPercentage >= 90,
          isValid: true,
        };
      }
      const valResult = validateInterviewStep(stepNum, formValues);
      return {
        stepNumber: stepNum,
        title: config.title,
        subtitle: config.subtitle,
        isCompleted: valResult.isValid,
        isValid: valResult.isValid,
      };
    });
  }, [formValues, completionPercentage]);

  // Save Draft Action
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const currentData = form.getValues();
      const res = await saveInterviewDraftAction(currentStep, currentData);

      if (res.success) {
        toast({
          title: 'Draft Saved',
          description: res.message || 'Interview configuration draft saved.',
        });
      } else {
        toast({
          variant: 'danger',
          title: 'Save Failed',
          description: res.error || 'Failed to save draft.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected error occurred while saving draft.',
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Next Step Action
  const handleNextStep = () => {
    if (currentStep < 6) {
      const currentVal = validateInterviewStep(currentStep, formValues);
      if (!currentVal.isValid && currentVal.error) {
        toast({
          variant: 'danger',
          title: `Step ${currentStep} Required`,
          description: currentVal.error,
        });
        return;
      }
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveInterviewDraftAction(nextStep, form.getValues());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Previous Step Action
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Jump directly to step
  const handleJumpToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= 6) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Apply Preset
  const handleApplyPreset = (preset: InterviewPresetItem) => {
    form.reset(preset.config);
    toast({
      title: 'Preset Applied',
      description: `Loaded preset "${preset.name}".`,
    });
  };

  // Apply Resume Recommendation
  const handleApplyRecommendation = (rec: ResumeRecommendationItem) => {
    form.setValue('roleTitle', rec.suggestedRoleTitle, { shouldValidate: true });
    form.setValue('seniorityLevel', rec.suggestedSeniority, { shouldValidate: true });
    form.setValue('track', rec.suggestedTrack, { shouldValidate: true });
    form.setValue('difficulty', rec.suggestedDifficulty, { shouldValidate: true });
    form.setValue('focusAreas', rec.suggestedFocusAreas, { shouldValidate: true });

    toast({
      title: 'AI Recommendation Applied',
      description: `Applied recommended configuration for ${rec.suggestedRoleTitle}.`,
    });
  };

  // Final Start Session Handler
  const handleStartSession = async () => {
    setIsSubmitting(true);
    try {
      const finalData = form.getValues();
      const res = await createInterviewSessionAction(finalData);

      if (res.success && res.sessionId) {
        toast({
          title: 'Session Created!',
          description: res.message || 'Interview configuration complete.',
        });
        if (res.redirectTo) {
          router.push(res.redirectTo);
        }
      } else {
        toast({
          variant: 'danger',
          title: 'Session Creation Failed',
          description: res.error || 'Please check form entries and try again.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'Failed to create interview session due to an unexpected error.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center space-x-2 text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            <span>Interview Configuration Wizard</span>
            <Sparkles className="h-5 w-5 text-blue-400" />
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Tailor your role, target company, interview track, difficulty, and duration.
          </p>
        </div>

        {/* Top Action Bar: Preset & Quick Controls */}
        <div className="flex items-center space-x-2">
          <PresetSelector
            presets={presets}
            activeConfig={formValues}
            onApplyPreset={handleApplyPreset}
            onPresetSaved={(newPreset) => setPresets((prev) => [newPreset, ...prev])}
            onPresetDeleted={(id) => setPresets((prev) => prev.filter((p) => p.id !== id))}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
            className="space-x-1.5 text-xs"
          >
            {isSavingDraft ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 text-blue-400" />
            )}
            <span>{isSavingDraft ? 'Saving...' : 'Save Draft'}</span>
          </Button>

          {currentStep > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handlePrevStep}
              className="space-x-1 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
          )}

          {currentStep < 6 ? (
            <Button
              type="button"
              size="sm"
              onClick={handleNextStep}
              className="space-x-1 bg-blue-600 text-xs font-medium text-white hover:bg-blue-500"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleStartSession}
              disabled={isSubmitting}
              className="space-x-1 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-500"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isSubmitting ? 'Creating...' : 'Start Session'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Resume Recommendation Banner */}
      <ResumeRecommendationCard
        recommendation={initialState.recommendation}
        onApplyRecommendation={handleApplyRecommendation}
      />

      {/* Main Grid: Left Stepper & Right Form Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Progress Stepper */}
        <div className="space-y-4 lg:col-span-4">
          <ProgressStepper
            currentStep={currentStep}
            stepStatuses={stepStatuses}
            onStepClick={handleJumpToStep}
            completionPercentage={completionPercentage}
          />
        </div>

        {/* Right Column: Step Form Content */}
        <div className="space-y-6 lg:col-span-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {currentStep === 1 && <Step1Role form={form} />}
            {currentStep === 2 && <Step2Company form={form} />}
            {currentStep === 3 && <Step3Type form={form} />}
            {currentStep === 4 && <Step4Difficulty form={form} />}
            {currentStep === 5 && <Step5Duration form={form} />}
            {currentStep === 6 && (
              <Step6Review
                form={form}
                stepStatuses={stepStatuses}
                onJumpToStep={handleJumpToStep}
                onStartSession={handleStartSession}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Bottom Stepper Navigation Controls */}
            <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="space-x-1 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </Button>

              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Bookmark className="mr-1 h-3.5 w-3.5" />
                  Save Draft
                </Button>

                {currentStep < 6 ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleNextStep}
                    className="space-x-1 bg-blue-600 text-xs text-white hover:bg-blue-500"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleStartSession}
                    disabled={isSubmitting}
                    className="space-x-1 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Confirm & Start Session</span>
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
