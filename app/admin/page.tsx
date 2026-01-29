"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// 관리 컴포넌트 import
import BannerInquiriesAdmin from "./banner-inquiries/page";
import ContactsAdmin from "./contacts/page";
import GuidesAdmin from "./guides/page";
import QnAAdmin from "./qna/page";

const menuItems = [
  {
    id: "guides",
    label: "가이드 관리",
    href: "/admin",
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
    href: "/admin/qna",
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
    href: "/admin/banner-inquiries",
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
  {
    id: "contacts",
    label: "무전 예약",
    href: "/admin/contacts",
    component: "contacts",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
];

export default function AdminDashboard() {
  const pathname = usePathname();
  const [activeComponent, setActiveComponent] = useState("guides");

  const renderContent = () => {
    switch (activeComponent) {
      case "guides":
        return <GuidesAdmin />;
      case "qna":
        return <QnAAdmin />;
      case "inquiries":
        return <BannerInquiriesAdmin />;
      case "contacts":
        return <ContactsAdmin />;
      default:
        return <GuidesAdmin />;
    }
  };

  return (
    <div className="flex">
      {/* 사이드바 */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] fixed left-0 top-16">
        <div className="p-6">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeComponent === item.component;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveComponent(item.component)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
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

        <div className="absolute bottom-6 left-6 right-6">
          <Link href="/">
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
      <div className="ml-64 flex-1 p-8">{renderContent()}</div>
    </div>
  );
}
