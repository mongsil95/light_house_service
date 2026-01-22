// 이메일 전송 유틸 src/lib/email/email-resend-hook.ts
import { Resend } from "resend";
import { AdoptApplyConfirmationEmail } from "./templates/AdoptApplyConfirmationEmail";
import { ReservationProposalEmail } from "./templates/ReservationProposalEmail";
import { SupporterSignupEmail } from "./templates/supporterSignupEmail";
import { ReservationConfirmEmail } from "./templates/ReservationConfirmEmail";
import { AdbGroupManagerEnrollEmail } from "./templates/AdbGroupManagerEnrollEmail";
import { RsvCommunityProposalEmail } from "./templates/RsvCommunityProposalEmail";
import { RsvCampaignProposalEmail } from "./templates/RsvCampaignProposalEmail";
import { RsvCampaignCityCleanUpConfirmEmail } from "./templates/RsvCampaignCityCleanUpConfirmEmail";
import { RsvOfficialBeachCleanConfirmMunicipal } from "./templates/RsvOfficialBeachCleanConfirmMunicipal";
import { Conf25ParticipantEmail } from "./templates/Conf25ParticipantEmail";
import { Conf25OfficeNotificationEmail } from "./templates/Conf25OfficeNotificationEmail";
import { Conf25KoemNotificationEmail } from "./templates/Conf25KoemNotificationEmail";
import { Conf25AttendeeEmail } from "./templates/Conf25AttendeeEmail";
import { Conf25AttendanceOfficeEmail } from "./templates/Conf25AttendanceOfficeEmail";
import { Conf25AttendanceKoemEmail } from "./templates/Conf25AttendanceKoemEmail";
import { Conf25RejectionEmail } from "./templates/Conf25RejectionEmail";
import { Conf25SupplementEmail } from "./templates/Conf25SupplementEmail";
import { Conf25DailyReportEmail } from "./templates/Conf25DailyReportEmail";
import { NewsletterBasicEmail } from "./templates/NewsletterBasicEmail";
import { CoffeeChatConfirmEmail } from "./templates/CoffeeChatConfirmEmail";
import { CoffeeChatReservedEmail } from "./templates/CoffeeChatReservedEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "");

interface SendEmailProps {
  formId: string; // 어떤 신청서인지 구분
  managerEmail?: string | string[]; // ✅ 하나 또는 여러 개 허용
  itaTeamEmails?: string | string[]; // ✅ 하나 또는 여러 개 허용
  supporterTeamEmails?: string | string[]; // ✅ 하나 또는 여러 개 허용
  payload: any; // 신청서 데이터 (예: name, orgType 등)
}

// 이메일 전송 함수

// 기본 수신자 목록 정의
//
const DEFAULT_ITATEAM_EMAILS = [
  "itaseoul@itaseoul.org",
  "cto@itaseoul.org",
  "happything@itaseoul.org", // 유권선
  "sehiduo5757@itaseoul.org", // 한수현
  "pearl.2@itaseoul.org", // 이진주
  "jjcyjh02@itaseoul.org", // 장지현
  // "gksekdnjs777@itaseoul.org"
];

const DEFAULT_SUPPORTER_TEAM_EMAILS = [
  "sehiduo5757@itaseoul.org",
  "gksekdnjs777@itaseoul.org",
];
const DEFAULT_MANAGER_EMAILS = [""];

