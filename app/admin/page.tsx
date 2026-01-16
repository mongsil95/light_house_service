"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar, FileText, MessageSquare, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const adminSections = [
    {
      title: "가이드 관리",
      description: "반려해변 입양 가이드를 작성, 수정, 삭제할 수 있습니다.",
      icon: FileText,
      href: "/admin/guides",
      color: "bg-blue-50 text-blue-600",
      hoverColor: "hover:bg-blue-100",
    },
    {
      title: "자료 게시판 관리",
      description: "반려해변과 해봄의 자료 게시판 글을 추가, 수정, 삭제할 수 있습니다.",
      icon: FileText,
      href: "/admin/resources",
      color: "bg-cyan-50 text-cyan-600",
      hoverColor: "hover:bg-cyan-100",
    },
    {
      title: "일반문의 히스토리",
      description: "사용자들의 일반문의 대화 내역을 확인할 수 있습니다.",
      icon: MessageSquare,
      href: "/admin/inquiry-history",
      color: "bg-green-50 text-green-600",
      hoverColor: "hover:bg-green-100",
    },
    {
      title: "등대무전 신청 현황",
      description: "상담 신청 현황을 확인하고 관리할 수 있습니다.",
      icon: Calendar,
      href: "/admin/consultation-requests",
      color: "bg-purple-50 text-purple-600",
      hoverColor: "hover:bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround]">관리자 대시보드</h1>
          </div>
          <p className="text-gray-600 font-[Cafe24_Ssurround]">
            반려해변 서비스의 콘텐츠와 신청 현황을 관리하세요
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">전체 자료</p>
                  <p className="text-3xl text-gray-900 font-[Cafe24_Ssurround]">24</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">일반문의 대화</p>
                  <p className="text-3xl text-gray-900 font-[Cafe24_Ssurround]">156</p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">등대무전 신청</p>
                  <p className="text-3xl text-gray-900 font-[Cafe24_Ssurround]">42</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.title} href={section.href}>
                <Card
                  className={`h-full transition-all duration-300 hover:shadow-lg ${section.hoverColor} cursor-pointer`}
                >
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${section.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-xl text-gray-900 mb-2 font-[Cafe24_Ssurround]">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm font-[Cafe24_Ssurround] mb-4">
                      {section.description}
                    </p>
                    <Button variant="ghost" className="w-full font-[Cafe24_Ssurround]">
                      관리하기 →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Info Notice */}
        <Card className="mt-12 bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                !
              </div>
              <div>
                <h4 className="text-gray-900 mb-1 font-[Cafe24_Ssurround]">관리자 권한 안내</h4>
                <p className="text-sm text-gray-700 font-[Cafe24_Ssurround]">
                  현재는 개발 단계로 모든 사용자가 이 페이지에 접근할 수 있습니다. 추후 관리자 계정
                  인증 시스템을 도입하여 권한이 있는 사용자만 접근할 수 있도록 업데이트될
                  예정입니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
