import { sendNewQuestionNotification } from "@/lib/email";
import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/qna - Get all Q&A
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let query = supabase.from("qna").select("*").order("created_at", { ascending: false });

    if (category && category !== "전체") {
      query = query.eq("category", category);
    }

    if (status && status !== "전체") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Q&A:", error);
    return NextResponse.json({ error: "Failed to fetch Q&A" }, { status: 500 });
  }
}

// POST /api/admin/qna - Create new Q&A
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient();

    const { data, error } = await supabase
      .from("qna")
      .insert([
        {
          title: body.title,
          content: body.content,
          category: body.category,
          author_name: body.author_name,
          author_email: body.author_email || null,
          author_phone: body.author_phone || null,
          status: body.status || "pending",
          is_public: body.is_public !== undefined ? body.is_public : true,
          views: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // 관리자에게 새 질문 알림 이메일 전송
    if (data) {
      await sendNewQuestionNotification({
        id: data.id,
        title: data.title,
        author_name: data.author_name,
        author_email: data.author_email,
        category: data.category,
      });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error creating Q&A:", error);
    return NextResponse.json({ error: "Failed to create Q&A" }, { status: 500 });
  }
}
