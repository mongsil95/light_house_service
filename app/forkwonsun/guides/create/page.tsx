"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Save } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RichEditor = dynamic(() => import("@/components/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] border border-gray-300 rounded-md flex items-center justify-center">
      로딩 중...
    </div>
  ),
});

export default function CreateGuidePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    "입양안내",
    "입양절차",
    "신청방법",
    "자격요건",
    "활동가이드",
    "활동매뉴얼",
    "안전수칙",
    "사례공유",
    "보고서자료",
    "활동보고서",
    "통계자료",
    "연구자료",
    "공지",
    "중요공지",
    "일반공지",
  ];

  const handleSave = async (status: "draft" | "published") => {
    if (!category) {
      alert("구분을 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content?.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setSaving(true);

    try {
      // content의 첫 100자를 description으로 사용
      const description = content
        .slice(0, 100)
        .replace(/[#*\-\[\]]/g, "")
        .trim();

      const guideData = {
        category,
        title,
        description: description || title, // description이 비어있으면 title 사용
        content,
        status,
        author: "관리자",
      };

      const response = await fetch("/api/forkwonsun/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(guideData),
      });

      if (!response.ok) {
        throw new Error("Failed to save guide");
      }

      alert(status === "published" ? "가이드가 발행되었습니다." : "가이드가 임시저장되었습니다.");
      router.push("/forkwonsun/guides");
    } catch (error) {
      console.error("Save error:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/forkwonsun/guides"
              className="mb-4 inline-block text-sm text-gray-600 hover:text-gray-900"
            >
              ← 돌아가기
            </Link>
            <h1 className="text-3xl font-bold">가이드 작성</h1>
            <p className="mt-2 text-gray-600">
              마크다운 문법을 사용해서 자유롭게 가이드를 작성하세요
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              임시저장
            </Button>
            <Button onClick={() => handleSave("published")} disabled={saving}>
              <Eye className="mr-2 h-4 w-4" />
              발행하기
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">구분 *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">제목 *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 반려해변 입양 신청 방법"
                  />
                </div>
              </div>

              {/* Rich Text 에디터 */}
              <div className="space-y-2">
                <Label>내용 *</Label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  {mounted && <RichEditor content={content} onChange={setContent} />}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
