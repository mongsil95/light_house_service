"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Search,
  Phone,
  Mail,
  Clock,
  Building2,
  User,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface ConsultationRequest {
  id: number;
  organization: string;
  name: string;
  phone: string;
  email: string;
  content: string;
  method: "전화" | "구글밋";
  preferredDate: string;
  preferredTime: string;
  status: "대기중" | "확인됨" | "완료" | "취소";
  createdAt: string;
}

export default function ConsultationRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "전체" | "대기중" | "확인됨" | "완료" | "취소"
  >("전체");
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);

  // Mock data - 실제로는 DB에서 가져올 데이터
  const [requests, setRequests] = useState<ConsultationRequest[]>([
    {
      id: 1,
      organization: "푸른바다 환경재단",
      name: "김지수",
      phone: "010-1234-5678",
      email: "jisoo@bluesea.org",
      content: "반려해변 프로그램에 참여하고 싶습니다. 상세한 안내 부탁드립니다.",
      method: "전화",
      preferredDate: "2024-01-16",
      preferredTime: "14:00",
      status: "대기중",
      createdAt: "2024-01-12 10:30",
    },
    {
      id: 2,
      organization: "해양사랑 주식회사",
      name: "박민호",
      email: "minho@oceanlove.com",
      phone: "010-9876-5432",
      content: "기업 CSR 활동으로 반려해변 프로그램 도입을 검토 중입니다.",
      method: "구글밋",
      preferredDate: "2024-01-18",
      preferredTime: "15:00",
      status: "확인됨",
      createdAt: "2024-01-11 14:20",
    },
    {
      id: 3,
      organization: "그린피스 코리아",
      name: "이서연",
      phone: "010-5555-1234",
      email: "seoyeon@greenpeace.kr",
      content: "해봄 프로그램에 대해 자세히 알고 싶습니다.",
      method: "전화",
      preferredDate: "2024-01-11",
      preferredTime: "13:30",
      status: "완료",
      createdAt: "2024-01-08 09:15",
    },
    {
      id: 4,
      organization: "Clean Ocean NGO",
      name: "최준영",
      phone: "010-7777-8888",
      email: "junyoung@cleanocean.org",
      content: "해양쓰레기 수거 활동 협력 방안 논의하고 싶습니다.",
      method: "구글밋",
      preferredDate: "2024-01-15",
      preferredTime: "14:30",
      status: "취소",
      createdAt: "2024-01-10 16:45",
    },
  ]);

  const filteredRequests = requests.filter((request) => {
    const matchesStatus = selectedStatus === "전체" || request.status === selectedStatus;

    const matchesSearch =
      request.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.phone.includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  const updateStatus = (id: number, newStatus: "대기중" | "확인됨" | "완료" | "취소") => {
    setRequests(requests.map((req) => (req.id === id ? { ...req, status: newStatus } : req)));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "대기중":
        return "bg-yellow-100 text-yellow-700";
      case "확인됨":
        return "bg-blue-100 text-blue-700";
      case "완료":
        return "bg-green-100 text-green-700";
      case "취소":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "대기중":
        return <AlertCircle className="w-4 h-4" />;
      case "확인됨":
        return <CheckCircle className="w-4 h-4" />;
      case "완료":
        return <CheckCircle className="w-4 h-4" />;
      case "취소":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/forkwonsun"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-[Cafe24_Ssurround]"
          >
            <ArrowLeft className="w-4 h-4" />
            관리자 대시보드로 돌아가기
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround]">
              등대무전 신청 현황
            </h1>
          </div>
          <p className="text-gray-600 font-[Cafe24_Ssurround]">
            상담 신청 현황을 확인하고 관리합니다
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">전체 신청</p>
              <p className="text-2xl text-gray-900 font-[Cafe24_Ssurround]">
                {requests.length}건
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">대기중</p>
              <p className="text-2xl text-yellow-600 font-[Cafe24_Ssurround]">
                {requests.filter((r) => r.status === "대기중").length}건
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">확인됨</p>
              <p className="text-2xl text-blue-600 font-[Cafe24_Ssurround]">
                {requests.filter((r) => r.status === "확인됨").length}건
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">완료</p>
              <p className="text-2xl text-green-600 font-[Cafe24_Ssurround]">
                {requests.filter((r) => r.status === "완료").length}건
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
                  placeholder="기관명, 이름, 연락처로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-[Cafe24_Ssurround]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 overflow-x-auto">
                {["전체", "대기중", "확인됨", "완료", "취소"].map((status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setSelectedStatus(status as "전체" | "대기중" | "확인됨" | "완료" | "취소")
                    }
                    className={`px-4 py-2 rounded-lg font-[Cafe24_Ssurround] transition-colors whitespace-nowrap ${
                      selectedStatus === status
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-[Cafe24_Ssurround]">신청 내역이 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl text-gray-900 font-[Cafe24_Ssurround]">
                              {request.organization}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-[Cafe24_Ssurround] ${getStatusColor(
                                request.status
                              )}`}
                            >
                              {getStatusIcon(request.status)}
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 font-[Cafe24_Ssurround]">
                            신청일: {request.createdAt}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-[Cafe24_Ssurround] text-sm">{request.name}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="font-[Cafe24_Ssurround] text-sm">{request.phone}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="font-[Cafe24_Ssurround] text-sm">{request.email}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-[Cafe24_Ssurround] text-sm">
                            {request.preferredDate} {request.preferredTime} ({request.method})
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 font-[Cafe24_Ssurround]">
                          {request.content}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 flex lg:flex-col gap-2">
                      <Button
                        onClick={() => updateStatus(request.id, "확인됨")}
                        disabled={request.status !== "대기중"}
                        className="flex-1 bg-blue-300 hover:bg-blue-400 font-[Cafe24_Ssurround] disabled:bg-gray-300"
                      >
                        확인됨으로 변경
                      </Button>
                      <Button
                        onClick={() => updateStatus(request.id, "완료")}
                        disabled={request.status !== "확인됨" && request.status !== "대기중"}
                        className="flex-1 bg-green-600 hover:bg-green-700 font-[Cafe24_Ssurround] disabled:bg-gray-300"
                      >
                        완료 처리
                      </Button>
                      <Button
                        onClick={() => updateStatus(request.id, "취소")}
                        disabled={request.status === "완료"}
                        variant="outline"
                        className="flex-1 font-[Cafe24_Ssurround] disabled:bg-gray-100"
                      >
                        취소 처리
                      </Button>
                      <Button
                        onClick={() => setSelectedRequest(request)}
                        variant="outline"
                        className="flex-1 font-[Cafe24_Ssurround]"
                      >
                        상세보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-[Cafe24_Ssurround]">신청 상세 정보</h3>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                      기관/단체명
                    </label>
                    <p className="text-lg font-[Cafe24_Ssurround] text-gray-900">
                      {selectedRequest.organization}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                        신청자
                      </label>
                      <p className="font-[Cafe24_Ssurround] text-gray-900">
                        {selectedRequest.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                        연락처
                      </label>
                      <p className="font-[Cafe24_Ssurround] text-gray-900">
                        {selectedRequest.phone}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">이메일</label>
                    <p className="font-[Cafe24_Ssurround] text-gray-900">{selectedRequest.email}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                        희망 일시
                      </label>
                      <p className="font-[Cafe24_Ssurround] text-gray-900">
                        {selectedRequest.preferredDate} {selectedRequest.preferredTime}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                        상담 방법
                      </label>
                      <p className="font-[Cafe24_Ssurround] text-gray-900">
                        {selectedRequest.method}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                      문의 내용
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg mt-1">
                      <p className="font-[Cafe24_Ssurround] text-gray-900 whitespace-pre-wrap">
                        {selectedRequest.content}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">상태</label>
                    <p>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-[Cafe24_Ssurround] ${getStatusColor(
                          selectedRequest.status
                        )}`}
                      >
                        {getStatusIcon(selectedRequest.status)}
                        {selectedRequest.status}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                      신청일시
                    </label>
                    <p className="font-[Cafe24_Ssurround] text-gray-900">
                      {selectedRequest.createdAt}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => setSelectedRequest(null)}
                    className="w-full font-[Cafe24_Ssurround]"
                  >
                    닫기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
