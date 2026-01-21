"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RichEditor = dynamic(() => import("@/components/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] border border-gray-300 rounded-md flex items-center justify-center">
      로딩 중...
    </div>
  ),
});

export default function CreateQnAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "입양관련",
    author_name: "전문가",
    author_email: "",
    author_phone: "",
    status: "answered",
    is_public: true,
  });

  const categories = [
    "입양절차",
    "신청방법",
    "참여조건",
    "입양기타",
    "활동매뉴얼",
    "정화활동",
    "캠페인",
    "사례공유",
    "보고서",
    "기금납부",
    "혜택",
    "일반문의",
    "공지사항",
  ];
  const statuses = [
    { value: "pending", label: "답변대기" },
    { value: "answered", label: "답변완료" },
    { value: "closed", label: "종료" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    console.log("Submitting Q&A with data:", formData);

    try {
      setLoading(true);

      const dataToInsert = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author_name: formData.author_name,
        author_email: formData.author_email || null,
        author_phone: formData.author_phone || null,
        status: formData.status,
        is_public: formData.is_public,
        views: 0,
      };

      console.log("Inserting data:", dataToInsert);

      const { data, error } = await supabase.from("qna").insert([dataToInsert]).select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Insert successful:", data);
      alert("Q&A가 성공적으로 등록되었습니다.");
      router.push("/forkwonsun/qna");
    } catch (error) {
      console.error("Error creating Q&A:", error);
      alert(
        `Q&A 등록 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/forkwonsun/qna">
            <Button variant="ghost" className="mb-4 gap-2 font-[Cafe24_Ssurround]">
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Button>
          </Link>
          <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround] mb-2">새 Q&A 작성</h1>
          <p className="text-gray-600 font-[Cafe24_Ssurround]">
            전문가 Q&A를 작성하여 사용자들에게 유용한 정보를 제공하세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-[Cafe24_Ssurround]">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="font-[Cafe24_Ssurround]">
                  질문 제목 *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 반려해변 입양 절차는 어떻게 되나요?"
                  className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="category" className="font-[Cafe24_Ssurround]">
                    카테고리 *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-2 font-[Cafe24_Ssurround]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat} className="font-[Cafe24_Ssurround]">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status" className="font-[Cafe24_Ssurround]">
                    상태 *
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="mt-2 font-[Cafe24_Ssurround]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem
                          key={status.value}
                          value={status.value}
                          className="font-[Cafe24_Ssurround]"
                        >
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="author_name" className="font-[Cafe24_Ssurround]">
                    작성자 이름 *
                  </Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="전문가"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author_email" className="font-[Cafe24_Ssurround]">
                    이메일
                  </Label>
                  <Input
                    id="author_email"
                    type="email"
                    value={formData.author_email}
                    onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                    placeholder="expert@example.com"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="author_phone" className="font-[Cafe24_Ssurround]">
                    연락처
                  </Label>
                  <Input
                    id="author_phone"
                    value={formData.author_phone}
                    onChange={(e) => setFormData({ ...formData, author_phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <div className="flex-1">
                  <Label
                    htmlFor="is_public"
                    className="font-[Cafe24_Ssurround] cursor-pointer text-lg font-semibold"
                  >
                    공개 여부
                  </Label>
                  <p className="text-sm text-gray-600 font-[Cafe24_Ssurround] mt-1">
                    공개 설정 시 사용자 페이지에 표시됩니다
                  </p>
                  <p className="text-sm font-bold font-[Cafe24_Ssurround] mt-2">
                    현재 상태:{" "}
                    <span className={formData.is_public ? "text-green-600" : "text-red-600"}>
                      {formData.is_public ? "✓ 공개" : "✗ 비공개"}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => {
                      console.log("Switch changed:", checked);
                      setFormData({ ...formData, is_public: checked });
                    }}
                    className="scale-150"
                  />
                  <span className="text-xs font-[Cafe24_Ssurround] font-semibold">
                    {formData.is_public ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-[Cafe24_Ssurround]">질문 및 답변 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <RichEditor
                content={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround] mt-4">
                * 배민 스타일의 템플릿을 활용하여 질문과 답변을 작성할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/forkwonsun/qna">
              <Button type="button" variant="outline" className="font-[Cafe24_Ssurround]">
                취소
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="font-[Cafe24_Ssurround]">
              {loading ? "등록 중..." : "Q&A 등록"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
