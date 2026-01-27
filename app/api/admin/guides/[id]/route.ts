import { createClient, supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - 가이드 상세 조회
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "가이드를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - 가이드 수정
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      is_recommended,
    } = body;

    // content 생성
    const finalContent =
      content || sections?.map((s: any) => s.content).join("\n\n") || description;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (category) updateData.category = category;
    if (title) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (finalContent) updateData.content = finalContent;
    if (author) updateData.author = author;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (is_recommended !== undefined) updateData.is_recommended = is_recommended;
    if (status) {
      updateData.status = status;
      if (status === "published" && !updateData.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from("resources")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

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

// DELETE - 가이드 삭제
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // 먼저 스토리지의 가이드 관련 모든 파일을 삭제
    const sb = createClient();
    const prefix = `guides/${params.id}/`;
    try {
      const { data: listData, error: listError } = await sb.storage
        .from("guide-files")
        .list(`guides/${params.id}/`, { limit: 1000 });

      if (listError) {
        console.error("Storage list error:", listError);
      } else if (listData && listData.length > 0) {
        const paths = listData
          .map((item: any) => item.name || item.path || item.id)
          .map((n: string) => `${prefix}${n}`);
        // remove expects exact object names
        await sb.storage.from("guide-files").remove(paths);
      }
    } catch (e) {
      console.error("Error removing guide storage files:", e);
    }

    // 리소스(가이드) 레코드 삭제
    const { error } = await supabase.from("resources").delete().eq("id", params.id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "삭제되었습니다." });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
