"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit, Trash2, Search, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Resource {
  id: number;
  title: string;
  category: string;
  board: "반려해변" | "해봄";
  date: string;
  views: number;
  author: string;
}

export default function ResourcesManagement() {
  const [selectedBoard, setSelectedBoard] = useState<"전체" | "반려해변" | "해봄">("전체");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);

  // Mock data - 실제로는 DB에서 가져올 데이터
  const [resources, setResources] = useState<Resource[]>([
    {
      id: 1,
      title: "2024 해양쓰레기 수거 가이드라인",
      category: "가이드",
      board: "반려해변",
      date: "2024-01-10",
      views: 234,
      author: "관리자",
    },
    {
      id: 2,
      title: "반려해변 활동 사진 모음",
      category: "활동자료",
      board: "반려해변",
      date: "2024-01-08",
      views: 189,
      author: "관리자",
    },
    {
      id: 3,
      title: "해봄 프로그램 소개서",
      category: "홍보자료",
      board: "해봄",
      date: "2024-01-05",
      views: 156,
      author: "관리자",
    },
    {
      id: 4,
      title: "청소년 해양환경 교육 커리큘럼",
      category: "교육자료",
      board: "해봄",
      date: "2024-01-03",
      views: 312,
      author: "관리자",
    },
  ]);

  const filteredResources = resources.filter((resource) => {
    const matchesBoard = selectedBoard === "전체" || resource.board === selectedBoard;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBoard && matchesSearch;
  });

  const handleDelete = (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setResources(resources.filter((r) => r.id !== id));
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
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
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround]">
              자료 게시판 관리
            </h1>
          </div>
          <p className="text-gray-600 font-[Cafe24_Ssurround]">
            반려해변과 해봄의 자료 게시판을 관리합니다
          </p>
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
                  placeholder="제목 또는 카테고리로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[Cafe24_Ssurround]"
                />
              </div>

              {/* Board Filter */}
              <div className="flex gap-2">
                {["전체", "반려해변", "해봄"].map((board) => (
                  <button
                    key={board}
                    onClick={() => setSelectedBoard(board as "전체" | "반려해변" | "해봄")}
                    className={`px-4 py-2 rounded-lg font-[Cafe24_Ssurround] transition-colors ${
                      selectedBoard === board
                        ? "bg-blue-300 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {board}
                  </button>
                ))}
              </div>

              {/* Add Button */}
              <Button
                onClick={() => {
                  setEditingResource(null);
                  setShowAddModal(true);
                }}
                className="bg-blue-300 hover:bg-blue-400 font-[Cafe24_Ssurround]"
              >
                <Plus className="w-4 h-4 mr-2" />새 글 추가
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">전체 자료</p>
              <p className="text-2xl text-gray-900 font-[Cafe24_Ssurround]">
                {resources.length}개
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">반려해변</p>
              <p className="text-2xl text-blue-600 font-[Cafe24_Ssurround]">
                {resources.filter((r) => r.board === "반려해변").length}개
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">해봄</p>
              <p className="text-2xl text-green-600 font-[Cafe24_Ssurround]">
                {resources.filter((r) => r.board === "해봄").length}개
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Resources Table */}
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-[Cafe24_Ssurround] text-gray-700">
                      게시판
                    </th>
                    <th className="text-left py-3 px-4 font-[Cafe24_Ssurround] text-gray-700">
                      카테고리
                    </th>
                    <th className="text-left py-3 px-4 font-[Cafe24_Ssurround] text-gray-700">
                      제목
                    </th>
                    <th className="text-left py-3 px-4 font-[Cafe24_Ssurround] text-gray-700">
                      작성일
                    </th>
                    <th className="text-left py-3 px-4 font-[Cafe24_Ssurround] text-gray-700">
                      조회수
                    </th>
                    <th className="text-center py-3 px-4 font-[Cafe24_Ssurround] text-gray-700">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-12 text-gray-500 font-[Cafe24_Ssurround]"
                      >
                        자료가 없습니다
                      </td>
                    </tr>
                  ) : (
                    filteredResources.map((resource) => (
                      <tr key={resource.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-[Cafe24_Ssurround] ${
                              resource.board === "반려해변"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {resource.board}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-[Cafe24_Ssurround] text-sm text-gray-600">
                          {resource.category}
                        </td>
                        <td className="py-3 px-4 font-[Cafe24_Ssurround] text-gray-900">
                          {resource.title}
                        </td>
                        <td className="py-3 px-4 font-[Cafe24_Ssurround] text-sm text-gray-600">
                          {resource.date}
                        </td>
                        <td className="py-3 px-4 font-[Cafe24_Ssurround] text-sm text-gray-600">
                          {resource.views}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(resource)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="수정"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(resource.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="p-6">
                <h3 className="text-2xl mb-6 font-[Cafe24_Ssurround]">
                  {editingResource ? "자료 수정" : "새 자료 추가"}
                </h3>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-[Cafe24_Ssurround] text-gray-700 mb-2">
                      게시판 *
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-[Cafe24_Ssurround]"
                      defaultValue={editingResource?.board || ""}
                    >
                      <option value="">선택해주세요</option>
                      <option value="반려해변">반려해변</option>
                      <option value="해봄">해봄</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-[Cafe24_Ssurround] text-gray-700 mb-2">
                      카테고리 *
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-[Cafe24_Ssurround]"
                      defaultValue={editingResource?.category || ""}
                    >
                      <option value="">선택해주세요</option>
                      <option value="가이드">가이드</option>
                      <option value="활동자료">활동자료</option>
                      <option value="교육자료">교육자료</option>
                      <option value="홍보자료">홍보자료</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-[Cafe24_Ssurround] text-gray-700 mb-2">
                      제목 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-[Cafe24_Ssurround]"
                      placeholder="제목을 입력하세요"
                      defaultValue={editingResource?.title || ""}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-[Cafe24_Ssurround] text-gray-700 mb-2">
                      내용 *
                    </label>
                    <textarea
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-[Cafe24_Ssurround]"
                      placeholder="내용을 입력하세요"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-[Cafe24_Ssurround] text-gray-700 mb-2">
                      파일 첨부
                    </label>
                    <input
                      type="file"
                      multiple
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-[Cafe24_Ssurround]"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      variant="outline"
                      className="flex-1 font-[Cafe24_Ssurround]"
                    >
                      취소
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-300 hover:bg-blue-400 font-[Cafe24_Ssurround]"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("실제 구현 시 데이터베이스에 저장됩니다.\n현재는 데모 버전입니다.");
                        setShowAddModal(false);
                      }}
                    >
                      {editingResource ? "수정하기" : "추가하기"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
