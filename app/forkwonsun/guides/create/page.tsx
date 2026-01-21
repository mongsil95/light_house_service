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
import { supabase } from "@/lib/supabase";
import { Eye, Save, Upload, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
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
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview("");
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnail) return null;

    try {
      setUploading(true);
      const fileExt = thumbnail.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, thumbnail);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("thumbnails").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Thumbnail upload error:", error);
      alert("썸네일 업로드 중 오류가 발생했습니다.");
      return null;
    } finally {
      setUploading(false);
    }
  };

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
      // 썸네일 업로드
      const thumbnailUrl = await uploadThumbnail();

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
        thumbnail_url: thumbnailUrl,
      };

      const response = await fetch("/api/admin/guides", {
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
            <Button
              variant="outline"
              onClick={() => handleSave("draft")}
              disabled={saving || uploading}
            >
              <Save className="mr-2 h-4 w-4" />
              {uploading ? "업로드 중..." : "임시저장"}
            </Button>
            <Button onClick={() => handleSave("published")} disabled={saving || uploading}>
              <Eye className="mr-2 h-4 w-4" />
              {uploading ? "업로드 중..." : "발행하기"}
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

              {/* 썸네일 업로드 */}
              <div className="space-y-2">
                <Label htmlFor="thumbnail">썸네일 이미지</Label>
                <div className="flex items-start gap-4">
                  {thumbnailPreview ? (
                    <div className="relative w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">이미지 업로드</span>
                      <input
                        type="file"
                        id="thumbnail"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    권장 크기: 800x450px (16:9 비율)
                    <br />
                    JPG, PNG 파일만 가능
                  </p>
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
