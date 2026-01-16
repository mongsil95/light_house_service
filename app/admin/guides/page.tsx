"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// TODO: DB팀 - 가이드 목록 조회 API 구현 필요
// GET /api/admin/guides

export default function AdminGuidesPage() {
  // 임시 가이드 목록 데이터
  const [guides, setGuides] = useState([
    {
      id: 1,
      category: "입양 신청하기",
      title: "반려해변 입양 신청서 작성",
      description: "해변 정보와 입양 동기를 작성하세요",
      views: 1234,
      status: "published",
      createdAt: "2026.01.15",
    },
    {
      id: 2,
      category: "입양 신청하기",
      title: "입양 가능한 해변 찾기",
      description: "전국 반려해변 지도에서 원하는 해변을 선택하세요",
      views: 987,
      status: "published",
      createdAt: "2026.01.14",
    },
    {
      id: 5,
      category: "서류 제출하기",
      title: "입양 계약서 다운로드 및 작성",
      description: "필수 서류 양식을 다운로드하고 작성하세요",
      views: 756,
      status: "draft",
      createdAt: "2026.01.13",
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "입양 신청하기", "서류 제출하기", "기금 납부하기"];

  const filteredGuides =
    selectedCategory === "전체"
      ? guides
      : guides.filter((guide) => guide.category === selectedCategory);

  const handleDelete = (id: number) => {
    if (confirm("정말 이 가이드를 삭제하시겠습니까?")) {
      // TODO: DB팀 - 가이드 삭제 API 구현 필요
      // DELETE /api/admin/guides/:id
      setGuides(guides.filter((guide) => guide.id !== id));
      alert("가이드가 삭제되었습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">가이드 관리</h1>
              <p className="text-gray-600">반려해변 입양 가이드를 작성하고 관리하세요</p>
            </div>
            <Link href="/admin/guides/create">
              <Button className="bg-blue-300 hover:bg-blue-400 text-white">
                <Plus className="w-4 h-4 mr-2" />새 가이드 작성
              </Button>
            </Link>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-300 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Guides List */}
        <div className="space-y-4">
          {filteredGuides.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">가이드가 없습니다.</p>
                <Link href="/admin/guides/create">
                  <Button className="mt-4 bg-blue-300 hover:bg-blue-400">첫 가이드 작성하기</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-600">
                          {guide.category}
                        </Badge>
                        <Badge variant={guide.status === "published" ? "default" : "secondary"}>
                          {guide.status === "published" ? "발행됨" : "임시저장"}
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                      <p className="text-gray-600 mb-4">{guide.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>조회 {guide.views.toLocaleString()}</span>
                        </div>
                        <span>작성일: {guide.createdAt}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Link href={`/adopt-a-beach/resources/${guide.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/guides/edit/${guide.id}`}>
                        <Button variant="outline" size="sm">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(guide.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Back to Admin */}
        <div className="mt-8">
          <Link href="/admin">
            <Button variant="outline">← 관리자 대시보드로 돌아가기</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
