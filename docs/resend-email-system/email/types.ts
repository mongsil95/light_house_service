// src/lib/email/types.ts

import { bcOfficialPayload } from "../schema/book/activity-official-beachcleanup";

// ✅ 입양 신청 (apply-adopt-group)
export interface ApplyAdoptGroupPayload {
  name: string;
  branch: string;
  orgType: number;
  address: string;
  homepage: string;
  description: string;
  hasAdoptHistory: "신규" | "이력있음";
  managerName: string;
  managerEmail: string;
  managerTel: string;
  managerMobile: string;
  beaches: { id: number; name: string; addr: string }[];
  desiredBeachCount: number;
  role: "applicant" | "member";
  understoodPolicy: true;
  agreeToTerms: true;
  signatureImage?: string | null;
}

//  ✅ 정화 예약 제안 (activity-proposal)
// export interface ReservationProposalPayload {
//   orgName: string;
//   beachName: string;
//   codiName: string;
//   roundNumber: number;
//   manager: string;
//   slots: {
//     date: string;
//     time: string;
//   }[];
// }

export interface SupporterSignupPayload {
  username: string;
  accountId: string;
  password: string;
  userphone: string;
  useremail: string;
  group_id: string; // ✅ 이 줄 추가
}

// ✅ 유틸 함수에 전달할 args 타입
export type SendEmailProps =
  | {
      formId: "apply-adopt-group";
      managerEmail: string;
      itaTeamEmails: string[];
      payload: ApplyAdoptGroupPayload;
    }
  | {
      formId: "activity-proposal";
      managerEmail: string;
      itaTeamEmails?: string[];
      // payload: bcOfficialPayload;
      payload: any;
    }
  | {
      formId: "activity-general-proposal";
      managerEmail: string;
      itaTeamEmails?: string[];
      // payload: bcOfficialPayload;
      payload: any;
    }
  | {
      formId: "activity-community-beachclean-proposal";
      managerEmail: string;
      itaTeamEmails?: string[];
      // payload: bcOfficialPayload;
      payload: any;
    }
  | {
      formId: "activity-network-beachclean-proposal";
      managerEmail: string;
      itaTeamEmails?: string[];
      // payload: bcOfficialPayload;
      payload: any;
    }
  | {
      formId: "activity-cityclean-atseafront-enroll";
      managerEmail: string;
      itaTeamEmails?: string[];
      // payload: bcOfficialPayload;
      payload: any;
    }
  | {
      formId: "proposal-confirmed"; // 일반 이메일 전송용
      managerEmail?: string | string[];
      itaTeamEmails?: string | string[];
      supporterTeamEmails?: string | string[];
      payload: any; // 일반 이메일 데이터 구조
    }
  | {
      formId: "proposal-confirmed-municipal"; // 지자체 주무관용 이메일 전송
      managerEmail?: string | string[];
      itaTeamEmails?: string | string[];
      supporterTeamEmails?: string | string[];
      payload: any; // 일반 이메일 데이터 구조
    }
  | {
      formId: "signup-supporter";
      managerEmail: string;
      itaTeamEmails?: string[];
      supporterTeamEmails?: string[];
      payload: SupporterSignupPayload; // 서포터즈 신청 데이터 구조
    };

/**
 * ApplyAdoptGroupPayload — 입양 신청서 데이터 구조
 * ReservationProposalPayload — 예약 제안 메일용 데이터 구조
 * SupporterSignupPayload — 서포터즈 신청 데이터 구조
 * SendEmailProps — formId에 따라 자동 분기되는 Discriminated Union 타입
 */
