import { supabase } from "@/lib/supabase";
import { sendBannerInquiryNotification, sendBannerInquiryConfirmation } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

// 배너 문의 목록 조회
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("banner_inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching banner inquiries:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 배너 문의 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { organization, email } = body;

    if (!organization || !email) {
      return NextResponse.json({ error: "기관명과 이메일을 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("banner_inquiries")
      .insert([
        {
          organization,
          email,
          status: "pending",
        },
      ])
      .select();

    if (error) throw error;

    // 이메일 전송 (비동기로 실행, 실패해도 응답은 성공 처리)
    if (data && data.length > 0) {
      const inquiry = data[0];
      console.log("📧 이메일 전송 시작:", {
        organization: inquiry.organization,
        email: inquiry.email,
      });

      Promise.all([
        sendBannerInquiryNotification({
          id: inquiry.id,
          organization: inquiry.organization,
          email: inquiry.email,
        }),
        sendBannerInquiryConfirmation({
          organization: inquiry.organization,
          email: inquiry.email,
        }),
      ])
        .then((results) => {
          console.log("✅ 이메일 전송 완료:", results);
        })
        .catch((emailError) => {
          console.error("❌ 이메일 전송 오류:", emailError);
        });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating banner inquiry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 배너 문의 상태 업데이트
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID와 상태를 입력해주세요." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("banner_inquiries")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating banner inquiry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 배너 문의 삭제
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID를 입력해주세요." }, { status: 400 });
    }

    const { error } = await supabase.from("banner_inquiries").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "삭제되었습니다." }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting banner inquiry:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
