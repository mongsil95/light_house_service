"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Expert {
  id: number;
  name: string;
  organization: string | null;
  role: string;
  description: string | null;
  email: string | null;
  specialty: string[] | null;
  profile_image: string | null;
  is_active: boolean;
  display_order: number;
}

export default function EditExpertPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    role: "전문가",
    description: "",
    email: "",
    profile_image: "",
    is_active: true,
    display_order: 0,
  });
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);

  const categories = ["입양절차", "활동계획", "기금납부", "기타"];

  useEffect(() => {
    fetchExpert();
  }, [id]);

  const fetchExpert = async () => {
    try {
      const { data, error } = await supabase.from("experts").select("*").eq("id", id).single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name,
          organization: data.organization || "",
          role: data.role,
          description: data.description || "",
          email: data.email || "",
          profile_image: data.profile_image || "",
          is_active: data.is_active,
          display_order: data.display_order,
        });
        setSpecialties(data.specialty || []);
      }
    } catch (error) {
      console.error("Error fetching expert:", error);
      alert("전문가 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty]);
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("전문가 이름을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("experts")
        .update({
          name: formData.name,
          organization: formData.organization || null,
          role: formData.role,
          description: formData.description || null,
          email: formData.email || null,
          specialty: specialties.length > 0 ? specialties : null,
          profile_image: formData.profile_image || null,
          is_active: formData.is_active,
          display_order: formData.display_order,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      alert("전문가 정보가 성공적으로 수정되었습니다.");
      router.push("/forkwonsun/experts");
    } catch (error) {
      console.error("Error updating expert:", error);
      alert("전문가 정보 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center py-20">
            <div className="text-xl text-gray-600 font-[Cafe24_Ssurround]">로딩 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/forkwonsun/experts">
            <Button variant="ghost" className="mb-4 gap-2 font-[Cafe24_Ssurround]">
              <ArrowLeft className="w-4 h-4" />
              목록으로
            </Button>
          </Link>
          <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround] mb-2">전문가 정보 수정</h1>
          <p className="text-gray-600 font-[Cafe24_Ssurround]">전문가 정보를 수정하세요</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-[Cafe24_Ssurround]">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="font-[Cafe24_Ssurround]">
                    전문가 이름 *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="홍길동"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="organization" className="font-[Cafe24_Ssurround]">
                    소속 기관
                  </Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="해양환경공단"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="role" className="font-[Cafe24_Ssurround]">
                    직책/역할
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="전문가"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="font-[Cafe24_Ssurround]">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="expert@example.com"
                    className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-[Cafe24_Ssurround]">
                  소개
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="전문가에 대한 간단한 소개를 입력하세요"
                  rows={4}
                  className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                />
              </div>

              <div>
                <Label htmlFor="profile_image" className="font-[Cafe24_Ssurround]">
                  프로필 이미지 (이모지)
                </Label>
                <Input
                  id="profile_image"
                  value={formData.profile_image}
                  onChange={(e) => setFormData({ ...formData, profile_image: e.target.value })}
                  placeholder="👨‍🏫"
                  className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                  maxLength={2}
                />
                <p className="text-sm text-gray-500 mt-1">이모지를 입력하세요 (예: 👨‍🏫, 👩‍💼)</p>
              </div>
            </CardContent>
          </Card>

          {/* Specialty */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-[Cafe24_Ssurround]">전문 분야</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="font-[Cafe24_Ssurround]">카테고리 선택</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSpecialty(cat)}
                      className="font-[Cafe24_Ssurround]"
                      disabled={specialties.includes(cat)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="specialty_input" className="font-[Cafe24_Ssurround]">
                  직접 입력
                </Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="specialty_input"
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    placeholder="전문 분야를 입력하세요"
                    className="font-[Cafe24_Ssurround] placeholder:text-gray-400"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSpecialty(specialtyInput);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => addSpecialty(specialtyInput)}
                    className="font-[Cafe24_Ssurround]"
                  >
                    추가
                  </Button>
                </div>
              </div>

              {specialties.length > 0 && (
                <div>
                  <Label className="font-[Cafe24_Ssurround]">선택된 전문 분야</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specialties.map((spec, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold"
                      >
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialty(index)}
                          className="hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="font-[Cafe24_Ssurround]">설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="display_order" className="font-[Cafe24_Ssurround]">
                  표시 순서
                </Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                  className="mt-2 font-[Cafe24_Ssurround] placeholder:text-gray-400"
                />
                <p className="text-sm text-gray-500 mt-1">낮은 숫자가 먼저 표시됩니다</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="is_active" className="font-[Cafe24_Ssurround] cursor-pointer">
                    활성 상태
                  </Label>
                  <p className="text-sm text-gray-600 font-[Cafe24_Ssurround]">
                    활성화 시 전문가 목록에 표시됩니다
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/forkwonsun/experts">
              <Button type="button" variant="outline" className="font-[Cafe24_Ssurround]">
                취소
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="font-[Cafe24_Ssurround]">
              {saving ? "저장 중..." : "수정 저장"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
