'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from '@/features/auth/schemas/auth-schemas';
import type { AuthActionResult } from '@/features/auth/types/auth-types';

const AUTH_COOKIE_NAME = 'interview_gpt_session';

export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
    rememberMe: formData.get('rememberMe') === 'on' || formData.get('rememberMe') === 'true',
  };

  const parsed = loginSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid form submission.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Simulate authentication logic
  const cookieStore = await cookies();
  const maxAge = parsed.data.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days vs 1 day

  cookieStore.set(AUTH_COOKIE_NAME, `session_${Date.now()}_${parsed.data.email}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  return {
    success: true,
    message: 'Login successful. Redirecting to dashboard...',
    redirectTo: '/dashboard',
  };
}

export async function signupAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    role: formData.get('role') || 'member',
    acceptTerms: formData.get('acceptTerms') === 'on' || formData.get('acceptTerms') === 'true',
  };

  const parsed = signupSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, `session_${Date.now()}_${parsed.data.email}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  return {
    success: true,
    message: 'Account created successfully! Verification email sent.',
    redirectTo: '/verify-email',
  };
}

export async function forgotPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = { email: formData.get('email') };
  const parsed = forgotPasswordSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Please provide a valid email address.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    message: 'If an account exists with that email, a password reset link has been sent.',
  };
}

export async function resetPasswordAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    token: formData.get('token'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = resetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Failed to reset password.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    message: 'Password reset successfully. You can now login with your new password.',
    redirectTo: '/login',
  };
}

export async function verifyEmailAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = { code: formData.get('code') };
  const parsed = verifyEmailSchema.safeParse(rawData);

  if (!parsed.success) {
    return {
      success: false,
      error: 'Invalid 6-digit verification code.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    message: 'Email verified successfully!',
    redirectTo: '/dashboard',
  };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect('/login');
}

export async function initiateOAuthAction(provider: 'google' | 'github'): Promise<void> {
  // OAuth initiation redirect handler
  redirect(`/api/v1/auth/oauth/${provider}`);
}
