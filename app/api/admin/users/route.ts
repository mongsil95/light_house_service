import { createClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (id) {
      const { data, error } = await supabase
        .from('users')
        .select('id,nickname')
        .eq('id', id)
        .limit(1)
        .single();
      if (error) {
        console.error('Error fetching user by id:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ data });
    }

    // 기본: role이 admin인 사용자 목록 반환
    const { data, error } = await supabase.from('users').select('id,nickname').eq('role', 'admin');
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
