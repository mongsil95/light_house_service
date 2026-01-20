"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { Edit, Plus, Search, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Expert {
  id: number;
  name: string;
  organization: string;
  role: string;
  description: string;
  email: string;
  specialty: string[];
  profile_image: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export default function AdminExpertsPage() {
  const router = useRouter();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("experts")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error("Error fetching experts:", error);
      alert("전문가 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("이 전문가를 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase.from("experts").delete().eq("id", id);

      if (error) throw error;

      alert("전문가가 삭제되었습니다.");
      fetchExperts();
    } catch (error) {
      console.error("Error deleting expert:", error);
      alert("전문가 삭제 중 오류가 발생했습니다.");
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("experts")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      fetchExperts();
    } catch (error) {
      console.error("Error toggling active status:", error);
      alert("상태 변경 중 오류가 발생했습니다.");
    }
  };

  const filteredExperts = experts.filter(
    (expert) =>
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround] mb-2">전문가 관리</h1>
              <p className="text-gray-600 font-[Cafe24_Ssurround]">Q&A 전문가 정보를 관리하세요</p>
            </div>
            <Link href="/forkwonsun/experts/create">
              <Button size="lg" className="gap-2 font-[Cafe24_Ssurround]">
                <Plus className="w-5 h-5" />새 전문가 추가
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">전체 전문가</div>
              <div className="text-3xl text-gray-900 font-[Cafe24_Ssurround]">{experts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">활성 전문가</div>
              <div className="text-3xl text-green-600 font-[Cafe24_Ssurround]">
                {experts.filter((e) => e.is_active).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">
                비활성 전문가
              </div>
              <div className="text-3xl text-gray-400 font-[Cafe24_Ssurround]">
                {experts.filter((e) => !e.is_active).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="전문가 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-[Cafe24_Ssurround]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Experts List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-[Cafe24_Ssurround]">전문가 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500 font-[Cafe24_Ssurround]">로딩 중...</div>
              </div>
            ) : filteredExperts.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-[Cafe24_Ssurround]">등록된 전문가가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExperts.map((expert) => (
                  <Card
                    key={expert.id}
                    className={`border-2 ${expert.is_active ? "border-gray-200" : "border-gray-300 bg-gray-50"}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-3xl flex-shrink-0">
                          {expert.profile_image || "👤"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 font-[Cafe24_Ssurround]">
                              {expert.name}
                            </h3>
                            <Badge
                              variant={expert.is_active ? "default" : "secondary"}
                              className="font-[Cafe24_Ssurround]"
                            >
                              {expert.is_active ? "활성" : "비활성"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">
                            {expert.organization} · {expert.role}
                          </p>
                          {expert.email && (
                            <p className="text-sm text-gray-500 font-[Cafe24_Ssurround] mb-2">
                              {expert.email}
                            </p>
                          )}
                          <p className="text-sm text-gray-700 font-[Cafe24_Ssurround] line-clamp-2 mb-3">
                            {expert.description}
                          </p>
                          {expert.specialty && expert.specialty.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {expert.specialty.map((spec, idx) => (
                                <Badge
                                  key={idx}
                                  variant="outline"
                                  className="text-xs font-[Cafe24_Ssurround]"
                                >
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link href={`/forkwonsun/experts/${expert.id}/edit`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(expert.id, expert.is_active)}
                            className={expert.is_active ? "text-orange-600" : "text-green-600"}
                          >
                            {expert.is_active ? "비활성화" : "활성화"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(expert.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
