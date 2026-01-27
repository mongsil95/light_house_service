"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface BannerInquiry {
  id: number;
  organization: string;
  email: string;
  status: string;
  created_at: string;
}

export default function BannerInquiriesAdmin() {
  const [inquiries, setInquiries] = useState<BannerInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banner-inquiries");
      const json = await res.json();
      setInquiries(json.data || []);
    } catch (e) {
      console.error(e);
      alert("배너 리스트를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch("/api/admin/banner-inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error("상태 변경 실패");

      alert("상태가 변경되었습니다.");
      fetchInquiries();
    } catch (e) {
      console.error(e);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/banner-inquiries?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      fetchInquiries();
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard']">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">가이드 다운로드 신청 관리</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-gray-500">로딩 중...</div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center text-gray-500">등록된 다운로드 현황이 없습니다.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">
                    ID
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    기관명
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    이메일
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-32">
                    상태
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-40">
                    문의일
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-32">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry, index) => (
                  <tr
                    key={inquiry.id}
                    className={`transition-colors hover:bg-blue-50/50 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <td className="px-4 py-4 text-sm font-medium text-gray-500">#{inquiry.id}</td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900 font-semibold">
                        {inquiry.organization}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        {inquiry.email}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border ${
                          inquiry.status === "completed"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : inquiry.status === "contacted"
                              ? "bg-blue-100 text-blue-700 border-blue-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        <option value="pending">대기중</option>
                        <option value="contacted">연락완료</option>
                        <option value="completed">처리완료</option>
                      </select>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-gray-500">
                      {new Date(inquiry.created_at).toLocaleDateString("ko-KR", {
                        year: "2-digit",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        onClick={() => handleDelete(inquiry.id)}
                        variant="ghost"
                        size="sm"
                        className="font-['Pretendard'] text-xs h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        삭제
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
