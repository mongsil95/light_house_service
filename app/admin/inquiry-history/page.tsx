"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Search,
  Calendar,
  User,
  Bot,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface InquirySession {
  id: number;
  userId: string;
  startTime: string;
  endTime: string;
  messageCount: number;
  messages: Message[];
  resolved: boolean;
}

export default function InquiryHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"전체" | "해결" | "미해결">("전체");
  const [expandedSession, setExpandedSession] = useState<number | null>(null);

  // Mock data - 실제로는 DB에서 가져올 데이터
  const [sessions] = useState<InquirySession[]>([
    {
      id: 1,
      userId: "user_001",
      startTime: "2024-01-12 14:23",
      endTime: "2024-01-12 14:35",
      messageCount: 8,
      resolved: true,
      messages: [
        {
          role: "user",
          content: "반려해변이 뭔가요?",
          timestamp: "14:23",
        },
        {
          role: "assistant",
          content:
            "반려해변은 기업이나 단체가 특정 해변을 반려동물처럼 입양하여 지속적으로 관리하고 보호하는 프로그램입니다. 해변의 쓰레기 수거, 모니터링 등을 통해 깨끗한 해양환경을 만들어가고 있습니다.",
          timestamp: "14:23",
        },
        {
          role: "user",
          content: "어떻게 참여할 수 있나요?",
          timestamp: "14:25",
        },
        {
          role: "assistant",
          content:
            "기업이나 단체의 경우 등대무전 메뉴를 통해 상담 신청을 하시면 됩니다. 담당자가 연락드려 자세한 절차를 안내해드립니다.",
          timestamp: "14:25",
        },
      ],
    },
    {
      id: 2,
      userId: "user_002",
      startTime: "2024-01-12 10:15",
      endTime: "2024-01-12 10:18",
      messageCount: 4,
      resolved: true,
      messages: [
        {
          role: "user",
          content: "해봄 프로그램은 어떤 건가요?",
          timestamp: "10:15",
        },
        {
          role: "assistant",
          content:
            "해봄은 청소년 해양환경교육 프로그램입니다. 청소년들이 해양환경의 중요성을 배우고 직접 보호 활동에 참여할 수 있는 기회를 제공합니다.",
          timestamp: "10:15",
        },
      ],
    },
    {
      id: 3,
      userId: "user_003",
      startTime: "2024-01-11 16:45",
      endTime: "2024-01-11 16:52",
      messageCount: 12,
      resolved: false,
      messages: [
        {
          role: "user",
          content: "상담 신청 후 연락은 언제쯤 오나요?",
          timestamp: "16:45",
        },
        {
          role: "assistant",
          content:
            "상담 신청 후 보통 1-2일 이내에 담당자가 연락드립니다. 상담 가능 시간은 화요일과 목요일 13:00-16:00입니다.",
          timestamp: "16:45",
        },
        {
          role: "user",
          content: "급한 건인데 더 빨리 받을 수 있나요?",
          timestamp: "16:47",
        },
        {
          role: "assistant",
          content:
            "죄송하지만 현재 상담 일정이 정해져 있어 화요일과 목요일만 가능합니다. 자세한 문의는 070-8015-4120으로 연락주시면 도움을 드리겠습니다.",
          timestamp: "16:47",
        },
      ],
    },
  ]);

  const filteredSessions = sessions.filter((session) => {
    const matchesFilter =
      selectedFilter === "전체" ||
      (selectedFilter === "해결" && session.resolved) ||
      (selectedFilter === "미해결" && !session.resolved);

    const matchesSearch =
      session.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const toggleSession = (id: number) => {
    setExpandedSession(expandedSession === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-[Cafe24_Ssurround]"
          >
            <ArrowLeft className="w-4 h-4" />
            관리자 대시보드로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround]">
              일반문의 히스토리
            </h1>
          </div>
          <p className="text-gray-600 font-[Cafe24_Ssurround]">
            사용자들의 일반문의 대화 내역을 확인합니다
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">전체 대화</p>
              <p className="text-2xl text-gray-900 font-[Cafe24_Ssurround]">
                {sessions.length}건
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">해결 완료</p>
              <p className="text-2xl text-green-600 font-[Cafe24_Ssurround]">
                {sessions.filter((s) => s.resolved).length}건
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">미해결</p>
              <p className="text-2xl text-orange-600 font-[Cafe24_Ssurround]">
                {sessions.filter((s) => !s.resolved).length}건
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="사용자 ID 또는 대화 내용으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-[Cafe24_Ssurround]"
                />
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                {["전체", "해결", "미해결"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter as "전체" | "해결" | "미해결")}
                    className={`px-4 py-2 rounded-lg font-[Cafe24_Ssurround] transition-colors ${
                      selectedFilter === filter
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-[Cafe24_Ssurround]">대화 내역이 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            filteredSessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Session Header */}
                  <div
                    className="p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSession(session.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-600" />
                          <span className="font-[Cafe24_Ssurround] text-gray-900">
                            {session.userId}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="font-[Cafe24_Ssurround]">{session.startTime}</span>
                        </div>

                        <span className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                          메시지 {session.messageCount}개
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-[Cafe24_Ssurround] ${
                            session.resolved
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {session.resolved ? "해결 완료" : "미해결"}
                        </span>
                      </div>

                      {expandedSession === session.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </div>

                  {/* Messages */}
                  {expandedSession === session.id && (
                    <div className="p-6 bg-white space-y-4">
                      {session.messages.map((message, idx) => (
                        <div
                          key={idx}
                          className={`flex gap-3 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <Bot className="w-5 h-5 text-blue-600" />
                              </div>
                            </div>
                          )}

                          <div
                            className={`max-w-[70%] ${message.role === "user" ? "order-1" : ""}`}
                          >
                            <div
                              className={`p-3 rounded-lg ${
                                message.role === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="font-[Cafe24_Ssurround] text-sm">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-[Cafe24_Ssurround]">
                              {message.timestamp}
                            </p>
                          </div>

                          {message.role === "user" && (
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
