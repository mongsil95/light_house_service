import { supabase } from "@/lib/supabase";

export async function uploadImageFile(file: File) {
  const ext = file.name.split(".").pop();
  const filePath = `tiptap/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  // try direct client upload first
  try {
    const { data, error } = await supabase.storage
      .from("tiptap-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data: publicData } = supabase.storage.from("tiptap-images").getPublicUrl(filePath);

    // Try to insert metadata if user is authenticated
    try {
      const userResult = await supabase.auth.getUser();
      const userId = userResult?.data?.user?.id || null;
      if (userId) {
        await supabase.from("tiptap_images").insert([
          {
            user_id: userId,
            bucket: "tiptap-images",
            path: filePath,
            file_name: file.name,
            mime: file.type,
            size: file.size,
            public_url: publicData.publicUrl,
            is_public: true,
          },
        ]);
      } else {
        console.warn("Skipping metadata insert: no authenticated user (avoids RLS violation)");
      }
    } catch (e) {
      console.error("Failed to insert image metadata", e);
    }

    return publicData.publicUrl;
  } catch (err: any) {
    console.error("Client upload failed", err);

    // Fallback: send file to server API which uses service role key
    try {
      const toBase64 = (f: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(f);
        });

      const dataUrl = await toBase64(file);
      const base64 = dataUrl.split(",")[1];

      // try to get user id (may be null)
      let userId = null;
      try {
        const userResult = await supabase.auth.getUser();
        userId = userResult?.data?.user?.id || null;
      } catch (_) {
        userId = null;
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileBase64: base64, mime: file.type, userId }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "server upload failed");

      return json.url;
    } catch (e) {
      console.error("Server fallback upload failed", e);
      throw err;
    }
  }
}
