import { ContactRejectionEmail } from "@/lib/email-templates/ContactRejectionEmail";
import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { contactId, reason } = await request.json();

    if (!contactId) {
      return NextResponse.json({ error: "contactId가 필요합니다." }, { status: 400 });
    }

    if (!reason || !reason.trim()) {
      return NextResponse.json({ error: "거절 사유가 필요합니다." }, { status: 400 });
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

    // 이메일 HTML 렌더링
    const emailHtml = await render(
      ContactRejectionEmail({
        data: {
          organization: contact.organization,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          preferredDate: contact.preferred_date,
          preferredTime: contact.preferred_time,
          method: contact.method,
          reason: reason.trim(),
        },
      })
    );

    // 이메일 발송
    const result = await resend.emails.send({
      from: "등대지기 반려해변 <lighthouse@caresea.kr>",
      to: [contact.email],
      subject: `[반려해변 등대지기] ${contact.organization} 무전 예약 안내`,
      html: emailHtml,
    });

    // 예약 삭제 대신 상태를 'rejected'로 업데이트
    const { error: updateError } = await supabase
      .from("contact_reservations")
      .update({
        status: 'rejected',
        rejected_reason: reason.trim(),
      })
      .eq("id", contactId);

    if (updateError) {
      console.error("예약 상태 업데이트 실패:", updateError);
      // 이메일은 발송되었으므로 경고만 표시
    }

    return NextResponse.json({
      message: "무전 거절 이메일이 발송되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("무전 거절 이메일 발송 실패:", error);
    return NextResponse.json({ error: "이메일 발송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
