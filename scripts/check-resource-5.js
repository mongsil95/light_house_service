// Resource ID 5 데이터 확인
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://tyqnlllbnvkabdskobnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cW5sbGxibnZrYWJkc2tvYm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDc3NTMsImV4cCI6MjA4NDM4Mzc1M30.vJ_stt4Bj4Eahi-d6iWPi_EVMWN8GQBMwgIdldbz9tw"
);

async function checkResource() {
  try {
    const { data, error } = await supabase.from("resources").select("*").eq("id", 5).single();

    if (error) {
      console.error("❌ Error:", error.message);
      return;
    }

    console.log("📊 Resource ID 5 데이터:");
    console.log("=".repeat(50));
    console.log("ID:", data.id);
    console.log("Title:", data.title);
    console.log("Category:", data.category);
    console.log("Content length:", data.content?.length || 0);
    console.log("\n전체 Content:");
    console.log(data.content);
    console.log("=".repeat(50));
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

checkResource();
