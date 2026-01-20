// Supabase resources 테이블 스키마 확인 스크립트
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  "https://tyqnlllbnvkabdskobnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cW5sbGxibnZrYWJkc2tvYm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MDc3NTMsImV4cCI6MjA4NDM4Mzc1M30.vJ_stt4Bj4Eahi-d6iWPi_EVMWN8GQBMwgIdldbz9tw"
);

async function checkSchema() {
  try {
    // 샘플 데이터 하나 가져와서 스키마 확인
    const { data, error } = await supabase.from("resources").select("*").limit(1);

    if (error) {
      console.error("❌ Error:", error.message);
      return;
    }

    console.log("📊 Resources 테이블 스키마:");
    console.log("=".repeat(50));

    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      columns.forEach((col) => {
        const value = data[0][col];
        const type = typeof value;
        console.log(`  ${col}: ${type} ${value === null ? "(null)" : ""}`);
      });
    } else {
      console.log("⚠️  테이블이 비어있습니다. 컬럼 정보를 확인할 수 없습니다.");
    }

    console.log("=".repeat(50));
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

checkSchema();
