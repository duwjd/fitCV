"use server";

import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signupSchema, resetPasswordSchema, newPasswordSchema } from "@/lib/validations/auth";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";

export async function registerUser(values: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const validated = signupSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { name, email, password } = validated.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, error: "이미 사용 중인 이메일입니다" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  await sendVerificationEmail(email, token);

  return { success: true };
}

export async function verifyEmail(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    return { success: false, error: "유효하지 않은 인증 링크입니다" };
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { token },
    });
    return { success: false, error: "인증 링크가 만료되었습니다. 다시 시도해주세요" };
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return { success: true };
}

export async function requestPasswordReset(values: { email: string }) {
  const validated = resetPasswordSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const { email } = validated.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true };
  }

  // Delete existing tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email },
  });

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  await sendPasswordResetEmail(email, token);

  return { success: true };
}

export async function resetPassword(values: {
  token: string;
  password: string;
  confirmPassword: string;
}) {
  const validated = newPasswordSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0].message };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: values.token },
  });

  if (!resetToken) {
    return { success: false, error: "유효하지 않은 링크입니다" };
  }

  if (resetToken.expires < new Date()) {
    await prisma.passwordResetToken.delete({
      where: { token: values.token },
    });
    return { success: false, error: "링크가 만료되었습니다. 다시 시도해주세요" };
  }

  const hashedPassword = await bcrypt.hash(validated.data.password, 12);

  await prisma.user.update({
    where: { email: resetToken.email },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({
    where: { token: values.token },
  });

  return { success: true };
}
