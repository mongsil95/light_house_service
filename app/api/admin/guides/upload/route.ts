import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// POST - 다중 파일 업로드: form-data로 files[]와 guideId (resource_id)를 전달
export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const guideId = form.get("guideId") as string;

    if (!guideId) {
      return NextResponse.json({ error: "guideId is required" }, { status: 400 });
    }

    // prefer explicit 'files' or 'files[]' fields
    const rawFiles: FormDataEntryValue[] = [
      ...form.getAll("files"),
      ...form.getAll("files[]"),
      ...form.getAll("file"),
    ];

    const files: File[] = rawFiles.filter((v): v is File => v instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const sb = createClient();
    const uploadedRecords: any[] = [];

    for (const f of files) {
      const uuid = crypto.randomUUID();
      const safeName = f.name.replace(/\s+/g, "_");
      const path = `guides/${guideId}/${uuid}_${safeName}`;

      // 업로드
      const { error: uploadError } = await sb.storage
        .from("guide-files")
        .upload(path, f, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        // 실패한 파일은 건너뛰고 계속 진행
        continue;
      }

      // DB에 메타데이터 저장
      const { data, error: dbError } = await sb
        .from("guides_files")
        .insert([
          {
            resource_id: Number(guideId),
            file_path: path,
            file_name: f.name,
            file_size: f.size,
            file_type: f.type,
          },
        ])
        .select()
        .single();

      if (dbError) {
        console.error("DB insert error:", dbError);
        // 업로드된 파일을 정리하려면 삭제 시도
        await sb.storage.from("guide-files").remove([path]);
        continue;
      }

      uploadedRecords.push(data);
    }

    return NextResponse.json({ data: uploadedRecords }, { status: 201 });
  } catch (error: any) {
    console.error("Upload server error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
