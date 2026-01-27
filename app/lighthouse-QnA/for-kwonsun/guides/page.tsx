"use client";

import TipTapEditor from "@/components/TipTapEditor";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
    items: [{ value: "공지사항", label: "공지사항" }],
  },
];

interface Guide {
  id: number;
  category: string;
  title: string;
  subtitle?: string;
  content: string;
  author?: string;
  status?: string;
  thumbnail_url?: string | null;
  is_recommended?: boolean;
  created_at?: string;
}

export default function GuidesAdmin() {
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [formData, setFormData] = useState<Partial<Guide>>({
    category: "",
    title: "",
    subtitle: "",
    content: "",
    status: "draft",
    thumbnail_url: "",
  });

  const [hasDraft, setHasDraft] = useState(false);

  const [adminUsers, setAdminUsers] = useState<{ id: string; nickname: string }[]>([]);

  useEffect(() => {
    fetchGuides();
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch admin users");
      const json = await res.json();
      setAdminUsers(json.data || []);
    } catch (err) {
      console.error("fetchAdminUsers error:", err);
    }
  };

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/guides");
      const json = await res.json();
      setGuides(json.data || []);
    } catch (e) {
      console.error(e);
      alert("가이드를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guide: Guide) => {
    setEditingId(guide.id);
    // If stored author is a UUID (user id), try to resolve to nickname
    const isUUID = typeof guide.author === "string" && /^[0-9a-fA-F-]{36}$/.test(guide.author);
    if (isUUID) {
      // optimistic set id for now, then resolve
      setFormData({ ...guide, author: "" });
      (async () => {
        try {
          const res = await fetch(`/api/admin/users?id=${guide.author}`);
          if (!res.ok) throw new Error("Failed to fetch user");
          const json = await res.json();
          const nickname = json.data?.nickname;
          setFormData((prev) => ({ ...prev, author: nickname || "" }));
        } catch (err) {
          console.error("Failed to resolve author nickname:", err);
          setFormData((prev) => ({ ...prev, author: "" }));
        }
      })();
    } else {
      setFormData({ ...guide });
    }

    // 기존 파일 목록 로드
    (async () => {
      try {
        const { data: files, error } = await supabase
          .from("guides_files")
          .select("*")
          .eq("resource_id", guide.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setExistingFiles(files || []);
      } catch (err) {
        console.error("fetch existing files error:", err);
        setExistingFiles([]);
      }
    })();
    // check for existing local draft for this guide
    try {
      const key = `autosave:guide:${guide.id}`;
      const raw = localStorage.getItem(key);
      setHasDraft(!!raw);
    } catch (e) {
      /* ignore */
    }
  };

  const handleNew = () => {
    setEditingId("new");
    setFormData({
      category: "",
      title: "",
      subtitle: "",
      content: "",
      status: "draft",
      thumbnail_url: "",
      author: "",
    });
    setSelectedFiles([]);
    setExistingFiles([]);
    try {
      const raw = localStorage.getItem(`autosave:guide:new`);
      setHasDraft(!!raw);
    } catch (e) {}
  };

  // autosave interval: save formData to localStorage every 15s while editing
  useEffect(() => {
    if (!editingId) return;
    const key = `autosave:guide:${editingId}`;

    // immediate check
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
        console.error("autosave error:", e);
      }
    };

    // Save every 15s (do not overwrite existing draft immediately on mount)
    const id = setInterval(save, 15000);
    return () => clearInterval(id);
  }, [editingId, formData]);

  const handleManualSave = () => {
    if (!editingId) return;
    try {
      const key = `autosave:guide:${editingId}`;
      const payload = { formData, savedAt: Date.now() };
      localStorage.setItem(key, JSON.stringify(payload));
      setHasDraft(true);
      alert("임시저장이 완료되었습니다.");
    } catch (e) {
      console.error("manual save error:", e);
      alert("임시저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      category: "",
      title: "",
      subtitle: "",
      content: "",
      status: "draft",
      thumbnail_url: "",
      author: "",
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
      const url = editingId === "new" ? "/api/admin/guides" : `/api/admin/guides/${editingId}`;
      const method = editingId === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("저장 실패");

      const json = await res.json();
      const created = json.data;

      // 파일 업로드가 선택된 경우 별도 업로드 엔드포인트로 전송
      const uploadSelectedFiles = async (guideId: number | string) => {
        if (!selectedFiles || selectedFiles.length === 0) return;
        try {
          setUploading(true);
          const fd = new FormData();
          fd.append("guideId", String(guideId));
          selectedFiles.forEach((f) => fd.append("files", f));

          const up = await fetch("/api/admin/guides/upload", {
            method: "POST",
            body: fd,
          });

          if (!up.ok) {
            console.error("file upload failed", await up.text());
            alert("파일 업로드 중 일부 또는 전체가 실패했습니다.");
          } else {
            alert("저장 및 파일 업로드가 완료되었습니다.");
          }
        } catch (err) {
          console.error(err);
          alert("파일 업로드 중 오류가 발생했습니다.");
        } finally {
          setUploading(false);
        }
      };

      // 업로드 실행 (신규 생성이면 created.id 사용)
      const guideId = editingId === "new" ? created?.id : editingId;
      if (guideId) await uploadSelectedFiles(guideId);

      // reflect saved value from server
      fetchGuides();

      // clear local draft after successful save
      try {
        const key = `autosave:guide:${editingId === "new" ? "new" : guideId}`;
        localStorage.removeItem(String(key));
        setHasDraft(false);
      } catch (e) {}

      handleCancel();
      fetchGuides();
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleRestoreDraft = () => {
    if (!editingId) return;
    try {
      const key = `autosave:guide:${editingId}`;
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.formData) {
        setFormData((prev) => ({ ...(prev || {}), ...(parsed.formData || {}) }));
        alert("임시저장이 복원되었습니다.");
      }
    } catch (e) {
      console.error("restore draft error:", e);
      alert("임시저장 복원 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/guides/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      fetchGuides();
    } catch (e) {
      console.error(e);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard']">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">가이드 관리</h1>
          </div>
          <div className="flex items-center gap-2">
            {!editingId && (
              <Button onClick={handleNew} size="sm" className="font-['Pretendard']">
                새 가이드 추가
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {editingId ? (
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId === "new" ? "새 가이드 작성" : "가이드 수정"}
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
                <select
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categoryGroups.map((g) => (
                    <optgroup key={g.group} label={g.group}>
                      {g.items.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="가이드 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">소제목</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="간단한 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.author || ""}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                >
                  <option value="">작성자를 선택하세요</option>
                  {adminUsers.map((u) => (
                    <option key={u.id} value={u.nickname}>
                      {u.nickname}
                    </option>
                  ))}
                </select>
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
                    <div className="w-[300px] h-[169px] relative border border-gray-200 overflow-hidden">
                      <Image
                        src={formData.thumbnail_url}
                        alt="썸네일"
                        fill
                        className="object-cover"
                      />
                    </div>
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
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">파일 업로드</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        disabled={uploading}
                        className="w-full px-3 py-2 border border-gray-300 font-['Pretendard']"
                      />
                      {uploading && <p className="text-sm text-gray-500 mt-1">업로드 중...</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-200"></div>
                      <span className="text-xs text-gray-500">또는</span>
                      <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">URL 주소</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                        value={formData.thumbnail_url || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, thumbnail_url: e.target.value })
                        }
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  첨부파일 (최대 5개)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files ? Array.from(e.target.files) : [];
                    const maxFiles = 5;
                    if (files.length + existingFiles.length > maxFiles) {
                      alert(`최대 ${maxFiles}개까지 업로드할 수 있습니다.`);
                      return;
                    }
                    setSelectedFiles(files);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 font-['Pretendard']"
                />
                {selectedFiles.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2">
                    선택된 파일: {selectedFiles.map((f) => f.name).join(", ")}
                  </div>
                )}

                {existingFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-gray-500">기존 첨부파일</div>
                    {existingFiles.map((f) => (
                      <div key={f.id} className="flex items-center justify-between gap-2">
                        <div className="text-sm text-gray-700">{f.file_name}</div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/api/admin/guides/files/download?path=${encodeURIComponent(
                              f.file_path
                            )}`}
                            className="text-sm text-blue-600"
                          >
                            다운로드
                          </a>
                          <Button
                            onClick={async () => {
                              if (!confirm("선택한 파일을 삭제하시겠습니까?")) return;
                              try {
                                const res = await fetch(`/api/admin/guides/files/${f.id}`, {
                                  method: "DELETE",
                                });
                                if (!res.ok) throw new Error("삭제 실패");
                                setExistingFiles((prev) => prev.filter((p) => p.id !== f.id));
                                alert("파일이 삭제되었습니다.");
                              } catch (err) {
                                console.error(err);
                                alert("파일 삭제 중 오류가 발생했습니다.");
                              }
                            }}
                            variant="outline"
                            size="sm"
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    ))}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">추천 노출</label>
                <div className="flex items-center gap-2">
                  <input
                    id="is_recommended"
                    type="checkbox"
                    checked={!!formData.is_recommended}
                    onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })}
                  />
                  <label htmlFor="is_recommended" className="text-sm text-gray-600">
                    등대지기 추천 영역에 노출됩니다
                  </label>
                </div>
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
          <div className="bg-white border border-gray-200">
            {loading ? (
              <div className="p-8 text-center text-gray-500">로딩 중...</div>
            ) : guides.length === 0 ? (
              <div className="p-8 text-center text-gray-500">등록된 가이드가 없습니다.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      카테고리
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      제목
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      작성일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      작성자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      추천
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {guides.map((guide) => (
                    <tr key={guide.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{guide.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{guide.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{guide.title}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs ${
                            guide.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {guide.status === "published" ? "발행" : "임시저장"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {guide.created_at
                          ? new Date(guide.created_at).toLocaleDateString("ko-KR")
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{guide.author || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!guide.is_recommended}
                            onChange={async () => {
                              const newVal = !guide.is_recommended;
                              try {
                                const res = await fetch(`/api/admin/guides/${guide.id}`, {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ is_recommended: newVal }),
                                });
                                if (!res.ok) throw new Error("업데이트 실패");
                                setGuides((prev) =>
                                  prev.map((g) => (g.id === guide.id ? { ...g, is_recommended: newVal } : g))
                                );
                              } catch (err) {
                                console.error(err);
                                alert("추천 설정 변경 중 오류가 발생했습니다.");
                              }
                            }}
                          />
                          <span className="text-sm text-gray-600">노출</span>
                        </label>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <Button
                          onClick={() => handleEdit(guide)}
                          variant="ghost"
                          size="sm"
                          className="font-['Pretendard'] mr-2"
                        >
                          수정
                        </Button>
                        <Button
                          onClick={() => handleDelete(guide.id)}
                          variant="ghost"
                          size="sm"
                          className="font-['Pretendard'] text-red-600 hover:text-red-700"
                        >
                          삭제
                        </Button>
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
