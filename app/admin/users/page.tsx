"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface User {
  id: string;
  nickname: string;
  email?: string;
}

export default function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    nickname: "",
    email: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      setUsers(json.data || []);
    } catch (e) {
      console.error(e);
      alert("사용자를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setFormData({ ...user });
  };

  const handleNew = () => {
    setEditingId("new");
    setFormData({
      nickname: "",
      email: "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      nickname: "",
      email: "",
    });
  };

  const handleSave = async () => {
    if (!formData.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      const url = editingId === "new" ? "/api/admin/users" : `/api/admin/users/${editingId}`;
      const method = editingId === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("저장 실패");

      alert("저장되었습니다.");
      handleCancel();
      fetchUsers();
    } catch (e) {
      console.error(e);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("삭제 실패");

      alert("삭제되었습니다.");
      fetchUsers();
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
            <h1 className="text-xl font-semibold text-gray-900">등대지기 정보 관리</h1>
          </div>
          <div className="flex items-center gap-2">
            {!editingId && (
              <Button onClick={handleNew} size="sm" className="font-['Pretendard']">
                새 사용자 추가
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
                {editingId === "new" ? "새 사용자 추가" : "사용자 수정"}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.nickname || ""}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="닉네임을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 font-['Pretendard']"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="이메일을 입력하세요"
                  disabled={editingId !== "new"}
                />
                {editingId !== "new" && (
                  <p className="text-xs text-gray-500 mt-1">이메일은 수정할 수 없습니다.</p>
                )}
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
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">등록된 사용자가 없습니다.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      닉네임
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      이메일
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.nickname}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email || "-"}</td>
                      <td className="px-6 py-4 text-sm text-right">
                        <Button
                          onClick={() => handleEdit(user)}
                          variant="ghost"
                          size="sm"
                          className="font-['Pretendard'] mr-2"
                        >
                          수정
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
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
