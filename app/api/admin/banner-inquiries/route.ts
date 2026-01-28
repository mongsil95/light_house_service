import { sendBannerInquiryConfirmation, sendBannerInquiryNotification } from "@/lib/email";
import { supabase } from "@/lib/supabase";
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

    // 이메일 전송 (동기로 실행하여 확실하게 전송 완료 보장)
    if (data && data.length > 0) {
      const inquiry = data[0];
      console.log("📧 이메일 전송 시작:", {
        organization: inquiry.organization,
        email: inquiry.email,
      });

      try {
        // 두 이메일을 순차적으로 전송 (더 안정적)
        const notificationResult = await sendBannerInquiryNotification({
          id: inquiry.id,
          organization: inquiry.organization,
          email: inquiry.email,
        });
        console.log("✅ 관리자 알림 이메일 전송:", notificationResult.success ? "성공" : "실패");

        const confirmationResult = await sendBannerInquiryConfirmation({
          organization: inquiry.organization,
          email: inquiry.email,
        });
        console.log("✅ 문의자 확인 이메일 전송:", confirmationResult.success ? "성공" : "실패");

        // 문의자 이메일 전송 실패 시 에러 응답
        if (!confirmationResult.success) {
          console.error("❌ 문의자 이메일 전송 실패:", confirmationResult.error);
          return NextResponse.json(
            { error: "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
            { status: 500 }
          );
        }
      } catch (emailError) {
        console.error("❌ 이메일 전송 중 오류:", emailError);
        return NextResponse.json(
          { error: "이메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요." },
          { status: 500 }
        );
      }
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
