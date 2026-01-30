import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      const { data, error } = await supabase
        .from("admin")
        .select("id,name,nickname,email")
        .eq("id", id)
        .limit(1)
        .single();
      if (error) {
        console.error("Error fetching admin by id:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data });
    }

    // 기본: admin 테이블에서 모든 관리자 목록 반환
    const { data, error } = await supabase
      .from("admin")
      .select("id,name,nickname,email")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching admin users:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Server error fetching admin users:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { name, nickname, email } = body;

    if (!name || !nickname || !email) {
      return NextResponse.json({ error: "이름, 닉네임, 이메일은 필수입니다." }, { status: 400 });
    }

    // admin 테이블에 새 관리자 추가
    const { data, error } = await supabase
      .from("admin")
      .insert({ name, nickname, email })
      .select()
      .single();

    if (error) {
      console.error("Error creating admin:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Server error creating admin:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
