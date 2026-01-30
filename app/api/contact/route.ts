import { ContactReservationEmail } from "@/lib/email-templates/ContactReservationEmail";
import { createClient, supabase } from "@/lib/supabase";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 등대지기 관리자 이메일 목록 가져오기
async function getAdminEmails(): Promise<string[]> {
  try {
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient
      .from("users")
      .select("email")
      .eq("role", "admin")
      .not("email", "is", null);

    if (error) {
      console.error("관리자 이메일 조회 오류:", error);
      return ["happything@itaseoul.org"];
    }

    const emails = data?.map((user) => user.email).filter(Boolean) || [];

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

// 전화번호 형식 검증
function validatePhone(phone: string): boolean {
  const phoneRegex = /^(01[016789]-?\d{3,4}-?\d{4}|0[2-9][0-9]?-?\d{3,4}-?\d{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// 이메일 형식 검증
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organization, name, phone, email, content, method, preferredDate, preferredTime } =
      body;

    // 필수 항목 검사
    if (
      !organization ||
      !name ||
      !phone ||
      !email ||
      !content ||
      !method ||
      !preferredDate ||
      !preferredTime
    ) {
      return NextResponse.json({ error: "모든 필수 항목을 입력해주세요." }, { status: 400 });
    }

    // 전화번호 형식 검증
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)" },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
    }

    // Supabase에 저장
    const { data, error } = await supabase
      .from("contact_reservations")
      .insert([
        {
          organization,
          name,
          phone,
          email,
          content,
          method,
          preferred_date: preferredDate,
          preferred_time: preferredTime,
          status: "pending",
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting contact reservation:", error);
      return NextResponse.json({ error: "예약 신청 중 오류가 발생했습니다." }, { status: 500 });
    }

    // 관리자에게 이메일 알림 발송
    try {
      console.log("📧 이메일 발송 시작...");
      console.log("RESEND_API_KEY 존재 여부:", !!process.env.RESEND_API_KEY);

      const adminEmails = await getAdminEmails();

      const emailHtml = await render(
        ContactReservationEmail({
          data: {
            organization,
            name,
            phone,
            email,
            content,
            method,
            preferredDate,
            preferredTime,
          },
        })
      );

      console.log("이메일 HTML 렌더링 완료");

      const result = await resend.emails.send({
        from: "등대지기 반려해변 <lighthouse@caresea.kr>",
        to: adminEmails,
        subject: `[새 무전 예약] ${organization} - ${name}`,
        html: emailHtml,
      });

      console.log("✅ 관리자 이메일 알림 발송 완료:", result);
    } catch (emailError) {
      console.error("❌ 이메일 발송 실패:", emailError);
      console.error("에러 상세:", JSON.stringify(emailError, null, 2));
      // 이메일 발송 실패해도 예약은 저장되었으므로 성공 응답
    }

    return NextResponse.json({ message: "무전 예약이 신청되었습니다!", data }, { status: 200 });
  } catch (error) {
    console.error("Error in contact reservation API:", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
