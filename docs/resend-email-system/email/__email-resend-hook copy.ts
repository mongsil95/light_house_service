// lib/email/email-resend-hook.ts
import { Resend } from "resend";
import { AdoptApplyConfirmationEmail } from "./templates/AdoptApplyConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailProps {
  formId: string;
  data: any;
}

export async function sendEmailNotification({ formId, data }: SendEmailProps) {
  switch (formId) {
    case "apply-adopt-group": {
      await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [data.managerEmail, "itaseoul@itaseoul.org"],
        subject: "입양 신청이 완료되었습니다",
        react: AdoptApplyConfirmationEmail(data),
      });
      break;
    }
    // ...다른 폼 처리 분기

    default:
      console.warn(`알 수 없는 formId: ${formId}`);
  }
}
