"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// 가이드 관리 컴포넌트를 import
import BannerInquiriesAdmin from "./banner-inquiries/page";
import GuidesAdmin from "./guides/page";
import QnAAdmin from "./qna/page";

const menuItems = [
  {
    id: "guides",
    label: "가이드 관리",
    href: "/lighthouse-QnA/for-kwonsun",
    component: "guides",
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
    component: "qna",
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
    component: "inquiries",
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
  const [activeComponent, setActiveComponent] = useState("guides");

  const renderContent = () => {
    switch (activeComponent) {
      case "guides":
        return <GuidesAdmin />;
      case "qna":
        return <QnAAdmin />;
      case "inquiries":
        return <BannerInquiriesAdmin />;
      default:
        return <GuidesAdmin />;
    }
  };

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
                const isActive = activeComponent === item.component;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveComponent(item.component)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
            <Link href="/lighthouse-QnA">
              <Button variant="outline" className="w-full font-['Pretendard'] text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="ml-64 flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}
