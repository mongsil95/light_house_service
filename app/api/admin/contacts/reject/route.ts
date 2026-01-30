import { ContactRejectionEmail } from "@/lib/email-templates/ContactRejectionEmail";
import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { render } from "@react-email/render";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { contactId, reason } = await request.json();

    console.log("거절 API 호출:", { contactId, reason });

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

    console.log("Contact 조회 결과:", { contact, error });

    if (error || !contact) {
      console.error("Contact 조회 실패:", error);
      return NextResponse.json({ error: "예약 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 먼저 상태를 업데이트
    const { error: updateError } = await supabase
      .from("contact_reservations")
      .update({
        status: 'rejected',
        rejected_reason: reason.trim(),
      })
      .eq("id", contactId);

    console.log("상태 업데이트 결과:", { updateError });

    if (updateError) {
      console.error("예약 상태 업데이트 실패:", updateError);
      return NextResponse.json({ error: "상태 업데이트 실패: " + updateError.message }, { status: 500 });
    }

    if (updateError) {
      console.error("예약 상태 업데이트 실패:", updateError);
      return NextResponse.json({ error: "상태 업데이트 실패: " + updateError.message }, { status: 500 });
    }

    // 이메일 발송 시도 (실패해도 상태는 이미 업데이트됨)
    try {
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

      const result = await resend.emails.send({
        from: "등대지기 반려해변 <lighthouse@caresea.kr>",
        to: [contact.email],
        subject: `[반려해변 등대지기] ${contact.organization} 무전 예약 안내`,
        html: emailHtml,
      });

      console.log("이메일 발송 성공:", result);
    } catch (emailError) {
      console.error("이메일 발송 실패 (상태는 업데이트됨):", emailError);
      // 이메일 발송 실패해도 상태는 이미 업데이트되었으므로 계속 진행
    }

    return NextResponse.json({
      message: "무전 거절이 처리되었습니다.",
      success: true,
    });
  } catch (error) {
    console.error("무전 거절 처리 실패:", error);
    return NextResponse.json({ 
      error: "처리 중 오류가 발생했습니다: " + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}
