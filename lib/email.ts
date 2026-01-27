import { Resend } from "resend";
import * as fs from "fs";
import * as path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

// API 키 확인 로깅
console.log("🔑 Resend API Key 설정 여부:", !!process.env.RESEND_API_KEY);

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
    const { data, error } = await resend.emails.send({
      from: "등대지기 반려해변 <onboarding@resend.dev>",
      to: ["happything@itaseoul.org"],
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
      from: "등대지기 반려해변 <onboarding@resend.dev>",
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
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/lighthouse-QnA?id=${answerData.questionId}" 
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
    const { data, error } = await resend.emails.send({
      from: "등대지기 반려해변 <onboarding@resend.dev>",
      to: ["happything@itaseoul.org"],
      subject: `[가이드 다운로드 신청] ${inquiryData.organization}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">새로운 가이드 다운로드 신청이 접수되었습니다</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>기관명:</strong> ${inquiryData.organization}</p>
            <p style="margin: 8px 0;"><strong>이메일:</strong> ${inquiryData.email}</p>
            <p style="margin: 8px 0;"><strong>문의 번호:</strong> #${inquiryData.id}</p>
          </div>
          
          <p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/lighthouse-QnA/for-kwonsun/banner-inquiries" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              문의 내역 확인하기
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            담당자는 문의자에게 이메일(${inquiryData.email})로 연락해주세요.
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

    // PDF 파일 읽기
    const filePath = path.join(process.cwd(), "public", "file", "2026 반려해변 활동 가이드.pdf");
    console.log("📁 파일 경로:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("❌ 파일이 존재하지 않습니다:", filePath);
      throw new Error("PDF 파일을 찾을 수 없습니다");
    }

    const fileBuffer = fs.readFileSync(filePath);
    console.log("✅ 파일 읽기 성공, 크기:", fileBuffer.length, "bytes");

    const { data, error } = await resend.emails.send({
      from: "등대지기 반려해변 <onboarding@resend.dev>",
      // 테스트 환경에서는 관리자 이메일로 전송 (실제 환경에서는 inquiryData.email 사용)
      to: process.env.NODE_ENV === "production" ? [inquiryData.email] : ["happything@itaseoul.org"],
      subject: `[등대지기 반려해변] 가이드 다운로드 신청이 접수되었습니다`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">가이드 다운로드 신청 감사합니다</h2>
          
          <p style="color: #374151; line-height: 1.6;">
            안녕하세요, <strong>${inquiryData.organization}</strong> 담당자님<br/>
            등대지기 반려해변 가이드 자료에 관심을 가져주셔서 감사합니다.
          </p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>접수 정보:</strong></p>
            <p style="margin: 8px 0;">기관명: ${inquiryData.organization}</p>
            <p style="margin: 8px 0;">연락처: ${inquiryData.email}</p>
          </div>
          
          <p style="color: #374151; line-height: 1.6;">
            요청하신 <strong>2026 반려해변 활동 가이드</strong>를 첨부파일로 보내드립니다.<br/>
            첨부된 PDF 파일을 다운로드하여 활용해주세요.
          </p>
          
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
            <p style="color: #1e40af; margin: 0; font-size: 14px;">
              📚 첨부파일: 2026 반려해변 활동 가이드.pdf<br/>
              추가 문의사항이 있으시면 이 이메일에 회신해주세요.
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            이 메일은 등대지기 반려해변 서비스에서 자동으로 발송되었습니다.<br/>
            문의: happything@itaseoul.org
          </p>
        </div>
      `,
      attachments: [
        {
          filename: "2026_반려해변_활동_가이드.pdf",
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
