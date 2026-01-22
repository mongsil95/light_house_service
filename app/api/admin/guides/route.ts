import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - 가이드 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let query = supabase.from("resources").select("*").order("created_at", { ascending: false });

    // 카테고리 필터
    if (category && category !== "전체") {
      query = query.eq("category", category);
    }

    // 상태 필터
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - 새 가이드 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
      title,
      subtitle,
      description,
      content,
      readTime,
      videoUrl,
      sections,
      tags,
      status,
      author,
      thumbnail_url,
    } = body;

    // 필수 필드 검증
    if (!category || !title) {
      return NextResponse.json({ error: "필수 필드가 누락되었습니다." }, { status: 400 });
    }

    // description이 없으면 subtitle 또는 content의 첫 부분이나 title 사용
    const finalDescription = description || subtitle || content?.slice(0, 100) || title;

    // content 생성 (sections를 문자열로 변환하거나 description 사용)
    const finalContent =
      content || sections?.map((s: any) => s.content).join("\n\n") || finalDescription;

    const { data, error } = await supabase
      .from("resources")
      .insert({
        category,
        title,
        subtitle: subtitle || null,
        content: finalContent,
        author: author || "관리자",
        status: status || "draft",
        published_at: status === "published" ? new Date().toISOString() : null,
        thumbnail_url: thumbnail_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
