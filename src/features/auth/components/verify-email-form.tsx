'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { verifyEmailAction } from '@/features/auth/actions/auth-actions';
import { verifyEmailSchema, type VerifyEmailInput } from '@/features/auth/schemas/auth-schemas';

export function VerifyEmailForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: '' },
  });

  const onSubmit = (data: VerifyEmailInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('code', data.code);

      const result = await verifyEmailAction(null, formData);

      if (result.success) {
        toast({
          title: 'Email Verified',
          description: result.message || 'Verification successful.',
          variant: 'success',
        });
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        toast({
          title: 'Verification Failed',
          description: result.error || 'Invalid code.',
          variant: 'danger',
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-md border-[var(--border-strong)] bg-[var(--bg-surface-1)] shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Verify your email</CardTitle>
        <CardDescription className="text-sm text-[var(--text-secondary)]">
          Enter the 6-digit verification code sent to your email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5 text-center">
            <label className="text-xs font-medium text-[var(--text-secondary)]" htmlFor="code">
              Verification Code
            </label>
            <Input
              id="code"
              maxLength={6}
              placeholder="123456"
              className="text-center font-mono text-lg tracking-widest"
              aria-invalid={!!errors.code}
              {...register('code')}
            />
            {errors.code && (
              <p className="text-xs text-[var(--status-danger)]">{errors.code.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner size="sm" className="mr-2" /> : null}
            Verify Email
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
