"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EasyGuideDownloadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto py-12 px-4">
        {/* 뒤로가기 버튼 */}
        <Link href="/easy-guide">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            다른 방식 선택하기
          </Button>
        </Link>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">입양서류 다운로드</h2>
          <div className="space-y-6">
            <div className="text-center py-12">
              <Download className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <p className="text-lg mb-6">빈 양식을 다운로드하여 직접 작성하실 수 있습니다.</p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "/templates/반려해변_입양_가입서_양식.docx";
                    link.download = "반려해변_입양_가입서_양식.docx";
                    link.click();
                  }}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Word 양식 다운로드
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                다운로드한 양식을 작성하신 후 담당자에게 제출해주세요.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
