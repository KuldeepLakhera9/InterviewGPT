'use client';

import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Award, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CandidateProfileData, CertificationEntry } from '../../types/candidate-profile.types';

interface Step7Props {
  form: UseFormReturn<CandidateProfileData, unknown, CandidateProfileData>;
}

export function Step7Certifications({ form }: Step7Props) {
  const { watch, setValue } = form;
  const certificationList: CertificationEntry[] =
    watch('certificationsInfo.certificationList') || [];

  const addCertification = () => {
    const newEntry: CertificationEntry = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      credentialUrl: '',
    };
    setValue('certificationsInfo.certificationList', [...certificationList, newEntry], {
      shouldValidate: true,
    });
  };

  const removeCertification = (id: string) => {
    const updated = certificationList.filter((c) => c.id !== id);
    setValue('certificationsInfo.certificationList', updated, { shouldValidate: true });
  };

  const updateCertField = (id: string, field: keyof CertificationEntry, value: string) => {
    const updated = certificationList.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [field]: value };
      }
      return entry;
    });
    setValue('certificationsInfo.certificationList', updated, { shouldValidate: true });
  };

  return (
    <Card className="border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold text-[var(--text-primary)]">
            7. Certifications & Credentials
          </CardTitle>
          <CardDescription className="text-xs text-[var(--text-secondary)]">
            Add official professional certifications, licenses, or exam accreditations.
          </CardDescription>
        </div>
        <Button type="button" size="sm" onClick={addCertification} className="space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add Certificate</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {certificationList.length === 0 ? (
          <div className="space-y-3 rounded-lg border border-dashed border-[var(--border-subtle)] p-8 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                No Certifications Added
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Add AWS Solutions Architect, CKAD, PMP, or other industry certifications.
              </p>
            </div>
            <Button type="button" size="sm" variant="outline" onClick={addCertification}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Certificate
            </Button>
          </div>
        ) : (
          certificationList.map((item, index) => (
            <div
              key={item.id}
              className="relative space-y-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  Certificate #{index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(item.id)}
                  className="h-7 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                >
                  <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Certification Name
                  </label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateCertField(item.id, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Issuing Organization
                  </label>
                  <Input
                    value={item.issuingOrganization}
                    onChange={(e) =>
                      updateCertField(item.id, 'issuingOrganization', e.target.value)
                    }
                    placeholder="e.g. Amazon Web Services / CNCF"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Issue Date
                  </label>
                  <Input
                    value={item.issueDate}
                    onChange={(e) => updateCertField(item.id, 'issueDate', e.target.value)}
                    placeholder="e.g. May 2023"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Expiration Date
                  </label>
                  <Input
                    value={item.expirationDate || ''}
                    onChange={(e) => updateCertField(item.id, 'expirationDate', e.target.value)}
                    placeholder="e.g. May 2026 / Does not expire"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Credential ID
                  </label>
                  <Input
                    value={item.credentialId || ''}
                    onChange={(e) => updateCertField(item.id, 'credentialId', e.target.value)}
                    placeholder="e.g. AWS-12345678"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--text-secondary)]">
                    Credential Verification URL
                  </label>
                  <Input
                    value={item.credentialUrl || ''}
                    onChange={(e) => updateCertField(item.id, 'credentialUrl', e.target.value)}
                    placeholder="https://credly.com/badges/..."
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
