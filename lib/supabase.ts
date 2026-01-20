import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// 클라이언트 사이드용 (브라우저)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// 서버 사이드용 (API 라우트, RLS 우회)
export function createClient() {
  // 서버 환경에서는 Service Role Key 사용
  if (typeof window === "undefined" && supabaseServiceKey) {
    return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  // 클라이언트 환경에서는 Anon Key 사용
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}
