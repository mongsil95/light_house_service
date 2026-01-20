"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, MessageSquare, Settings, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    guides: 0,
    resources: 0,
    inquiries: 0,
    consultations: 0,
    qna: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const supabase = createClient();

      // 가이드 수
      const { count: guidesCount } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true })
        .eq("category", "가이드");

      // 자료 게시판 수
      const { count: resourcesCount } = await supabase
        .from("resources")
        .select("*", { count: "exact", head: true });

      // 일반문의 수
      const { count: inquiriesCount } = await supabase
        .from("inquiries")
        .select("*", { count: "exact", head: true });

      // 등대무전 신청 수
      const { count: consultationsCount } = await supabase
        .from("adoption_applications")
        .select("*", { count: "exact", head: true });

      // Q&A 수
      const { count: qnaCount } = await supabase
        .from("qna")
        .select("*", { count: "exact", head: true });

      setCounts({
        guides: guidesCount || 0,
        resources: resourcesCount || 0,
        inquiries: inquiriesCount || 0,
        consultations: consultationsCount || 0,
        qna: qnaCount || 0,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const adminSections = [
    {
      title: "가이드 관리",
      description: "반려해변 입양 가이드를 작성, 수정, 삭제할 수 있습니다.",
      icon: FileText,
      href: "/forkwonsun/guides",
      color: "bg-blue-50 text-blue-600",
      hoverColor: "hover:bg-blue-100",
      count: counts.guides,
    },
    {
      title: "자료 게시판 관리",
      description: "반려해변과 해봄의 자료 게시판 글을 추가, 수정, 삭제할 수 있습니다.",
      icon: FileText,
      href: "/forkwonsun/resources",
      color: "bg-cyan-50 text-cyan-600",
      hoverColor: "hover:bg-cyan-100",
      count: counts.resources,
    },
    {
      title: "일반문의 히스토리",
      description: "사용자들의 일반문의 대화 내역을 확인할 수 있습니다.",
      icon: MessageSquare,
      href: "/forkwonsun/inquiry-history",
      color: "bg-green-50 text-green-600",
      hoverColor: "hover:bg-green-100",
      count: counts.inquiries,
    },
    {
      title: "등대무전 신청 현황",
      description: "상담 신청 현황을 확인하고 관리할 수 있습니다.",
      icon: Calendar,
      href: "/forkwonsun/consultation-requests",
      color: "bg-purple-50 text-purple-600",
      hoverColor: "hover:bg-purple-100",
      count: counts.consultations,
    },
    {
      title: "전문가 Q&A 관리",
      description: "반려해변 전문가 Q&A를 작성하고 답변을 관리할 수 있습니다.",
      icon: MessageSquare,
      href: "/forkwonsun/qna",
      color: "bg-orange-50 text-orange-600",
      hoverColor: "hover:bg-orange-100",
      count: counts.qna,
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
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${section.color}`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 font-[Cafe24_Ssurround]"
                        onClick={(e) => e.preventDefault()}
                      >
                        관리하기
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl text-gray-900 font-[Cafe24_Ssurround]">
                        {section.title}
                      </h3>
                      <Badge variant="secondary" className="font-[Cafe24_Ssurround]">
                        {section.count}건
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm font-[Cafe24_Ssurround]">
                      {section.description}
                    </p>
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
