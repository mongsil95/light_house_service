import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/qna/[id] - Get single Q&A
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { id } = params;

    const { data, error } = await supabase.from("qna").select("*").eq("id", id).single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching Q&A:", error);
    return NextResponse.json({ error: "Failed to fetch Q&A" }, { status: 500 });
  }
}

// PUT /api/admin/qna/[id] - Update Q&A
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const supabase = createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("qna")
      .update({
        title: body.title,
        content: body.content,
        category: body.category,
        author_name: body.author_name,
        author_email: body.author_email || null,
        author_phone: body.author_phone || null,
        status: body.status,
        is_public: body.is_public,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error updating Q&A:", error);
    return NextResponse.json({ error: "Failed to update Q&A" }, { status: 500 });
  }
}

// PATCH /api/admin/qna/[id] - Update Q&A (alternative)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const supabase = createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("qna")
      .update({
        title: body.title,
        content: body.content,
        category: body.category,
        author_name: body.author_name,
        author_email: body.author_email || null,
        author_phone: body.author_phone || null,
        status: body.status,
        is_public: body.is_public,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error updating Q&A:", error);
    return NextResponse.json({ error: "Failed to update Q&A" }, { status: 500 });
  }
}

// DELETE /api/admin/qna/[id] - Delete Q&A
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const { id } = params;

    const { error } = await supabase.from("qna").delete().eq("id", id);

    if (error) throw error;

    return NextResponse.json({ message: "Q&A deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Q&A:", error);
    return NextResponse.json({ error: "Failed to delete Q&A" }, { status: 500 });
  }
}
