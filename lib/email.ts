import { createClient } from "@/lib/supabase";
import { render } from "@react-email/render";
import * as fs from "fs";
import * as path from "path";
import { Resend } from "resend";
import { AdoptionGuide2026Email } from "./email-templates/AdoptionGuide2026Email";

const resend = new Resend(process.env.RESEND_API_KEY);

// API 키 확인 로깅
console.log("🔑 Resend API Key 설정 여부:", !!process.env.RESEND_API_KEY);

/**
 * 등대지기 관리자 이메일 목록 가져오기
 */
async function getAdminEmails(): Promise<string[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("admin").select("email").not("email", "is", null);

    if (error) {
      console.error("관리자 이메일 조회 오류:", error);
      // 오류 시 기본 이메일 반환
      return ["happything@itaseoul.org"];
    }

    const emails = data?.map((admin) => admin.email).filter(Boolean) || [];

    // 이메일이 없으면 기본 이메일 반환
    if (emails.length === 0) {
      console.warn("등록된 관리자 이메일이 없습니다. 기본 이메일을 사용합니다.");
      return ["happything@itaseoul.org"];
    }

    console.log(`📧 등대지기 관리자 ${emails.length}명에게 이메일 발송 예정:`, emails);
    return emails;
  } catch (error) {
    console.error("관리자 이메일 조회 중 오류:", error);
    return ["happything@itaseoul.org"];
  }
}

/**
 * 관리자에게 새 질문 알림 이메일 전송
 */
