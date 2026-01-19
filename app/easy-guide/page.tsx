"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function EasyGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            반려해변 입양서류 쉽게 작성하기!
          </h1>
          <p className="text-lg text-gray-600">
            5종의 입양 서류를 간편하게 작성하고 해변 입양 신청을 완료하세요
          </p>
        </div>

        {/* 3가지 옵션 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 채팅형 작성 */}
          <Link href="/easy-guide/chat" className="block">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-blue-500">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  등대지기와 함께
                  <br />
                  입양서류 작성하기
                </h3>
                <p className="text-sm text-gray-600">등대지기와 대화하며 서류를 작성합니다.</p>
                <div className="pt-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">시작하기</Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* 폼 형식 작성 */}
          <Link href="/easy-guide/form" className="block">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-green-500">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  폼으로
                  <br />
                  한번에 작성하기
                </h3>
                <p className="text-sm text-gray-600">
                  전체 문항을 한눈에 보면서 원하는 항목부터 작성합니다.
                </p>
                <div className="pt-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">시작하기</Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* 양식 다운로드 */}
          <Link href="/easy-guide/download" className="block">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer h-full border-2 hover:border-purple-500">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  입양서류
                  <br />
                  다운로드
                </h3>
                <p className="text-sm text-gray-600">
                  빈 양식을 다운로드하여 담당자님께서 직접 작성합니다.
                </p>
                <div className="pt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">다운로드</Button>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* 안내 문구 */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h4 className="font-bold text-gray-900 mb-3 text-center">
            💡 어떤 방법을 선택해야 할까요?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-blue-600 mb-1">채팅형 작성</p>
              <p>처음 작성하거나 도움이 필요한 경우 추천합니다.</p>
            </div>
            <div>
              <p className="font-semibold text-green-600 mb-1">폼 작성</p>
              <p>빠르게 작성하고 싶거나 항목을 한눈에 보고 싶은 경우 추천합니다.</p>
            </div>
            <div>
              <p className="font-semibold text-purple-600 mb-1">양식 다운로드</p>
              <p>오프라인에서 작성하거나 인쇄가 필요한 경우 추천합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
