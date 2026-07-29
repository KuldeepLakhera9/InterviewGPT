'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { forgotPasswordAction } from '@/features/auth/actions/auth-actions';
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/features/auth/schemas/auth-schemas';

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('email', data.email);

      const result = await forgotPasswordAction(null, formData);

      if (result.success) {
        toast({
          title: 'Reset Link Sent',
          description: result.message || 'Check your inbox for password reset instructions.',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to request password reset.',
          variant: 'danger',
        });
      }
    });
  };

  return (
    <Card className="w-full max-w-md border-[var(--border-strong)] bg-[var(--bg-surface-1)] shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Forgot password?</CardTitle>
        <CardDescription className="text-sm text-[var(--text-secondary)]">
          Enter your email address and we&apos;ll send you a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="alex.chen@example.com"
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-[var(--status-danger)]">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Spinner size="sm" className="mr-2" /> : null}
            Send Reset Link
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-[var(--border-subtle)] pt-4">
        <p className="text-xs text-[var(--text-secondary)]">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent-primary)] hover:underline"
          >
            Back to sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
