'use client';

import * as React from 'react';
import { Bookmark, Check, Plus, Trash2, Zap, Sparkles } from 'lucide-react';
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
import { useToast } from '@/components/ui/use-toast';
import type { InterviewConfigData, InterviewPresetItem } from '../types/interview-wizard.types';
import {
  deleteInterviewPresetAction,
  saveInterviewPresetAction,
} from '../actions/interview-wizard.actions';

interface PresetSelectorProps {
  presets: InterviewPresetItem[];
  activeConfig: InterviewConfigData;
  onApplyPreset: (preset: InterviewPresetItem) => void;
  onPresetSaved?: (newPreset: InterviewPresetItem) => void;
  onPresetDeleted?: (deletedId: string) => void;
}

export function PresetSelector({
  presets,
  activeConfig,
  onApplyPreset,
  onPresetSaved,
  onPresetDeleted,
}: PresetSelectorProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = React.useState(false);
  const [presetName, setPresetName] = React.useState('');
  const [presetDesc, setPresetDesc] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeletingId, setIsDeletingId] = React.useState<string | null>(null);

  const handleSavePreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!presetName.trim()) {
      toast({
        variant: 'danger',
        title: 'Validation Error',
        description: 'Please enter a name for your preset.',
      });
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveInterviewPresetAction(presetName, presetDesc, activeConfig);
      if (res.success && res.preset) {
        toast({
          title: 'Preset Saved',
          description: res.message || `Preset "${res.preset.name}" saved successfully.`,
        });
        if (onPresetSaved) {
          onPresetSaved(res.preset);
        }
        setIsSaveModalOpen(false);
        setPresetName('');
        setPresetDesc('');
      } else {
        toast({
          variant: 'danger',
          title: 'Save Failed',
          description: res.error || 'Failed to save preset.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected error occurred while saving preset.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePreset = async (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeletingId(presetId);
    try {
      const res = await deleteInterviewPresetAction(presetId);
      if (res.success) {
        toast({
          title: 'Preset Deleted',
          description: res.message || 'Preset deleted successfully.',
        });
        if (onPresetDeleted) {
          onPresetDeleted(presetId);
        }
      } else {
        toast({
          variant: 'danger',
          title: 'Delete Failed',
          description: res.error || 'Failed to delete preset.',
        });
      }
    } catch {
      toast({
        variant: 'danger',
        title: 'Error',
        description: 'An unexpected error occurred while deleting preset.',
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Preset Gallery Launcher Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="space-x-1.5 border-blue-500/30 text-xs hover:border-blue-500 hover:bg-blue-500/10"
          >
            <Bookmark className="h-3.5 w-3.5 text-blue-400" />
            <span>Saved Presets</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg font-bold">
              <Zap className="h-5 w-5 text-amber-400" />
              <span>Interview Presets Gallery</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)]">
              Choose from curated system templates or load your custom saved configurations.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              {presets.map((preset) => {
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onApplyPreset(preset);
                      setIsOpen(false);
                      toast({
                        title: 'Preset Applied',
                        description: `Loaded "${preset.name}" into wizard.`,
                      });
                    }}
                    className="group relative cursor-pointer rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4 text-left transition-all hover:border-blue-500/60 hover:bg-blue-500/5 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-400">
                        {preset.name}
                      </h4>
                      {preset.isSystem ? (
                        <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400">
                          Built-in
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleDeletePreset(preset.id, e)}
                          disabled={isDeletingId === preset.id}
                          className="rounded p-1 text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-400"
                          title="Delete Custom Preset"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {preset.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">
                        {preset.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="rounded bg-[var(--bg-surface-hover)] px-2 py-0.5 font-medium text-[var(--text-primary)]">
                        {preset.config.roleTitle}
                      </span>
                      <span className="rounded bg-blue-500/10 px-2 py-0.5 font-medium text-blue-300">
                        {preset.config.track}
                      </span>
                      <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-300">
                        {preset.config.difficulty}
                      </span>
                      <span className="rounded bg-purple-500/10 px-2 py-0.5 font-medium text-purple-300">
                        {preset.config.durationMinutes}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter className="border-t border-[var(--border-subtle)] pt-3 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSaveModalOpen(true)}
              className="space-x-1.5 border-blue-500/30 text-xs text-blue-400 hover:bg-blue-500/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Save Current Config as Preset</span>
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Preset Sub-Modal */}
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="max-w-md border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
          <form onSubmit={handleSavePreset}>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-base font-bold">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Save New Preset</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--text-secondary)]">
                Save your current configuration settings as a reusable preset for fast future
                access.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="preset-name" className="text-xs font-semibold">
                  Preset Name *
                </Label>
                <Input
                  id="preset-name"
                  placeholder="e.g. Senior Frontend FAANG 45m"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="preset-desc" className="text-xs font-semibold">
                  Description (Optional)
                </Label>
                <Input
                  id="preset-desc"
                  placeholder="Brief note about target role and focus areas"
                  value={presetDesc}
                  onChange={(e) => setPresetDesc(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsSaveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="bg-blue-600 text-xs font-medium text-white hover:bg-blue-500"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check className="mr-1 h-3.5 w-3.5" />
                    <span>Save Preset</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
