// app/api/send-volunteer-request-email/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { VolunteerInfoRequestEmail } from "../templates/VolunteerInfoRequestEmail";

const resend = new Resend(process.env.RESEND_API_KEY || "");

// @@ 자원봉사 필수정보 등록요청 일괄 이메일 발송 API
export async function POST(req: Request) {
  const body = await req.json();

  const { name, group_name, email, link } = body;

  if (!name || !group_name || !email || !link) {
    return NextResponse.json({ error: "필수 값 누락" }, { status: 400 });
  }

  try {
    const result = await resend.emails.send({
      from: "반려해변 <info@caresea.kr>",
      to: [email],
      subject: "[반려해변] 자원봉사 필수정보 등록 요청",
      react: VolunteerInfoRequestEmail({ name, group_name, link }),
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("이메일 발송 오류", error);
    return NextResponse.json({ error: "서버 오류", detail: String(error) }, { status: 500 });
  }
}
