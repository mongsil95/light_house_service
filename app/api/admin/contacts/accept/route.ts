import { ContactAcceptanceEmail } from "@/lib/email-templates/ContactAcceptanceEmail";
import { createClient } from "@/lib/supabase";
import { render } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const { contactId, lighthouseContactName, lighthouseContactEmail } = body;

    if (!contactId) {
      return NextResponse.json({ error: "contactId가 필요합니다." }, { status: 400 });
    }

    if (!lighthouseContactName || !lighthouseContactEmail) {
      return NextResponse.json({ error: "담당 등대지기 정보가 필요합니다." }, { status: 400 });
    }

    // contact_reservations 업데이트 (담당자 정보 및 상태 저장)
    const { error: updateError } = await supabase
      .from("contact_reservations")
      .update({
        lighthouse_contact_name: lighthouseContactName,
        lighthouse_contact_email: lighthouseContactEmail,
        status: "accepted",
      })
      .eq("id", contactId);

    if (updateError) {
      console.error("담당자 정보 저장 실패:", updateError);
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
      ContactAcceptanceEmail({
        data: {
          organization: contact.organization,
          name: contact.name,
          phone: contact.phone,
          email: contact.email,
          preferredDate: contact.preferred_date,
          preferredTime: contact.preferred_time,
          method: contact.method,
          lighthouseContactName,
          lighthouseContactEmail,
        },
      })
    );

    // 이메일 발송
    const result = await resend.emails.send({
      from: "등대지기 반려해변 <lighthouse@caresea.kr>",
      to: [contact.email],
      replyTo: lighthouseContactEmail,
      subject: `[반려해변 등대지기] ${contact.organization} 무전 예약이 확정되었습니다`,
      html: emailHtml,
    });

    return NextResponse.json({
      message: "무전 수락 이메일이 발송되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("무전 수락 이메일 발송 실패:", error);
    return NextResponse.json({ error: "이메일 발송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