export async function sendNewQuestionNotification(questionData: {
  id: number;
  title: string;
  author_name: string;
  author_email: string | null;
  category: string;
}) {
  try {
    const adminEmails = await getAdminEmails();

    const { data, error } = await resend.emails.send({
      from: "등대지기 반려해변 <lighthouse@caresea.kr>",
      to: adminEmails,
      subject: `[새 질문] ${questionData.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">새로운 질문이 등록되었습니다</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>제목:</strong> ${questionData.title}</p>
            <p style="margin: 8px 0;"><strong>카테고리:</strong> ${questionData.category}</p>
            <p style="margin: 8px 0;"><strong>작성자:</strong> ${questionData.author_name}</p>
            ${questionData.author_email ? `<p style="margin: 8px 0;"><strong>이메일:</strong> ${questionData.author_email}</p>` : ""}
          </div>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/forkwonsun/qna/${questionData.id}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              질문 확인하기
            </a>
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("이메일 전송 실패:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("이메일 전송 중 오류:", error);
    return { success: false, error };
  }
}

/**
 * 질문자에게 답변 등록 알림 이메일 전송
 */
export async function sendAnswerNotification(answerData: {
  questionId: number;
  questionTitle: string;
  authorName: string;
  authorEmail: string;
  answererName: string;
  answerContent: string;
}) {
  if (!answerData.authorEmail) {
    console.log("질문자 이메일이 없어 알림을 전송하지 않습니다.");
    return { success: false, error: "No email provided" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "등대지기 반려해변 <lighthouse@caresea.kr>",
      to: [answerData.authorEmail],
      subject: `[답변 등록] ${answerData.questionTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">질문에 대한 답변이 등록되었습니다</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>질문 제목:</strong> ${answerData.questionTitle}</p>
            <p style="margin: 8px 0;"><strong>답변자:</strong> ${answerData.answererName}</p>
          </div>
          
          <div style="background-color: #fff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">답변 내용:</p>
            <div style="color: #1f2937;">${answerData.answerContent.replace(/\n/g, "<br>")}</div>
          </div>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/lighthouse?id=${answerData.questionId}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              전체 답변 보기
            </a>
          </p>
          
      `,
    });

    if (error) {
      console.error("이메일 전송 실패:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("이메일 전송 중 오류:", error);
    return { success: false, error };
  }
}

/**
 * 관리자에게 가이드 다운로드 신청 알림 이메일 전송
 */
export async function sendBannerInquiryNotification(inquiryData: {
  id: number;
  organization: string;
  email: string;
}) {
  try {
    const adminEmails = await getAdminEmails();

    const { data, error } = await resend.emails.send({
      from: "등대지기 반려해변 <lighthouse@caresea.kr>",
      to: adminEmails,
      subject: `[가이드 다운로드 신청] ${inquiryData.organization}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">새로운 가이드 다운로드 신청이 접수되었습니다</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>기관명:</strong> ${inquiryData.organization}</p>
            <p style="margin: 8px 0;"><strong>이메일:</strong> ${inquiryData.email}</p>
            <p style="margin: 8px 0;"><strong>가이드 다운로드 번호:</strong> #${inquiryData.id}</p>
          </div>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/lighthouse/for-kwonsun/banner-inquiries" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              가이드 다운로드 내역 확인하기
            </a>
          </p>
          
        </div>
      `,
    });

    if (error) {
      console.error("배너 문의 이메일 전송 실패:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("배너 문의 이메일 전송 중 오류:", error);
    return { success: false, error };
  }
}

/**
 * 문의자에게 가이드 다운로드 신청 접수 확인 이메일 전송
 */
export async function sendBannerInquiryConfirmation(inquiryData: {
  organization: string;
  email: string;
}) {
  try {
    console.log("📎 PDF 첨부 이메일 전송 시도:", inquiryData.email);

    // PDF 파일 읽기 (에러 처리 강화)
    const filePath = path.join(process.cwd(), "public", "file", "2026 반려해변 사전안내서.pdf");
    console.log("📁 파일 경로:", filePath);
    console.log("📂 현재 작업 디렉토리:", process.cwd());

    if (!fs.existsSync(filePath)) {
      console.error("❌ 파일이 존재하지 않습니다:", filePath);
      // 파일이 없어도 이메일은 전송 시도
      const emailHtml = await render(
        AdoptionGuide2026Email({
          data: {
            organization: inquiryData.organization,
            email: inquiryData.email,
          },
        })
      );

      const { data, error } = await resend.emails.send({
        from: "등대지기 반려해변 <lighthouse@caresea.kr>",
        to: [inquiryData.email],
        subject: `[등대지기 반려해변] 2026년 반려해변 사전안내`,
        html: emailHtml,
      });

      if (error) {
        console.error("❌ 이메일 전송 실패 (첨부파일 없음):", error);
        return { success: false, error };
      }

      console.log("⚠️ PDF 첨부 없이 이메일 전송 완료:", data);
      return { success: true, data, warning: "PDF 파일을 찾을 수 없어 첨부하지 못했습니다." };
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileSizeMB = (fileBuffer.length / (1024 * 1024)).toFixed(2);
    console.log(`✅ 파일 읽기 성공, 크기: ${fileBuffer.length} bytes (${fileSizeMB} MB)`);

    // React Email 컴포넌트를 HTML로 렌더링
    const emailHtml = await render(
      AdoptionGuide2026Email({
        data: {
          organization: inquiryData.organization,
          email: inquiryData.email,
        },
      })
    );

    const { data, error } = await resend.emails.send({
      from: "등대지기 반려해변 <lighthouse@caresea.kr>",
      to: [inquiryData.email],
      subject: `[등대지기 반려해변] 2026년 반려해변 사전안내`,
      html: emailHtml,
      attachments: [
        {
          filename: "2026_반려해변_사전안내서.pdf",
          content: fileBuffer.toString("base64"),
        },
      ],
    });

    if (error) {
      console.error("❌ 문의자 확인 이메일 전송 실패:", error);
      return { success: false, error };
    }

    console.log("✅ 문의자 확인 이메일 전송 성공:", data);
    return { success: true, data };
  } catch (error) {
    console.error("❌ 문의자 확인 이메일 전송 중 오류:", error);
    return { success: false, error };
  }
}
