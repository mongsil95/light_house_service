import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const sb = createClient();
    // 게시글 조회
    const { data: resource, error: resourceError } = await sb
      .from("resources")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (resourceError) {
      console.error("Resource error:", resourceError);
      return NextResponse.json({ error: resourceError.message }, { status: 404 });
    }

    // 첨부파일 조회 (guides_files 테이블 사용)
    const { data: attachments, error: attachmentsError } = await sb
      .from("guides_files")
      .select("id, file_name, file_path, file_size, file_type, created_at")
      .eq("resource_id", id)
      .order("created_at", { ascending: false });

    if (attachmentsError) {
      console.error("Attachments error:", attachmentsError);
    }

    // 조회수 증가
    // 조회수는 클라이언트에서 처리하도록 변경 (중복 증가 방지)

    return NextResponse.json({
      data: {
        ...resource,
        attachments: attachments || [],
        comments: [], // 댓글은 숨김 처리되어 있으므로 빈 배열
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
