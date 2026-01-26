import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// DELETE - 파일 레코드(id) 기준으로 Storage 파일 삭제 후 DB 레코드 삭제
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const fileId = params.id;

    const sb = createClient();
    // 메타 정보 조회
    const { data: fileMeta, error: selectError } = await sb
      .from("guides_files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (selectError) {
      console.error("Select error:", selectError);
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }

    if (!fileMeta) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const filePath = fileMeta.file_path;

    // 스토리지에서 삭제
    const { error: removeError } = await sb.storage.from("guide-files").remove([filePath]);

    if (removeError) {
      console.error("Storage remove error:", removeError);
      // 계속해서 DB 레코드 삭제는 시도하지 않음
      return NextResponse.json({ error: removeError.message }, { status: 500 });
    }

    // DB에서 레코드 삭제
    const { error: dbDeleteError } = await sb.from("guides_files").delete().eq("id", fileId);

    if (dbDeleteError) {
      console.error("DB delete error:", dbDeleteError);
      return NextResponse.json({ error: dbDeleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "파일이 삭제되었습니다." });
  } catch (error: any) {
    console.error("File delete server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
