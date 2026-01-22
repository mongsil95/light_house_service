"use client";

import Navigation from "@/components/Navigation";
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
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  Home,
  Lightbulb,
  Lock,
  Send,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const categoryGroups = [
  {
    group: "입양 관련",
    items: [
      { value: "입양절차", label: "입양 절차" },
      { value: "신청방법", label: "신청 방법" },
      { value: "참여조건", label: "참여 조건" },
      { value: "입양기타", label: "기타" },
    ],
  },
  {
    group: "활동 운영",
    items: [
      { value: "활동매뉴얼", label: "활동 매뉴얼" },
      { value: "정화활동", label: "정화 활동" },
      { value: "캠페인", label: "캠페인" },
      { value: "사례공유", label: "사례 공유" },
      { value: "보고서", label: "보고서" },
      { value: "활동지원", label: "활동 지원" },
    ],
  },
  {
    group: "기부금",
    items: [{ value: "기금납부", label: "기금 납부" }],
  },
  {
    group: "기타",
    items: [{ value: "일반문의", label: "일반 문의" }],
  },
];

export default function AskQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    content: "",
    askedBy: "",
    email: "",
    phone: "",
    isPrivate: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name}은(는) 5MB를 초과해요. 더 작은 파일로 시도해주세요.`);
          return false;
        }
        return true;
      });

      if (files.length + validFiles.length > 5) {
        alert("파일은 최대 5개까지 첨부할 수 있어요.");
        return;
      }

      setFiles([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];

    const uploadedUrls: string[] = [];
    setUploadingFiles(true);

    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `qna-attachments/${fileName}`;

        const { data, error } = await supabase.storage.from("public-files").upload(filePath, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("public-files").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error("파일 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.category ||
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.askedBy.trim() ||
      !formData.email.trim()
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    if (!agreePrivacy) {
      alert("개인정보 수집 및 이용에 동의가 필요해요.");
      return;
    }

    try {
      setSubmitting(true);

      const attachmentUrls = await uploadFiles();

      const response = await fetch("/api/admin/qna", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          author_name: formData.askedBy,
          author_email: formData.email,
          author_phone: formData.phone || null,
          status: "pending",
          is_public: !formData.isPrivate,
          attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "질문 등록에 실패했습니다.");
      }

      alert("질문이 등록되었어요!\n답변은 이메일로 보내드릴게요.");
      router.push("/lighthouse-QnA");
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("앗, 질문 등록에 문제가 생겼어요. 다시 한번 시도해주시겠어요?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-white">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/lighthouse-QnA" className="hover:text-blue-600 transition-colors">
              전문가 Q&A
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">질문하기</span>
          </nav>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">질문하기</h1>
            <p className="text-lg text-gray-600">
              반려해변 전문가가 여러분의 궁금증을 해결해드립니다
            </p>
            <p className="text-sm text-gray-500 mt-2">
              💌 답변은 영업일 기준 6시간 이내에 이메일로 받으실 수 있습니다
            </p>
          </div>

          {/* Tips Card */}
          <Card className="mb-8 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5" />
                좋은 질문 작성 팁
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-900">
                    비슷한 질문이 있는지 먼저 검색해주세요
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-900">
                    구체적이고 명확하게 질문을 작성해주세요
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-900">상황을 자세히 설명해주세요</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-900">관련 자료가 있다면 첨부해주세요</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="border border-gray-200 shadow-md">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Category */}
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-base font-semibold text-gray-900"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    카테고리 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger
                      className="w-full h-12"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      <SelectValue placeholder="질문 주제를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-white max-h-[30vh] overflow-y-auto"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      {categoryGroups.map((group) => (
                        <div key={group.group}>
                          <div
                            className="px-2 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50"
                            style={{
                              fontFamily:
                                "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                            }}
                          >
                            {group.group}
                          </div>
                          {group.items.map((item) => (
                            <SelectItem
                              key={item.value}
                              value={item.value}
                              className="pl-6"
                              style={{
                                fontFamily:
                                  "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                              }}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-base font-semibold text-gray-900"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    제목 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="질문을 한 줄로 요약해주세요"
                    required
                    maxLength={100}
                    className="h-12 text-base"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  />
                  <p
                    className="text-sm text-gray-500"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    {formData.title.length}/100자
                  </p>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label
                    htmlFor="content"
                    className="text-base font-semibold text-gray-900"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    질문 내용 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="질문 내용을 자세히 작성해주세요. 구체적일수록 정확한 답변을 받을 수 있습니다."
                    required
                    maxLength={1000}
                    rows={8}
                    className="text-base resize-none"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  />
                  <p
                    className="text-sm text-gray-500"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    {formData.content.length}/1000자
                  </p>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Contact Information */}
                <div className="space-y-6">
                  <h3
                    className="text-lg font-bold text-gray-900"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    연락처 정보
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="askedBy"
                        className="text-base font-semibold text-gray-900"
                        style={{
                          fontFamily:
                            "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                        }}
                      >
                        작성자명 <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="askedBy"
                        type="text"
                        value={formData.askedBy}
                        onChange={(e) => setFormData({ ...formData, askedBy: e.target.value })}
                        placeholder="이름 또는 단체명"
                        required
                        className="h-12 text-base"
                        style={{
                          fontFamily:
                            "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                        }}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-base font-semibold text-gray-700"
                        style={{
                          fontFamily:
                            "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                        }}
                      >
                        연락처 <span className="text-gray-400 text-sm font-normal">(선택)</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="010-0000-0000"
                        className="h-12 text-base"
                        style={{
                          fontFamily:
                            "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-base font-semibold text-gray-900"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      이메일 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="답변을 받을 이메일 주소"
                      required
                      className="h-12 text-base"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    />
                    <p
                      className="text-sm text-blue-600 flex items-center gap-1"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      <Send className="w-3 h-3" />
                      답변이 등록되면 이메일로 알려드립니다
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                {/* Privacy Toggle */}
                <div className="space-y-3">
                  <Label
                    className="text-base font-semibold text-gray-900"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    공개 설정
                  </Label>
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          formData.isPrivate ? "bg-orange-100" : "bg-green-100"
                        }`}
                      >
                        {formData.isPrivate ? (
                          <Lock className="w-6 h-6 text-orange-600" />
                        ) : (
                          <Globe className="w-6 h-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-semibold transition-colors duration-300 ${
                            formData.isPrivate ? "text-orange-700" : "text-green-700"
                          }`}
                          style={{
                            fontFamily:
                              "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                          }}
                        >
                          {formData.isPrivate ? "비공개 질문" : "공개 질문"}
                        </p>
                        <p
                          className="text-sm text-gray-600"
                          style={{
                            fontFamily:
                              "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                          }}
                        >
                          {formData.isPrivate ? "본인만 확인 가능" : "다른 사용자도 확인 가능"}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                        formData.isPrivate ? "bg-orange-400" : "bg-green-500"
                      }`}
                      onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                    >
                      <div
                        className={`absolute top-1 transition-all duration-300 w-6 h-6 rounded-full bg-white shadow-md ${
                          formData.isPrivate ? "left-1" : "left-9"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-3">
                  <Label
                    className="text-base font-semibold text-gray-900"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    파일 첨부{" "}
                    <span className="text-gray-500 text-sm font-normal">(선택, 최대 5개)</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                    <label
                      htmlFor="file"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-semibold"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      파일 선택하기
                    </label>
                    <input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <p
                      className="text-sm text-gray-500 mt-2"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      이미지, PDF, 문서 (각 파일 최대 5MB)
                    </p>
                  </div>
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span
                              className="text-sm text-gray-700 truncate font-medium"
                              style={{
                                fontFamily:
                                  "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                              }}
                            >
                              {file.name}
                            </span>
                            <span
                              className="text-xs text-gray-500 flex-shrink-0"
                              style={{
                                fontFamily:
                                  "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                              }}
                            >
                              ({(file.size / 1024 / 1024).toFixed(2)}MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="flex-shrink-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-gray-200" />

                {/* Privacy Notice */}
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <h4
                    className="font-semibold text-gray-900 mb-3"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    개인정보 수집 및 이용 안내
                  </h4>
                  <div
                    className="space-y-1.5 text-sm text-gray-600 mb-4"
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    <p>
                      • <strong>수집 항목:</strong> 이름, 이메일, 연락처, 질문 내용
                    </p>
                    <p>
                      • <strong>수집 목적:</strong> 질문 답변 및 알림 발송
                    </p>
                    <p>
                      • <strong>보유 기간:</strong> 질문 등록 후 3년
                    </p>
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="mt-1 w-4 h-4 cursor-pointer"
                    />
                    <span
                      className="text-sm text-gray-700 group-hover:text-gray-900"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                    </span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Link href="/lighthouse-QnA" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-12 text-base font-semibold"
                      disabled={submitting || uploadingFiles}
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={submitting || uploadingFiles}
                    style={{
                      fontFamily:
                        "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                    }}
                  >
                    {uploadingFiles ? (
                      <>파일 업로드 중...</>
                    ) : submitting ? (
                      <>등록 중...</>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        질문 등록
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Link */}
          <div className="mt-10 text-center bg-white rounded-lg p-8 border border-gray-200">
            <p
              className="text-gray-700 mb-4 font-medium"
              style={{
                fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
            >
              자주 묻는 질문을 먼저 확인해보세요
            </p>
            <Link href="/lighthouse-QnA">
              <Button
                variant="outline"
                className="h-11 px-6 font-semibold"
                style={{
                  fontFamily:
                    "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                }}
              >
                전문가 Q&A 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