export async function sendEmailNotification({
  formId,
  managerEmail = DEFAULT_MANAGER_EMAILS,
  itaTeamEmails = DEFAULT_ITATEAM_EMAILS,
  supporterTeamEmails = DEFAULT_SUPPORTER_TEAM_EMAILS,
  payload,
}: SendEmailProps) {
  // ✅ 단일 문자열이라면 배열로 변환
  const managerList =
    typeof managerEmail === "string" ? [managerEmail] : managerEmail;

  const toRecipients = [...managerList, ...itaTeamEmails];

  // console.log("📬 이메일 전송 대상:", toRecipients);

  switch (formId) {
    case "apply-adopt-group":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: toRecipients,
        subject: "입양 신청이 완료되었습니다",
        react: AdoptApplyConfirmationEmail({ data: payload }),
      });

    //  그룹매니저 등록 초대메일

    case "invite-groupmanager-enroll":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: managerList,
        subject: `[그룹매니저 등록] ${payload.managerName} 님을 초대합니다`,
        react: AdbGroupManagerEnrollEmail({ data: payload }),
      });

    // 입양기관 ========================================================

    // #  입양기관의 입양해변 정화일시 제안
    case "activity-proposal":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: managerList, // @@ 코디 전송
        subject: `[예약 제안] ${payload.title} `,
        react: ReservationProposalEmail({ data: payload }),
      });

    // #  예약 확정 회신 - 입양기관
    case "proposal-confirmed":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: managerList,
        subject: `[예약 회신] ${payload.title}`,
        react: ReservationConfirmEmail({ data: payload }),
      });

    // #  예약 확정 회신 - 지자체 담당자
    case "proposal-confirmed-municipal":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: managerList,
        subject: `[해변정화 일정공유] ${payload.title}`,
        react: RsvOfficialBeachCleanConfirmMunicipal({ data: payload }),
      });

    // ========================================================

    // #  [커뮤니티] 코디 커뮤니티 정화활동 승인요청
    case "activity-community-beachclean-proposal":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: itaTeamEmails, // @@ ITA 팀원들 이메일로 전송
        subject: `[승인 요청] ${payload.title} `,
        react: RsvCommunityProposalEmail({ data: payload }),
      });

    // =========================================================

    // # [기획캠페인]  입양기관의 해양보호캠페인 승인요청
    case "activity-general-proposal":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: itaTeamEmails, // @@ ITA 팀원들 이메일로 전송
        subject: `[승인 요청] ${payload.title} `,
        react: RsvCampaignProposalEmail({ data: payload }),
      });

    // # [공동캠페인] 입양기관의 도심플로깅 캠페인 - 바로참여
    case "activity-cityclean-atseafront-enroll":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: itaTeamEmails, // @@ ITA 팀원들 이메일로 전송
        subject: `[참여 안내] ${payload.title} `,
        react: RsvCampaignCityCleanUpConfirmEmail({ data: payload }),
      });

    case "signup-supporter":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: toRecipients,
        subject: "서포터즈 등록 완료 안내",
        react: SupporterSignupEmail({ data: payload }),
      });

    case "invite-adb-groupmanager-enroll":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: toRecipients,
        subject: "서포터즈 등록 완료 안내",
        react: SupporterSignupEmail({ data: payload }),
      });

    // # [전국대회] 참가자 등록 - 3-way 이메일 발송
    case "conf25-participant-registration": {
      // 티켓 이미지를 첨부파일로 준비
      const attachments = [];
      if (payload.ticketImage) {
        // Base64 데이터에서 헤더 제거 (data:image/png;base64, 부분)
        const base64Data = payload.ticketImage.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        attachments.push({
          filename: `ticket_${payload.ticketNumber || "conf25"}.png`,
          content: base64Data,
          content_type: "image/png",
        });
      }

      // 1. 참가자 본인에게 확인 메일 (첨부파일 포함)
      const participantEmail = resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.email],
        subject: "[제3회 반려해변 전국대회] 참가 신청이 완료되었습니다",
        react: Conf25ParticipantEmail({ data: payload }),
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // 2. 사무국(이타서울) 유권선 에게 알림
      const officeEmail = resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: ["sehiduo5757@itaseoul.org", "happything@itaseoul.org"],
        subject: `[전국대회 등록 알림] ${payload.name} (${payload.organizationName})`,
        react: Conf25OfficeNotificationEmail({ data: payload }),
      });

      // TODO: 3. 공단(한민지 담당자)에게 알림 - 공단 공유 전까지 발송 중단
      /* 
      const koemEmail = resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: ["cto@itaseoul.org"], // 테스트용, 실제로는 한민지 담당자 이메일
        subject: `[공단 공유] 전국대회 참가자 등록 - ${payload.organizationName}`,
        react: Conf25KoemNotificationEmail({ data: payload }),
      });
      */

      // 2개 이메일 동시 발송 (참가자 + 사무국)
      return await Promise.all([participantEmail, officeEmail]);
    }

    // # [전국대회] 일반참여 신청 - 3-way 이메일 발송
    case "conf25-general-attendance": {
      // 1. 참석자 본인에게 확인 메일
      const attendeeEmail = resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.email],
        subject: "[제3회 반려해변 전국대회] 참가 신청이 완료되었습니다",
        react: Conf25AttendeeEmail({ data: payload }),
      });

      // 2. 사무국(이타서울) 유권선 에게 알림
      const officeEmail = resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: ["sehiduo5757@itaseoul.org", "happything@itaseoul.org"],
        subject: `[전국대회 일반참여] ${payload.name} (${payload.affiliation})`,
        react: Conf25AttendanceOfficeEmail({ data: payload }),
      });

      // 3. 공단(한민지 담당자)에게 알림
      // const koemEmail = resend.emails.send({
      //   from: "반려해변 <info@caresea.kr>",
      //   to: ["cto@itaseoul.org"], // 실제로는 한민지 대리 이메일
      //   subject: `[공단 공유] 전국대회 일반참여 - ${payload.name} (${payload.affiliation})`,
      //   react: Conf25AttendanceKoemEmail({ data: payload }),
      // });

      // 2개 이메일 동시 발송
      return await Promise.all([attendeeEmail, officeEmail]);
    }

    // # [전국대회] 일반참가자 승인 및 초대장 발송
    case "conf25-general-attendance-approved": {
      // 티켓 이미지를 첨부파일로 준비
      const attachments = [];
      if (payload.ticketImage) {
        // Base64 데이터에서 헤더 제거 (data:image/png;base64, 부분)
        const base64Data = payload.ticketImage.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        attachments.push({
          filename: `ticket_${payload.ticketNumber || "conf25"}.png`,
          content: base64Data,
          content_type: "image/png",
        });
      }

      return resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.email],
        subject: "[제3회 반려해변 전국대회] 참가가 승인되었습니다 🎉",
        react: Conf25AttendeeEmail({ data: payload }),
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    }

    // # [전국대회] 일반참가자 거절 이메일
    case "conf25-general-attendance-rejected": {
      return resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.email],
        subject: "[제3회 반려해변 전국대회] 참가 신청 결과 안내",
        react: Conf25RejectionEmail({ data: payload }),
      });
    }

    // # [전국대회] 일반참가자 보완 요청 이메일
    case "conf25-general-attendance-supplement": {
      return resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.email],
        subject: "[제3회 반려해변 전국대회] 신청 내용 보완 요청",
        react: Conf25SupplementEmail({
          data: {
            ...payload,
            editUrl: payload.editUrl, // PHP에서 생성한 수정 링크 전달
          },
        }),
      });
    }

    // # [전국대회] 일반참가자 보완 재제출 알림 (사무국)
    case "conf25-general-attendance-supplement-resubmit": {
      const { name, email, affiliation, position, id } = payload;
      const adminPageUrl =
        process.env.NODE_ENV === "production"
          ? "https://team.caresea.kr/admin/conf25-ticketslot-manage-unified"
          : "http://localhost:3001/admin/conf25-ticketslot-manage-unified";

      const emailContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; }
              .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .info-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🔔 보완 재제출 알림</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">참가자가 수정 내용을 제출했습니다</p>
              </div>
              <div class="content">
                <p>안녕하세요, 사무국 담당자님</p>
                <p><strong>${name}</strong> 님이 보완 요청에 따라 신청 내용을 수정하여 재제출했습니다.</p>
                
                <div class="info-box">
                  <h3 style="margin-top: 0;">📋 참가자 정보</h3>
                  <p><strong>이름:</strong> ${name}</p>
                  <p><strong>이메일:</strong> ${email}</p>
                  <p><strong>소속:</strong> ${affiliation}</p>
                  <p><strong>직책:</strong> ${position}</p>
                  <p><strong>ID:</strong> ${id}</p>
                </div>

                <p><strong>✅ 다음 조치가 필요합니다:</strong></p>
                <ol>
                  <li>관리자 페이지에서 수정된 내용을 확인해주세요</li>
                  <li>내용이 적절하다면 "승인" 처리해주세요</li>
                  <li>추가 보완이 필요하다면 다시 "보완 요청"을 보낼 수 있습니다</li>
                </ol>

                <div style="text-align: center;">
                  <a href="${adminPageUrl}" class="button">관리자 페이지에서 확인하기</a>
                </div>

                <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 20px; border-left: 4px solid #ffc107;">
                  <strong>💡 팁:</strong> 관리자 페이지에서 "보완 요청 (처리 중)" 뱃지를 찾아보세요!
                </div>
              </div>
              <div class="footer">
                <p>이 이메일은 반려해변 전국대회 시스템에서 자동 발송되었습니다</p>
                <p>반려해변 사무국 | info@caresea.kr</p>
              </div>
            </div>
          </body>
        </html>
      `;

      return resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: ["sehiduo5757@itaseoul.org", "happything@itaseoul.org"], // 사무국 운영진 (다른 전국대회 알림과 동일)
        subject: `[보완 재제출] ${name} 님의 수정 내용 확인 필요`,
        html: emailContent,
      });
    }

    // # [전국대회] 매일 오전 9시 일일 리포트 (사무국 전체)
    case "conf25-daily-report": {
      return resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: itaTeamEmails, // 사무국 전원
        subject: `[제3회 반려해변 전국대회 신청현황] 일일 리포트 - ${payload.today}`,
        react: Conf25DailyReportEmail({ data: payload }),
      });
    }

    // # [뉴스레터] 기본 뉴스레터 발송
    case "newsletter-basic": {
      return resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.recipientEmail], // 개별 수신자
        subject: payload.title,
        react: NewsletterBasicEmail({ data: payload }),
      });
    }

    // # [뉴스레터] 일괄 발송 (내부용 - 직접 호출하지 말 것)
    case "newsletter-batch": {
      // 여러 수신자에게 동시 발송
      const emailPromises = payload.recipients.map((recipient: any) => {
        return resend.emails.send({
          from: "반려해변 <info@caresea.kr>",
          to: [recipient.email],
          subject: payload.title,
          react: NewsletterBasicEmail({
            data: {
              title: payload.title,
              recipientName: recipient.name,
              recipientOrganization: recipient.organization,
              contentHtml: payload.contentHtml,
              unsubscribeUrl: payload.unsubscribeUrl,
              viewOnlineUrl: payload.viewOnlineUrl,
            },
          }),
        });
      });

      return Promise.all(emailPromises);
    }

    // # [커피챗] 예약 접수 이메일 발송 (즉시 발송 - 신청자 + 사무국)
    case "coffeechat-reserved": {
      // 1. 신청자에게 접수 확인 메일
      const applicantEmail = resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.email],
        subject: `[등대지기와 차 한잔] 예약 신청이 접수되었습니다 ☕`,
        react: CoffeeChatReservedEmail({ data: payload }),
      });

      // 2. 사무국(이타서울)에게 알림 (간단한 텍스트 메일)
      const officeEmail = resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: typeof itaTeamEmails === "string" ? [itaTeamEmails] : itaTeamEmails,
        subject: `[커피챗 신청 알림] ${payload.name} (${payload.organization})`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #667eea;">☕ 새로운 커피챗 예약 신청</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>신청자:</strong> ${payload.name}</p>
              <p><strong>소속:</strong> ${payload.organization}</p>
              <p><strong>이메일:</strong> ${payload.email}</p>
              <p><strong>연락처:</strong> ${payload.phone}</p>
              <p><strong>예약 시간:</strong> ${payload.slot_date} ${payload.slot_time}</p>
              ${payload.message ? `<p><strong>메시지:</strong><br/>${payload.message}</p>` : ""}
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              관리자 페이지에서 확정 후 구글 밋 링크를 발송해주세요.<br/>
              <a href="${process.env.NODE_ENV === "production" ? "https://team.caresea.kr" : "http://localhost:3001"}/admin/adb-coffeechat" style="color: #667eea;">관리자 페이지 바로가기 →</a>
            </p>
          </div>
        `,
      });

      // 2개 이메일 동시 발송
      return await Promise.all([applicantEmail, officeEmail]);
    }

    // # [커피챗] 예약 확정 이메일 발송 (관리자가 수동 확정 시)
    case "coffeechat-confirmed":
      return await resend.emails.send({
        from: "반려해변 <info@caresea.kr>",
        to: [payload.email],
        subject: `[등대지기와 차 한잔] 예약이 확정되었습니다 ☕`,
        react: CoffeeChatConfirmEmail({ data: payload }),
      });
  }
}

