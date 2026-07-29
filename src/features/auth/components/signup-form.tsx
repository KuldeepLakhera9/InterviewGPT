'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { signupAction, initiateOAuthAction } from '@/features/auth/actions/auth-actions';
import { signupSchema, type SignupInput } from '@/features/auth/schemas/auth-schemas';

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [oauthPending, setOauthPending] = React.useState<'google' | 'github' | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'member',
      acceptTerms: false,
    },
  });

  const role = watch('role');
  const acceptTerms = watch('acceptTerms');

  const onSubmit = (data: SignupInput) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('fullName', data.fullName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      formData.append('role', data.role);
      formData.append('acceptTerms', String(data.acceptTerms));

      const result = await signupAction(null, formData);

      if (result.success) {
        toast({
          title: 'Account Created',
          description: result.message || 'Account created successfully.',
          variant: 'success',
        });
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        toast({
          title: 'Sign Up Failed',
          description: result.error || 'Could not create account.',
          variant: 'danger',
        });
      }
    });
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    setOauthPending(provider);
    startTransition(async () => {
      await initiateOAuthAction(provider);
    });
  };

  return (
    <Card className="w-full max-w-md border-[var(--border-strong)] bg-[var(--bg-surface-1)] shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
        <CardDescription className="text-sm text-[var(--text-secondary)]">
          Join InterviewGPT to start practicing technical & HR interviews
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => handleOAuth('google')}
            className="w-full"
          >
            {oauthPending === 'google' ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            Google
          </Button>

          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => handleOAuth('github')}
            className="w-full"
          >
            {oauthPending === 'github' ? (
              <Spinner size="sm" className="mr-2" />
            ) : (
              <svg className="mr-2 h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            GitHub
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]" htmlFor="fullName">
              Full Name
            </label>
            <Input
              id="fullName"
              placeholder="Alex Chen"
              aria-invalid={!!errors.fullName}
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-xs text-[var(--status-danger)]">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1">
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

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label
                className="text-xs font-medium text-[var(--text-secondary)]"
                htmlFor="password"
              >
                Password
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

            <div className="space-y-1">
              <label
                className="text-xs font-medium text-[var(--text-secondary)]"
                htmlFor="confirmPassword"
              >
                Confirm
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
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Workspace Role
            </label>
            <Select
              value={role}
              onValueChange={(val) => setValue('role', val as 'owner' | 'member' | 'viewer')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member (Candidate Practice)</SelectItem>
                <SelectItem value="owner">Owner (Team Admin)</SelectItem>
                <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start space-x-2 pt-1">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setValue('acceptTerms', !!checked)}
              className="mt-0.5"
            />
            <label
              htmlFor="acceptTerms"
              className="cursor-pointer text-xs text-[var(--text-secondary)] select-none"
            >
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-xs text-[var(--status-danger)]">{errors.acceptTerms.message}</p>
          )}

          <Button type="submit" className="mt-2 w-full" disabled={isPending}>
            {isPending ? <Spinner size="sm" className="mr-2" /> : null}
            Create Account
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center border-t border-[var(--border-subtle)] pt-4">
        <p className="text-xs text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-[var(--accent-primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
