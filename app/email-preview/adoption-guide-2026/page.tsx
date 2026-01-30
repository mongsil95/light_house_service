import { AdoptionGuide2026Email } from "@/lib/email-templates/AdoptionGuide2026Email";

export default function AdoptionGuide2026Preview() {
  const sampleData = {
    organization: "서울 환경보호단",
    email: "sample@example.com",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            2026년 반려해변 사전 안내서 이메일 미리보기
          </h1>
          <p className="text-sm text-gray-600">
            이 페이지는 이메일 템플릿을 미리 확인하기 위한 페이지입니다.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <AdoptionGuide2026Email data={sampleData} />
        </div>
      </div>
    </div>
  );
}
