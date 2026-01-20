"use client";

import ToastEditor from "@/components/ToastEditor";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Answer {
  id: number;
  content: string;
  answerer_name: string;
  created_at: string;
}

export default function EditQnAPage() {
  const router = useRouter();
  const params = useParams();
  const qnaId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "입양절차",
    author_name: "전문가",
    author_email: "",
    author_phone: "",
    status: "answered",
    is_public: true,
  });

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState({
    content: "",
    answerer_name: "전문가",
  });
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const categories = ["입양절차", "활동계획", "기금납부", "기타"];
  const statuses = [
    { value: "pending", label: "답변대기" },
    { value: "answered", label: "답변완료" },
    { value: "closed", label: "종료" },
  ];

  useEffect(() => {
    fetchQnA();
    fetchAnswers();
  }, [qnaId]);

  const fetchQnA = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("qna").select("*").eq("id", qnaId).single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category || "입양절차",
          author_name: data.author_name,
          author_email: data.author_email || "",
          author_phone: data.author_phone || "",
          status: data.status,
          is_public: data.is_public,
        });
      }
    } catch (error) {
      console.error("Error fetching Q&A:", error);
      alert("Q&A를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("qna_answers")
        .select("*")
        .eq("qna_id", qnaId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setAnswers(data || []);
    } catch (error) {
      console.error("Error fetching answers:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      console.log("Updating Q&A with data:", formData);
      console.log("QnA ID:", qnaId);

      const { data, error } = await supabase
        .from("qna")
        .update({
          title: formData.title,
          content: formData.content,
          category: formData.category,
          author_name: formData.author_name,
          author_email: formData.author_email || null,
          author_phone: formData.author_phone || null,
          status: formData.status,
          is_public: formData.is_public,
        })
        .eq("id", parseInt(qnaId))
        .select();

      console.log("Update result:", { data, error });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("업데이트된 데이터가 없습니다.");
      }

      alert("Q&A가 성공적으로 수정되었습니다.");
      router.push("/admin/qna");
    } catch (error) {
      console.error("Error updating Q&A:", error);
      alert(
        `Q&A 수정 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.content.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      const { error } = await supabase.from("qna_answers").insert([
        {
          qna_id: parseInt(qnaId),
          content: newAnswer.content,
          answerer_name: newAnswer.answerer_name,
        },
      ]);

      if (error) throw error;

      // 상태를 answered로 변경
      await supabase.from("qna").update({ status: "answered" }).eq("id", qnaId);

      setNewAnswer({ content: "", answerer_name: "전문가" });
      setShowAnswerForm(false);
      fetchAnswers();
      fetchQnA();
      alert("답변이 추가되었습니다.");
    } catch (error) {
      console.error("Error adding answer:", error);
      alert("답변 추가 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!confirm("이 답변을 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("qna_answers").delete().eq("id", answerId);

      if (error) throw error;

      fetchAnswers();
      alert("답변이 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting answer:", error);
      alert("답변 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="text-gray-500 font-[Cafe24_Ssurround]">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/qna">
            <Button variant="ghost" className="mb-4 gap-2 font-[Cafe24_Ssurround]">
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Button>
          </Link>
          <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround] mb-2">Q&A 수정</h1>
          <p className="text-gray-600 font-[Cafe24_Ssurround]">
            Q&A 정보를 수정하고 답변을 관리하세요
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
                    질문자 이름 *
                  </Label>
                  <Input
                    id="author_name"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="홍길동"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="author_email" className="font-[Cafe24_Ssurround]">
                    질문자 이메일
                  </Label>
                  <Input
                    id="author_email"
                    type="email"
                    value={formData.author_email}
                    onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                    placeholder="questioner@example.com"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="author_phone" className="font-[Cafe24_Ssurround]">
                    질문자 연락처
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

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="is_public" className="font-[Cafe24_Ssurround] cursor-pointer">
                    공개 여부
                  </Label>
                  <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                    공개 설정 시 사용자 페이지에 표시됩니다
                  </p>
                </div>
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-[Cafe24_Ssurround]">질문 내용</CardTitle>
            </CardHeader>
            <CardContent>
              <ToastEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                height="600px"
              />
              <p className="text-sm text-gray-600 font-[Cafe24_Ssurround] mt-4">
                * 마크다운 문법을 사용하여 질문과 답변을 작성할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 mb-6">
            <Link href="/admin/qna">
              <Button type="button" variant="outline" className="font-[Cafe24_Ssurround]">
                취소
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="font-[Cafe24_Ssurround]">
              {saving ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </form>

        <Separator className="my-8" />

        {/* Answer Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-[Cafe24_Ssurround]">답변 관리</CardTitle>
                <p className="text-sm text-gray-600 font-[Cafe24_Ssurround] mt-1">
                  이 질문에 대한 답변을 추가하고 관리하세요
                </p>
              </div>
              {!showAnswerForm && (
                <Button
                  onClick={() => setShowAnswerForm(true)}
                  className="gap-2 font-[Cafe24_Ssurround]"
                >
                  <Plus className="w-4 h-4" />새 답변 추가
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Existing Answers */}
            {answers.length > 0 && (
              <div className="space-y-4 mb-6">
                {answers.map((answer) => (
                  <div key={answer.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="font-semibold text-gray-900 font-[Cafe24_Ssurround]">
                          {answer.answerer_name}
                        </span>
                        <span className="text-sm text-gray-500 ml-2 font-[Cafe24_Ssurround]">
                          {new Date(answer.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAnswer(answer.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 font-[Cafe24_Ssurround]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="prose max-w-none text-gray-700 font-[Cafe24_Ssurround] whitespace-pre-wrap">
                      {answer.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New Answer Form */}
            {showAnswerForm && (
              <div className="border border-blue-200 rounded-lg p-6 bg-blue-50/30">
                <h3 className="font-semibold text-gray-900 mb-4 font-[Cafe24_Ssurround]">
                  새 답변 작성
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="answerer_name" className="font-[Cafe24_Ssurround]">
                      답변자 이름 *
                    </Label>
                    <Input
                      id="answerer_name"
                      value={newAnswer.answerer_name}
                      onChange={(e) =>
                        setNewAnswer({ ...newAnswer, answerer_name: e.target.value })
                      }
                      placeholder="전문가"
                      className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="answer_content" className="font-[Cafe24_Ssurround]">
                      답변 내용 *
                    </Label>
                    <div className="mt-2">
                      <ToastEditor
                        value={newAnswer.content}
                        onChange={(value) => setNewAnswer({ ...newAnswer, content: value })}
                        height="400px"
                      />
                    </div>
                    <p className="text-sm text-gray-600 font-[Cafe24_Ssurround] mt-2">
                      * 마크다운 문법을 사용하여 답변을 작성할 수 있습니다.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      onClick={handleAddAnswer}
                      className="font-[Cafe24_Ssurround]"
                    >
                      답변 추가
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowAnswerForm(false);
                        setNewAnswer({ content: "", answerer_name: "전문가" });
                      }}
                      className="font-[Cafe24_Ssurround]"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {answers.length === 0 && !showAnswerForm && (
              <div className="text-center py-8 text-gray-500 font-[Cafe24_Ssurround]">
                아직 등록된 답변이 없습니다. 새 답변을 추가해보세요.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