/** *
 * * formId에 따라 payload 타입이 자동 추론됨
 * * 잘못된 데이터 전달 시 TypeScript에서 즉시 오류 감지
 * * 이메일 템플릿에도 강력한 타입 보장
// * import { Resend } from 'resend';
import { AdoptApplyConfirmationEmail } from './templates/AdoptApplyConfirmationEmail';
import { ReservationProposalEmail } from './templates/ReservationProposalEmail';
import { SendEmailProps } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

// 이메일 전송 함수
export async function sendEmailNotification(args: SendEmailProps) {
  const { formId, managerEmail, itaTeamEmails, payload } = args;

  const toRecipients = [managerEmail, ...itaTeamEmails];

  switch (formId) {
    case 'apply-adopt-group': {
      return await resend.emails.send({
        from: '반려해변 <info@caresea.kr>',
        to: toRecipients,
        subject: '입양 신청이 완료되었습니다',
        react: AdoptApplyConfirmationEmail({ data: payload }),
      });
    }

    case 'activity-proposal': {
      return await resend.emails.send({
        from: '반려해변 <info@caresea.kr>',
        to: toRecipients,
        subject: `[예약 제안] ${payload.orgName} - ${payload.beachName} 정화활동`,
        react: ReservationProposalEmail({ data: payload }),
      });
    }
  }
}

 */
