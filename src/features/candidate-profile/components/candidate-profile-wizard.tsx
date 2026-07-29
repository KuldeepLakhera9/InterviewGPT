'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Bookmark, Check, Loader2, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

import type {
  CandidateProfileData,
  CandidateProfileState,
  StepStatus,
} from '../types/candidate-profile.types';
import { candidateProfileSchema } from '../schemas/candidate-profile.schema';
import {
  calculateProfileCompletion,
  validateStepData,
} from '../services/candidate-profile.service';
import {
  saveCandidateProfileDraftAction,
  submitCandidateProfileAction,
} from '../actions/candidate-profile.actions';

import { ProgressStepper, STEP_CONFIGS } from './progress-stepper';
import { ProfileCompletionBar } from './profile-completion-bar';
import { Step1PersonalInfo } from './steps/step-1-personal-info';
import { Step2ProfessionalInfo } from './steps/step-2-professional-info';
import { Step3Skills } from './steps/step-3-skills';
import { Step4Education } from './steps/step-4-education';
import { Step5Experience } from './steps/step-5-experience';
import { Step6Projects } from './steps/step-6-projects';
import { Step7Certifications } from './steps/step-7-certifications';
import { Step8CareerGoals } from './steps/step-8-career-goals';
import { Step9ReviewSubmit } from './steps/step-9-review-submit';

interface CandidateProfileWizardProps {
  initialState: CandidateProfileState;
}

export function CandidateProfileWizard({ initialState }: CandidateProfileWizardProps) {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = React.useState<number>(initialState.currentStep || 1);
  const [isSavingDraft, setIsSavingDraft] = React.useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const form = useForm<CandidateProfileData>({
    resolver: zodResolver(candidateProfileSchema),
    defaultValues: initialState.data,
    mode: 'onTouched',
  });

  const formValues = form.watch();

  // Dynamically compute completion %
  const completionPercentage = React.useMemo(() => {
    return calculateProfileCompletion(formValues);
  }, [formValues]);

  // Compute validation status for each step
  const stepStatuses: StepStatus[] = React.useMemo(() => {
    return STEP_CONFIGS.map((config) => {
      const stepNum = config.stepNumber;
      if (stepNum === 9) {
        return {
          stepNumber: 9,
          title: config.title,
          subtitle: config.subtitle,
          isCompleted: initialState.isSubmitted || completionPercentage >= 90,
          isValid: true,
        };
      }
      const valResult = validateStepData(stepNum, formValues);
      return {
        stepNumber: stepNum,
        title: config.title,
        subtitle: config.subtitle,
        isCompleted: valResult.isValid,
        isValid: valResult.isValid,
      };
    });
  }, [formValues, completionPercentage, initialState.isSubmitted]);

  // Save Draft Action
  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      const currentData = form.getValues();
      const res = await saveCandidateProfileDraftAction(currentStep, currentData);

      if (res.success) {
        toast({
          title: 'Draft Saved',
          description: res.message || 'Your candidate profile draft has been saved.',
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
    if (currentStep < 9) {
      // Validate current step before advancing
      const currentVal = validateStepData(currentStep, formValues);
      if (!currentVal.isValid && currentVal.error) {
        toast({
          variant: 'danger',
          title: `Step ${currentStep} Error`,
          description: currentVal.error,
        });
      }
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Auto save draft on step change
      saveCandidateProfileDraftAction(nextStep, form.getValues());
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

  // Jump directly to step (from Stepper or Review page)
  const handleJumpToStep = (stepNumber: number) => {
    if (stepNumber >= 1 && stepNumber <= 9) {
      setCurrentStep(stepNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Submit Handler
  const handleSubmitProfile = async () => {
    setIsSubmitting(true);
    try {
      const finalData = form.getValues();
      const res = await submitCandidateProfileAction(finalData);

      if (res.success) {
        toast({
          title: 'Profile Submitted!',
          description: res.message || 'Your Candidate Profile is now ready for mock interviews.',
        });
        if (res.redirectTo) {
          router.push(res.redirectTo);
        }
      } else {
        toast({
          variant: 'danger',
          title: 'Submission Failed',
          description: res.error || 'Please review your step entries and try again.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Submission Error',
        description: 'Failed to submit profile due to an unexpected error.',
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
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Candidate Profile Wizard
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Complete your multi-step profile to power AI mock interview simulations.
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center space-x-2">
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

          {currentStep < 9 ? (
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
              onClick={handleSubmitProfile}
              disabled={isSubmitting}
              className="space-x-1 bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-500"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Profile'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Stepper & Right Form Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Progress Stepper */}
        <div className="space-y-4 lg:col-span-4">
          <ProfileCompletionBar percentage={completionPercentage} />
          <ProgressStepper
            currentStep={currentStep}
            stepStatuses={stepStatuses}
            onStepClick={handleJumpToStep}
          />
        </div>

        {/* Right Column: Step Form Content */}
        <div className="space-y-6 lg:col-span-8">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {currentStep === 1 && <Step1PersonalInfo form={form} />}
            {currentStep === 2 && <Step2ProfessionalInfo form={form} />}
            {currentStep === 3 && <Step3Skills form={form} />}
            {currentStep === 4 && <Step4Education form={form} />}
            {currentStep === 5 && <Step5Experience form={form} />}
            {currentStep === 6 && <Step6Projects form={form} />}
            {currentStep === 7 && <Step7Certifications form={form} />}
            {currentStep === 8 && <Step8CareerGoals form={form} />}
            {currentStep === 9 && (
              <Step9ReviewSubmit
                form={form}
                completionPercentage={completionPercentage}
                stepStatuses={stepStatuses}
                onJumpToStep={handleJumpToStep}
                onSubmitProfile={handleSubmitProfile}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Bottom Stepper Nav Controls */}
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

                {currentStep < 9 ? (
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
                    onClick={handleSubmitProfile}
                    disabled={isSubmitting}
                    className="space-x-1 bg-emerald-600 text-xs text-white hover:bg-emerald-500"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Complete & Submit Profile</span>
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
