"use client";

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  List,
  Plus,
  Save,
  Trash2,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// TODO: DB팀 - 가이드 생성 API 구현 필요
// POST /api/admin/guides

type SectionType = "text" | "video" | "image-explanation" | "list" | "tips";

interface Section {
  id: string;
  title: string;
  type: SectionType;
  content: string;
  items?: any[];
}

export default function CreateGuidePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Form State
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [readTime, setReadTime] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const categories = ["입양 신청하기", "서류 제출하기", "기금 납부하기"];

  const sectionTypes: { value: SectionType; label: string; icon: any }[] = [
    { value: "text", label: "텍스트", icon: FileText },
    { value: "video", label: "영상", icon: Video },
    { value: "image-explanation", label: "이미지 설명", icon: ImageIcon },
    { value: "list", label: "목록", icon: List },
    { value: "tips", label: "팁", icon: Lightbulb },
  ];

  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "",
      type: "text",
      content: "",
      items: [],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const updateSection = (id: string, field: string, value: any) => {
    setSections(
      sections.map((section) => (section.id === id ? { ...section, [field]: value } : section))
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!category) {
      alert("구분을 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!description.trim()) {
      alert("설명을 입력해주세요.");
      return;
    }

    setSaving(true);

    // TODO: DB팀 - 가이드 저장 API 호출
    // const guideData = {
    //   category,
    //   title,
    //   description,
    //   readTime,
    //   videoUrl,
    //   sections: sections.filter(s => s.title && s.content), // 빈 섹션 제외
    //   tags,
    //   status
    // };
    // await fetch('/api/admin/guides', {
    //   method: 'POST',
    //   body: JSON.stringify(guideData)
    // });

    setTimeout(() => {
      setSaving(false);
      alert(status === "published" ? "가이드가 발행되었습니다." : "가이드가 임시저장되었습니다.");
      router.push("/admin/guides");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">새 가이드 작성</h1>
          <p className="text-gray-600">반려해변 입양 가이드를 작성하세요</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">기본 정보</h2>

              {/* Category - Required */}
              <div>
                <Label htmlFor="category">
                  구분 <span className="text-red-500">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="구분을 선택하세요" />
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

              {/* Title - Required */}
              <div>
                <Label htmlFor="title">
                  제목 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="가이드 제목을 입력하세요"
                />
              </div>

              {/* Description - Required */}
              <div>
                <Label htmlFor="description">
                  설명 <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="가이드에 대한 간단한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              {/* Read Time - Optional */}
              <div>
                <Label htmlFor="readTime">읽는 시간 (선택)</Label>
                <Input
                  id="readTime"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="예: 3분"
                />
              </div>

              {/* Video URL - Optional */}
              <div>
                <Label htmlFor="videoUrl">영상 URL (선택)</Label>
                <Input
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="YouTube 임베드 URL을 입력하세요"
                />
                {videoUrl && (
                  <p className="text-sm text-gray-500 mt-1">
                    입력한 영상은 가이드 상단에 표시됩니다
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">콘텐츠 섹션</h2>
                <Button onClick={addSection} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  섹션 추가
                </Button>
              </div>

              {sections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>콘텐츠 섹션을 추가해주세요</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <Card key={section.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-3">
                            {/* Section Title */}
                            <Input
                              value={section.title}
                              onChange={(e) => updateSection(section.id, "title", e.target.value)}
                              placeholder="섹션 제목"
                            />

                            {/* Section Type */}
                            <Select
                              value={section.type}
                              onValueChange={(value) => updateSection(section.id, "type", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sectionTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center gap-2">
                                      <type.icon className="w-4 h-4" />
                                      {type.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Section Content */}
                            <Textarea
                              value={section.content}
                              onChange={(e) => updateSection(section.id, "content", e.target.value)}
                              placeholder="섹션 내용을 입력하세요"
                              rows={4}
                            />

                            <p className="text-xs text-gray-500">
                              💡 섹션 타입에 따라 내용이 다르게 표시됩니다
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSection(section.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">태그</h2>
              <div className="flex gap-2 mb-3">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  placeholder="태그 입력 후 Enter"
                />
                <Button onClick={addTag} variant="outline">
                  추가
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-between">
            <Link href="/admin/guides">
              <Button variant="outline">취소</Button>
            </Link>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => handleSave("draft")} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                임시저장
              </Button>
              <Button
                onClick={() => handleSave("published")}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                발행하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
