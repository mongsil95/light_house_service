import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // 게시글 조회
    const { data: resource, error: resourceError } = await supabase
      .from("resources")
      .select("*")
      .eq("id", id)
      .eq("status", "published")
      .single();

    if (resourceError) {
      console.error("Resource error:", resourceError);
      return NextResponse.json({ error: resourceError.message }, { status: 404 });
    }

    // 첨부파일 조회
    const { data: attachments, error: attachmentsError } = await supabase
      .from("attachments")
      .select("*")
      .eq("resource_id", id);

    if (attachmentsError) {
      console.error("Attachments error:", attachmentsError);
    }

    // 조회수 증가
    await supabase
      .from("resources")
      .update({ views: (resource.views || 0) + 1 })
      .eq("id", id);

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
