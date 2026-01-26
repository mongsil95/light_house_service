import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET - 쿼리 ?path=guides/{id}/xxx 형태로 전달하면 서명된 URL로 리다이렉트
export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const filePath = url.searchParams.get("path");
    if (!filePath) return NextResponse.json({ error: "path is required" }, { status: 400 });

    const sb = createClient();
    // 서명 URL 생성 (60초)
    const { data, error } = await sb.storage.from("guide-files").createSignedUrl(filePath, 60);

    if (error) {
      console.error("createSignedUrl error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data?.signedUrl)
      return NextResponse.json({ error: "failed to create url" }, { status: 500 });

    return NextResponse.redirect(data.signedUrl);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
