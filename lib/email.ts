import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      from: "등대지기 반려해변 <noreply@yourdomain.com>", // TODO: 실제 도메인으로 변경 필요
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
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/admin/qna/${questionData.id}" 
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
      from: "등대지기 반려해변 <noreply@yourdomain.com>", // TODO: 실제 도메인으로 변경 필요
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
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/adopt-a-beach/expertsqna/${answerData.questionId}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              전체 답변 보기
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 12px; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            이 메일은 등대지기 반려해변 서비스에서 자동으로 발송되었습니다.
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
