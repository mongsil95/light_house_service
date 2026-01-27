"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  {
    id: "guides",
    label: "가이드 관리",
    href: "/lighthouse-QnA/for-kwonsun",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    id: "qna",
    label: "QnA 관리",
    href: "/lighthouse-QnA/for-kwonsun/qna",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    id: "inquiries",
    label: "신청 관리",
    href: "/lighthouse-QnA/for-kwonsun/banner-inquiries",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#fafafa] font-['Pretendard']">
      <div className="flex">
        {/* 사이드바 */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">등</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">등대지기 관리</h1>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
            <Link href="/lighthouse-QnA">
              <Button variant="outline" className="w-full font-['Pretendard'] text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                사이트 보기
              </Button>
            </Link>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="ml-64 flex-1">
          <div className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">가이드 관리</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">관리자 대시보드</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">가이드 관리</h3>
                <p className="text-sm text-gray-600 mb-6">
                  가이드 문서를 생성, 수정, 삭제할 수 있습니다.
                </p>
                <Button
                  onClick={() => router.push("/lighthouse-QnA/for-kwonsun/guides")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  가이드 페이지로 이동
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Link href="/lighthouse-QnA/for-kwonsun/qna">
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">QnA 관리</h3>
                      <p className="text-sm text-gray-500 mt-1">질문과 답변 관리</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/lighthouse-QnA/for-kwonsun/banner-inquiries">
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">신청 관리</h3>
                      <p className="text-sm text-gray-500 mt-1">다운로드 신청 내역</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
