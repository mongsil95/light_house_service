import { ContactRescheduleEmail } from "@/lib/email-templates/ContactRescheduleEmail";
import { createClient } from "@/lib/supabase";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(); // 서버용 Supabase 클라이언트 생성
    const { contactId, previousDate, previousTime, newDate, newTime, reason } =
      await request.json();

    if (!contactId || !previousDate || !previousTime || !newDate || !newTime) {
      return NextResponse.json({ error: "필수 정보가 누락되었습니다." }, { status: 400 });
    }

    // contact_reservations에서 데이터 가져오기
    const { data: contact, error } = await supabase
      .from("contact_reservations")
      .select("*")
      .eq("id", contactId)
      .single();

    if (error || !contact) {
      console.error("Contact 조회 실패:", error);
      return NextResponse.json({ error: "예약 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 담당자 이메일 (없으면 기본 이메일 사용)
    const replyToEmail = contact.lighthouse_contact_email || "lighthouse@caresea.kr";

    // 이메일 HTML 렌더링
    const emailHtml = await render(
      ContactRescheduleEmail({
        data: {
          organization: contact.organization,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          previousDate,
          previousTime,
          newDate,
          newTime,
          reason: reason || undefined,
          lighthouseContactName: contact.lighthouse_contact_name || undefined,
          lighthouseContactEmail: contact.lighthouse_contact_email || undefined,
        },
      })
    );

    // 이메일 발송
    const result = await resend.emails.send({
      from: "등대지기 반려해변 <lighthouse@caresea.kr>",
      to: [contact.email],
      replyTo: replyToEmail, // 담당자 이메일로 회신
      subject: `[반려해변 등대지기] ${contact.organization} 무전 예약 일정이 변경되었습니다`,
      html: emailHtml,
    });

    console.log("✅ 약속 변경 이메일 발송 완료:", result);

    return NextResponse.json({
      message: "약속 변경 이메일이 발송되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("❌ 약속 변경 이메일 발송 실패:", error);
    return NextResponse.json({ error: "이메일 발송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
