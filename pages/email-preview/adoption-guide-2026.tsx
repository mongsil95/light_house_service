import { AdoptionGuide2026Email } from "@/lib/email-templates/AdoptionGuide2026Email";

export default function AdoptionGuide2026Preview() {
  // 테스트용 더미 데이터
  const data = {
    organization: "테스트기관",
    email: "test@example.com",
  };

  return (
    <div style={{ background: "#eee", minHeight: "100vh", padding: 40 }}>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <AdoptionGuide2026Email data={data} />
      </div>
    </div>
  );
}
