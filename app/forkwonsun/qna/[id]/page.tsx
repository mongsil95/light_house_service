"use client";

import ToastEditor from "@/components/ToastEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Edit, Eye, MessageCircle, Plus, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface QnA {
  id: number;
  title: string;
  content: string;
  category: string;
  author_name: string;
  author_email: string;
  author_phone: string;
  status: string;
  views: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

interface Answer {
  id: number;
  qna_id: number;
  content: string;
  answerer_name: string;
  created_at: string;
  updated_at: string;
}

export default function ViewQnAPage() {
  const params = useParams();
  const qnaId = params.id as string;

  const [qna, setQna] = useState<QnA | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState({
    content: "",
    answerer_name: "전문가",
  });

  useEffect(() => {
    if (qnaId) {
      fetchQnA();
      fetchAnswers();
    }
  }, [qnaId]);

  const fetchQnA = async () => {
    try {
      setLoading(true);

      // Use admin API to bypass RLS
      const response = await fetch(`/api/admin/qna/${qnaId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch Q&A");
      }

      const result = await response.json();

      if (result.data) {
        setQna(result.data);
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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "답변대기", variant: "secondary" as const, color: "text-orange-600" },
      answered: { label: "답변완료", variant: "default" as const, color: "text-green-600" },
      closed: { label: "종료", variant: "outline" as const, color: "text-gray-600" },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;

    return (
      <Badge variant={statusInfo.variant} className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
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

  if (!qna) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center py-12">
            <div className="text-gray-500 font-[Cafe24_Ssurround]">Q&A를 찾을 수 없습니다.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/forkwonsun/qna">
              <Button variant="ghost" className="mb-4 gap-2 font-[Cafe24_Ssurround]">
                <ArrowLeft className="w-4 h-4" />
                목록으로
              </Button>
            </Link>
            <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround] mb-2">Q&A 상세보기</h1>
          </div>
          <Link href={`/forkwonsun/qna/${qnaId}/edit`}>
            <Button className="gap-2 font-[Cafe24_Ssurround]">
              <Edit className="w-4 h-4" />
              수정하기
            </Button>
          </Link>
        </div>

        {/* Question Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="outline" className="font-[Cafe24_Ssurround]">
                    {qna.category}
                  </Badge>
                  {getStatusBadge(qna.status)}
                  {qna.is_public && (
                    <Badge variant="outline" className="bg-blue-50 font-[Cafe24_Ssurround]">
                      공개
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl mb-4 font-[Cafe24_Ssurround]">{qna.title}</CardTitle>
                <div className="flex items-center gap-6 text-sm text-gray-600 font-[Cafe24_Ssurround]">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {qna.author_name}
                  </div>
                  {qna.author_email && (
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      {qna.author_email}
                    </div>
                  )}
                  {qna.author_phone && <div>{qna.author_phone}</div>}
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    조회 {qna.views}
                  </div>
                  <div>{new Date(qna.created_at).toLocaleDateString("ko-KR")}</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm sm:prose lg:prose-lg max-w-none prose-p:my-2 prose-p:leading-relaxed whitespace-pre-wrap break-words"
              style={{
                fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
              }}
              dangerouslySetInnerHTML={{ __html: qna.content }}
            />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Answers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-[Cafe24_Ssurround]">답변 ({answers.length})</CardTitle>
                <p className="text-sm text-gray-600 font-[Cafe24_Ssurround] mt-1">
                  이 질문에 대한 전문가 답변입니다
                </p>
              </div>
              {!showAnswerForm && (
                <Button
                  onClick={() => setShowAnswerForm(true)}
                  className="gap-2 font-[Cafe24_Ssurround]"
                >
                  <Plus className="w-4 h-4" />
                  답변 추가
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* New Answer Form */}
            {showAnswerForm && (
              <div className="border border-blue-200 rounded-lg p-6 bg-blue-50/30 mb-6">
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

            {/* Existing Answers */}
            {answers.length > 0 ? (
              <div className="space-y-4">
                {answers.map((answer, index) => (
                  <div
                    key={answer.id}
                    className={`p-6 rounded-lg border ${
                      index === 0
                        ? "border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                            index === 0 ? "bg-blue-100" : "bg-gray-200"
                          }`}
                        >
                          👤
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900 font-[Cafe24_Ssurround]">
                              {answer.answerer_name}
                            </span>
                            <Badge variant="secondary" className="text-xs font-[Cafe24_Ssurround]">
                              전문가
                            </Badge>
                          </div>
                          <span className="text-sm text-gray-500 font-[Cafe24_Ssurround]">
                            {new Date(answer.created_at).toLocaleDateString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </span>
                        </div>
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
                    <div
                      className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-700 prose-p:my-2 prose-p:leading-relaxed whitespace-pre-wrap break-words"
                      style={{
                        fontFamily:
                          "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      }}
                      dangerouslySetInnerHTML={{ __html: answer.content }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              !showAnswerForm && (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-[Cafe24_Ssurround]">
                    아직 등록된 답변이 없습니다.
                  </p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
