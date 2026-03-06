import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "[fit.CV] 이메일 인증을 완료해주세요",
    html: `
      <div style="max-width: 480px; margin: 0 auto; font-family: -apple-system, sans-serif;">
        <h2 style="color: #18181b;">이메일 인증</h2>
        <p style="color: #3f3f46;">안녕하세요! fit.CV에 가입해주셔서 감사합니다.</p>
        <p style="color: #3f3f46;">아래 버튼을 클릭하여 이메일 인증을 완료해주세요.</p>
        <a href="${confirmLink}"
           style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          이메일 인증하기
        </a>
        <p style="color: #71717a; font-size: 14px;">
          이 링크는 1시간 후 만료됩니다. 버튼이 작동하지 않으면 아래 링크를 브라우저에 복사해주세요:
        </p>
        <p style="color: #71717a; font-size: 12px; word-break: break-all;">${confirmLink}</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${APP_URL}/new-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "[fit.CV] 비밀번호 재설정",
    html: `
      <div style="max-width: 480px; margin: 0 auto; font-family: -apple-system, sans-serif;">
        <h2 style="color: #18181b;">비밀번호 재설정</h2>
        <p style="color: #3f3f46;">비밀번호 재설정을 요청하셨습니다.</p>
        <p style="color: #3f3f46;">아래 버튼을 클릭하여 새 비밀번호를 설정해주세요.</p>
        <a href="${resetLink}"
           style="display: inline-block; padding: 12px 24px; background-color: #18181b; color: #fff; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          비밀번호 재설정
        </a>
        <p style="color: #71717a; font-size: 14px;">
          이 링크는 1시간 후 만료됩니다. 본인이 요청하지 않으셨다면 이 이메일을 무시해주세요.
        </p>
        <p style="color: #71717a; font-size: 12px; word-break: break-all;">${resetLink}</p>
      </div>
    `,
  });
}
