"use client";

import TipTapEditor from "@/components/TipTapEditor";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QnA {
  id: number;
  category: string;
  title: string;
  content: string;
  author?: string;
  author_name?: string;
  author_phone?: string;
  author_email?: string;
  status?: string;
  thumbnail_url?: string | null;
  created_at?: string;
  view_count?: number;
}

interface Answer {
  id: number;
  qna_id: number;
  content: string;
  answerer_name: string;
  created_at: string;
}

export default function QnAAdmin() {
  const router = useRouter();
  const [qnas, setQnas] = useState<QnA[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [answererName, setAnswererName] = useState("");
  const [formData, setFormData] = useState<Partial<QnA>>({
    category: "",
    title: "",
    content: "",
    status: "draft",
    thumbnail_url: "",
  });
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    fetchQnas();
  }, []);

  const fetchQnas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/qna");
      const json = await res.json();
      setQnas(json.data || []);
    } catch (e) {
      console.error(e);
      alert("QnA를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (qna: QnA) => {
    setEditingId(qna.id);
    setFormData({ ...qna });
    try {
      const raw = localStorage.getItem(`autosave:qna:${qna.id}`);
      setHasDraft(!!raw);
    } catch (e) {}
  };

  const handleNew = () => {
    setEditingId("new");
    setFormData({
      category: "",
      title: "",
      content: "",
      status: "draft",
      thumbnail_url: "",
    });
    try {
      const raw = localStorage.getItem(`autosave:qna:new`);
      setHasDraft(!!raw);
    } catch (e) {}
  };

  // autosave formData to localStorage every 15s while editing
  useEffect(() => {
    if (!editingId) return;
    const key = `autosave:qna:${editingId}`;

    try {
      const raw = localStorage.getItem(key);
      setHasDraft(!!raw);
    } catch (e) {}

    const save = () => {
      try {
        const payload = { formData, savedAt: Date.now() };
        localStorage.setItem(key, JSON.stringify(payload));
        setHasDraft(true);
      } catch (e) {
        console.error("autosave qna error:", e);
      }
    };

    const id = setInterval(save, 15000);
    return () => clearInterval(id);
  }, [editingId, formData]);

  const handleManualSave = () => {
    if (!editingId) return;
    try {
      const key = `autosave:qna:${editingId}`;
      const payload = { formData, savedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));
      setHasDraft(true);
      alert("임시저장이 완료되었습니다.");
    } catch (e) {
      console.error("manual save qna error:", e);
      alert("임시저장 중 오류가 발생했습니다.");
    }
  };

  const handleRestoreDraft = () => {
    if (!editingId) return;
    try {
      const key = `autosave:qna:${editingId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.formData) {
        setFormData((prev) => ({ ...(prev || {}), ...(parsed.formData || {}) }));
        alert("임시저장이 복원되었습니다.");
      }
    } catch (e) {
      console.error("restore qna draft error:", e);
      alert("임시저장 복원 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      category: "",
      title: "",
      content: "",
      status: "draft",
      thumbnail_url: "",
    });
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("thumbnails").getPublicUrl(filePath);

      setFormData({ ...formData, thumbnail_url: data.publicUrl });
      alert("썸네일이 업로드되었습니다.");
    } catch (error) {
      console.error(error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleThumbnailDelete = async () => {
    if (!formData.thumbnail_url) return;
    if (!confirm("썸네일을 삭제하시겠습니까?")) return;

    try {
      const fileName = formData.thumbnail_url.split("/").pop();
      if (fileName) {
        await supabase.storage.from("thumbnails").remove([fileName]);
      }
      setFormData({ ...formData, thumbnail_url: "" });
      alert("썸네일이 삭제되었습니다.");
    } catch (error) {
      console.error(error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    try {
      const url = editingId === "new" ? "/api/admin/qna" : `/api/admin/qna/${editingId}`;
      const method = editingId === "new" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("저장 실패");

      alert("저장되었습니다.");
      // clear local draft after successful save
      try {
        const key = `autosave:qna:${editingId === "new" ? "new" : editingId}`;
        localStorage.removeItem(String(key));
        setHasDraft(false);
      } catch (e) {}

      handleCancel();
      fetchQnas();
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/qna/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      fetchQnas();
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleView = async (qna: QnA) => {
    setViewingId(qna.id);
    setEditingId(null);
    // 답변 가져오기
    try {
      const res = await fetch(`/api/admin/qna/${qna.id}/answers`);
      const json = await res.json();
      setAnswers(json.data || []);
    } catch (e) {
      console.error(e);
      alert("답변을 불러오는데 실패했습니다.");
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim() || !answererName.trim()) {
      alert("답변 내용과 답변자 이름을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/qna/${viewingId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newAnswer,
          answerer_name: answererName,
        }),
      });

      if (!res.ok) throw new Error("답변 저장 실패");

      alert("답변이 등록되었습니다.");
      setNewAnswer("");

      // 답변 목록 새로고침
      const answersRes = await fetch(`/api/admin/qna/${viewingId}/answers`);
      const answersJson = await answersRes.json();
      setAnswers(answersJson.data || []);
    } catch (e) {
      console.error(e);
      alert("답변 저장 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!confirm("답변을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/qna/${viewingId}/answers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer_id: answerId }),
      });

      if (!res.ok) throw new Error("답변 삭제 실패");

      alert("답변이 삭제되었습니다.");

      // 답변 목록 새로고침
      const answersRes = await fetch(`/api/admin/qna/${viewingId}/answers`);
      const answersJson = await answersRes.json();
      setAnswers(answersJson.data || []);
    } catch (e) {
      console.error(e);
      alert("답변 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleBackToList = () => {
    setViewingId(null);
    setEditingId(null);
    setAnswers([]);
    setNewAnswer("");
    setAnswererName("");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard']">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/lighthouse-QnA/for-kwonsun">
              <Button variant="ghost" size="sm" className="font-['Pretendard']">
                ← 대시보드
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">QnA 관리</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/lighthouse-QnA">
              <Button variant="outline" size="sm" className="font-['Pretendard']">
                사이트 보기
              </Button>
            </Link>
            {!editingId && !viewingId && (
              <Button onClick={handleNew} size="sm" className="font-['Pretendard']">
                새 QnA
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewingId ? (
          <div className="bg-white border border-gray-200 p-6">
            <div className="mb-6">
              <Button
                onClick={handleBackToList}
                variant="ghost"
                size="sm"
                className="font-['Pretendard']"
              >
                ← 목록으로
              </Button>
            </div>

            {/* 질문 내용 (읽기 전용) */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {qnas.find((q) => q.id === viewingId)?.title}
              </h2>
              <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
                <span>카테고리: {qnas.find((q) => q.id === viewingId)?.category}</span>
                <span>
                  작성일:{" "}
                  {qnas.find((q) => q.id === viewingId)?.created_at
                    ? new Date(
                        qnas.find((q) => q.id === viewingId)!.created_at!
                      ).toLocaleDateString("ko-KR")
                    : "-"}
                </span>
              </div>
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: qnas.find((q) => q.id === viewingId)?.content || "",
                }}
              />
            </div>

            {/* 기존 답변 목록 */}
            {answers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">등록된 답변</h3>
                <div className="space-y-4">
                  {answers.map((answer) => (
                    <div
                      key={answer.id}
                      className="p-4 border border-gray-200 rounded-lg bg-blue-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {answer.answerer_name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(answer.created_at).toLocaleDateString("ko-KR")}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleDeleteAnswer(answer.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          삭제
                        </Button>
                      </div>
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: answer.content }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 답변 작성 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">답변 작성</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">답변자 이름</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={answererName}
                  onChange={(e) => setAnswererName(e.target.value)}
                  placeholder="예: 홍길동"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">답변 내용</label>
                <TipTapEditor content={newAnswer} onChange={(html) => setNewAnswer(html)} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAnswer} className="font-['Pretendard']">
                  답변 등록
                </Button>
                <Button
                  onClick={handleBackToList}
                  variant="outline"
                  className="font-['Pretendard']"
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        ) : editingId ? (
          <div className="bg-white border border-gray-200 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId === "new" ? "새 QnA 작성" : "QnA 수정"}
              </h2>
              <div className="flex items-center gap-3">
                {hasDraft && (
                  <button
                    onClick={handleRestoreDraft}
                    className="text-sm text-blue-600 hover:underline"
                    type="button"
                  >
                    임시저장 복원
                  </button>
                )}
                <button
                  onClick={handleManualSave}
                  className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700"
                  type="button"
                >
                  임시저장
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="예: 해양환경"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="질문 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <TipTapEditor
                  content={formData.content || ""}
                  onChange={(html) => setFormData({ ...formData, content: html })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">썸네일</label>
                {formData.thumbnail_url ? (
                  <div className="space-y-2">
                    <Image
                      src={formData.thumbnail_url}
                      alt="썸네일"
                      width={300}
                      height={180}
                      className="object-cover border border-gray-200"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={handleThumbnailDelete}
                        variant="outline"
                        size="sm"
                        className="font-['Pretendard']"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      disabled={uploading}
                      className="w-full px-3 py-2 border border-gray-300 font-['Pretendard']"
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.status || "draft"}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">임시저장(서버저장)</option>
                  <option value="published">발행</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="font-['Pretendard']">
                  저장
                </Button>
                <Button onClick={handleCancel} variant="outline" className="font-['Pretendard']">
                  취소
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-gray-500">로딩 중...</div>
            ) : qnas.length === 0 ? (
              <div className="p-8 text-center text-gray-500">등록된 QnA가 없습니다.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-24">
                      상태
                    </th>
                    <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider w-28">
                      작성일
                    </th>
                    <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider w-32">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {qnas.map((qna, index) => (
                    <tr
                      key={qna.id}
                      className={`transition-colors hover:bg-blue-50/50 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-500">#{qna.id}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {qna.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleView(qna)}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors text-left group"
                        >
                          <span className="group-hover:underline">{qna.title}</span>
                          <svg
                            className="inline-block ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-700 font-medium">
                          {qna.author_name || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {qna.author_phone || "-"}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            {qna.author_email || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            qna.status === "published"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : qna.status === "answered"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {qna.status === "published"
                            ? "발행"
                            : qna.status === "answered"
                              ? "답변완료"
                              : "대기중"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-500">
                        {qna.created_at
                          ? new Date(qna.created_at).toLocaleDateString("ko-KR", {
                              year: "2-digit",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            onClick={() => handleEdit(qna)}
                            variant="ghost"
                            size="sm"
                            className="font-['Pretendard'] text-xs h-8 px-3 hover:bg-blue-50 hover:text-blue-600"
                          >
                            수정
                          </Button>
                          <Button
                            onClick={() => handleDelete(qna.id)}
                            variant="ghost"
                            size="sm"
                            className="font-['Pretendard'] text-xs h-8 px-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            삭제
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
