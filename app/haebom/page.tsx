import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function HaebomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl text-blue-900 mb-4 font-[Cafe24_Ssurround]">
              해봄
            </h1>
            <p className="text-lg text-gray-700 font-[Cafe24_Ssurround]">
              해양 환경 보호와 봉사활동 커뮤니티
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl text-blue-900 mb-2 font-[Cafe24_Ssurround]">
                  자료 게시판
                </h2>
                <p className="text-gray-600 mb-4 font-[Cafe24_Ssurround]">
                  해봄 활동 자료와 가이드
                </p>
                <a
                  href="/haebom/resources"
                  className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Cafe24_Ssurround]"
                >
                  바로가기
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl text-blue-900 mb-2 font-[Cafe24_Ssurround]">
                  자유 게시판
                </h2>
                <p className="text-gray-600 mb-4 font-[Cafe24_Ssurround]">
                  해봄 활동 후기와 자유로운 소통
                </p>
                <a
                  href="/haebom/community"
                  className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-[Cafe24_Ssurround]"
                >
                  바로가기
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
