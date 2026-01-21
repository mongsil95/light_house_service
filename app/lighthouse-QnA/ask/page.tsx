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
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  Home,
  Lock,
  Send,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// TODO: DB팀 - 질문 작성 API 구현 필요
// POST /api/questions

const categories = [
  { value: "입양관련", label: "입양관련" },
  { value: "입양절차", label: "입양절차" },
  { value: "신청방법", label: "신청방법" },
  { value: "참여조건", label: "참여조건" },
  { value: "입양기타", label: "입양기타" },
  { value: "활동운영", label: "활동운영" },
  { value: "활동매뉴얼", label: "활동매뉴얼" },
  { value: "정화활동", label: "정화활동" },
  { value: "캠페인", label: "캠페인" },
  { value: "사례공유", label: "사례공유" },
  { value: "보고서", label: "보고서" },
  { value: "기부금", label: "기부금" },
  { value: "기금납부", label: "기금납부" },
  { value: "혜택", label: "혜택" },
  { value: "기타", label: "기타" },
  { value: "일반문의", label: "일반문의" },
  { value: "공지사항", label: "공지사항" },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // 최대 5개 파일, 각 5MB 제한
      const validFiles = newFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name}은(는) 5MB를 초과합니다.`);
          return false;
        }
        return true;
      });

      if (files.length + validFiles.length > 5) {
        alert("최대 5개의 파일만 첨부할 수 있습니다.");
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
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      // 파일 업로드
      const attachmentUrls = await uploadFiles();

      // API 라우트를 통해 질문 등록 (이메일 알림 포함)
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

      alert("질문이 성공적으로 등록되었습니다!");
      router.push("/lighthouse-QnA");
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("질문 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-blue-600">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/adopt-a-beach/expertsqna" className="hover:text-blue-600">
              전문가 Q&A
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">질문하기</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <HelpCircle className="w-10 h-10 text-blue-600" />
              질문하기
            </h1>
            <p className="text-lg text-gray-600">
              반려해변 전문가에게 궁금한 점을 물어보세요. 영업일 기준 1-2일 내에 답변을 받으실 수
              있습니다.
            </p>
          </div>

          {/* Tips Card */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                좋은 질문 작성 팁
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>구체적이고 명확한 질문을 작성해주세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>상황 설명을 자세히 해주시면 더 정확한 답변을 받을 수 있습니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>관련 이미지나 자료가 있다면 첨부해주세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>비슷한 질문이 이미 있는지 검색해보세요</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="border border-gray-200">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div>
                  <Label
                    htmlFor="category"
                    className="text-base font-bold text-gray-900 mb-2 block"
                  >
                    카테고리 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-base font-bold text-gray-900 mb-2 block">
                    제목 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="질문 제목을 입력하세요"
                    required
                    className="text-base placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-2">{formData.title.length}/100자</p>
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content" className="text-base font-bold text-gray-900 mb-2 block">
                    질문 내용 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="질문 내용을 자세히 작성해주세요"
                    required
                    rows={10}
                    className="text-base placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-2">{formData.content.length}/1000자</p>
                </div>

                {/* Asked By */}
                <div>
                  <Label htmlFor="askedBy" className="text-base font-bold text-gray-900 mb-2 block">
                    작성자명 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="askedBy"
                    type="text"
                    value={formData.askedBy}
                    onChange={(e) => setFormData({ ...formData, askedBy: e.target.value })}
                    placeholder="이름 또는 단체명을 입력하세요"
                    required
                    className="text-base placeholder:text-gray-400"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-base font-bold text-gray-900 mb-2 block">
                    이메일 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="답변 알림을 받을 이메일을 입력하세요"
                    required
                    className="text-base placeholder:text-gray-400"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    답변이 등록되면 이메일로 알림을 보내드립니다
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="text-base font-bold text-gray-900 mb-2 block">
                    연락처 <span className="text-gray-500 text-sm font-normal">(선택)</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="text-base placeholder:text-gray-400"
                  />
                </div>

                {/* Privacy Toggle */}
                <div>
                  <Label className="text-base font-bold text-gray-900 mb-2 block">공개 설정</Label>
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                          formData.isPrivate
                            ? "bg-orange-100 ring-2 ring-orange-300"
                            : "bg-green-100 ring-2 ring-green-300"
                        }`}
                      >
                        {formData.isPrivate ? (
                          <Lock className="w-8 h-8 text-orange-600" />
                        ) : (
                          <Globe className="w-8 h-8 text-green-600" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-bold text-lg transition-colors duration-300 ${
                            formData.isPrivate ? "text-orange-700" : "text-green-700"
                          }`}
                        >
                          {formData.isPrivate ? "🔒 비공개 질문" : "🌐 공개 질문"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formData.isPrivate
                            ? "질문과 답변이 본인에게만 표시됩니다"
                            : "질문과 답변이 다른 사용자에게도 표시됩니다"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative">
                        <div
                          className={`w-20 h-10 rounded-full transition-all duration-300 cursor-pointer ${
                            formData.isPrivate ? "bg-orange-400" : "bg-green-500"
                          }`}
                          onClick={() =>
                            setFormData({ ...formData, isPrivate: !formData.isPrivate })
                          }
                        >
                          <div
                            className={`absolute top-1 transition-all duration-300 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center ${
                              formData.isPrivate ? "left-1" : "left-11"
                            }`}
                          >
                            <span className="text-xs font-bold">
                              {formData.isPrivate ? "OFF" : "ON"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-bold transition-colors duration-300 ${
                          !formData.isPrivate ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {!formData.isPrivate ? "공개" : "비공개"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <Label htmlFor="file" className="text-base font-bold text-gray-900 mb-2 block">
                    파일 첨부{" "}
                    <span className="text-gray-500 text-sm font-normal">(선택, 최대 5개)</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                    <label
                      htmlFor="file"
                      className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium"
                    >
                      파일 선택
                    </label>
                    <input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      이미지, PDF, 문서 파일 (각 파일 최대 10MB)
                    </p>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{file.name}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              ({(file.size / 1024 / 1024).toFixed(2)}MB)
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-gray-900 mb-3">개인정보 수집 및 이용 안내</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• 수집 항목: 이름, 이메일, 질문 내용</li>
                    <li>• 수집 목적: 질문 답변 및 알림 발송</li>
                    <li>• 보유 기간: 질문 등록 후 3년</li>
                  </ul>
                  <div className="flex items-start gap-2 mt-4">
                    <input type="checkbox" id="privacy" required className="mt-1" />
                    <label htmlFor="privacy" className="text-sm text-gray-700">
                      개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                  <Link href="/adopt-a-beach/expertsqna" className="flex-1">
                    <Button type="button" variant="outline" className="w-full" size="lg">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      취소
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-300 hover:bg-blue-400"
                    size="lg"
                    disabled={submitting || uploadingFiles}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {uploadingFiles ? "파일 업로드 중..." : submitting ? "등록 중..." : "질문 등록"}
                  </Button>
                </div>

                {/* Response Time Notice */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    💡 질문에 대한 답변은 영업일 기준 2~3일 소요될 수 있습니다
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* FAQ Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-3">자주 묻는 질문을 먼저 확인해보세요</p>
            <Link href="/adopt-a-beach/expertsqna">
              <Button variant="outline">전문가 Q&A 둘러보기</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
