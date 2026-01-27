// 📁 src/lib/email/notifyViaEmail.ts
import { sendEmailNotification } from "@/lib/email/email-resend-hook";
import type { SendEmailProps } from "@/lib/email/types";

type LogLevel = "silent" | "warn" | "error";

/**
 * 📬 이메일 전송 서비스
 * - sendEmailNotification() → 템플릿 및 기술 중심
 * - notifyViaEmail() → 도메인 관점의 전송 인터페이스
 *
 * @param args - 이메일 전송 파라미터
 * @param options - 로깅 옵션 (silent, warn, error)
 */
// default는 'error'
export async function notifyViaEmail(args: SendEmailProps, options?: { logLevel?: LogLevel }) {
  try {
    await sendEmailNotification(args);
  } catch (error) {
    const level = options?.logLevel ?? "error";
    if (level === "silent") return;

    const logFn = level === "warn" ? console.warn : console.error;
    logFn("📧 이메일 전송 실패:", error);
  }
}
