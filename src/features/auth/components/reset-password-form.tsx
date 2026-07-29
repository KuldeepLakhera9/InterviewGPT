'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { resetPasswordAction } from '@/features/auth/actions/auth-actions';
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas/auth-schemas';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || 'demo-reset-token';
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('token', data.token);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);

      const result = await resetPasswordAction(null, formData);

      if (result.success) {
        toast({
          title: 'Password Reset',
          description: result.message || 'Password reset successfully.',
          variant: 'success',
        });
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to reset password.',
          variant: 'danger',
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-md border-[var(--border-strong)] bg-[var(--bg-surface-1)] shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Set new password</CardTitle>
        <CardDescription className="text-sm text-[var(--text-secondary)]">
          Please enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]" htmlFor="password">
              New Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-[var(--status-danger)]">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-medium text-[var(--text-secondary)]"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              aria-invalid={!!errors.confirmPassword}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-[var(--status-danger)]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner size="sm" className="mr-2" /> : null}
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
