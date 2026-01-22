import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fileName, fileBase64, mime, userId } = body;

    if (!fileName || !fileBase64) {
      return NextResponse.json({ error: "missing file" }, { status: 400 });
    }

    const supabase = createClient(); // uses service role key on server

    const ext = fileName.split(".").pop();
    const filePath = `tiptap/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const buffer = Buffer.from(fileBase64, "base64");

    const { error: uploadError } = await supabase.storage
      .from("tiptap-images")
      .upload(filePath, buffer, { contentType: mime });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from("tiptap-images").getPublicUrl(filePath);

    // insert metadata using service role (bypass RLS)
    try {
      await supabase.from("tiptap_images").insert([
        {
          user_id: userId || null,
          bucket: "tiptap-images",
          path: filePath,
          file_name: fileName,
          mime: mime || null,
          size: buffer.length,
          public_url: publicData.publicUrl,
          is_public: true,
        },
      ]);
    } catch (metaErr) {
      console.error("metadata insert failed", metaErr);
    }

    return NextResponse.json({ url: publicData.publicUrl });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
