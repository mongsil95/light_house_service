import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { name, nickname } = body;

    if (!name || !nickname) {
      return NextResponse.json({ error: "이름과 닉네임은 필수입니다." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("admin")
      .update({ name, nickname })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Server error updating admin:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createClient();

    const { error } = await supabase.from("admin").delete().eq("id", params.id);

    if (error) {
      console.error("Error deleting admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Server error deleting admin:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
