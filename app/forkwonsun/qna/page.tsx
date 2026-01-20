"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import { Edit, Eye, MessageCircle, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QnA {
  id: number;
  title: string;
  content: string;
  category: string;
  author_name: string;
  author_email: string;
  status: string;
  views: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  answer_count?: number;
}

export default function AdminQnAPage() {
  const router = useRouter();
  const [qnaList, setQnaList] = useState<QnA[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQnA, setSelectedQnA] = useState<number | null>(null);

  const categories = ["전체", "입양관련", "활동운영", "지원기금", "기타"];
  const statuses = ["전체", "pending", "answered", "closed"];

  useEffect(() => {
    fetchQnA();
  }, []);

  const fetchQnA = async () => {
    try {
      setLoading(true);

      // Q&A 목록 조회
      let query = supabase.from("qna").select("*").order("created_at", { ascending: false });

      const { data: qnaData, error: qnaError } = await query;

      if (qnaError) throw qnaError;

      // 각 Q&A의 답변 개수 조회
      const qnaWithAnswers = await Promise.all(
        (qnaData || []).map(async (qna) => {
          const { count } = await supabase
            .from("qna_answers")
            .select("*", { count: "exact", head: true })
            .eq("qna_id", qna.id);

          return { ...qna, answer_count: count || 0 };
        })
      );

      setQnaList(qnaWithAnswers);
    } catch (error) {
      console.error("Error fetching Q&A:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedQnA) return;

    try {
      const { error } = await supabase.from("qna").delete().eq("id", selectedQnA);

      if (error) throw error;

      setQnaList(qnaList.filter((q) => q.id !== selectedQnA));
      setDeleteDialogOpen(false);
      setSelectedQnA(null);
    } catch (error) {
      console.error("Error deleting Q&A:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "답변대기", variant: "secondary" },
      answered: { label: "답변완료", variant: "default" },
      closed: { label: "종료", variant: "outline" },
    };

    const { label, variant } = statusMap[status] || { label: status, variant: "outline" };

    return <Badge variant={variant}>{label}</Badge>;
  };

  const filteredQnA = qnaList.filter((qna) => {
    const matchesSearch =
      qna.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qna.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || qna.category === selectedCategory;
    const matchesStatus = selectedStatus === "전체" || qna.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl text-gray-900 font-[Cafe24_Ssurround] mb-2">
                전문가 Q&A 관리
              </h1>
              <p className="text-gray-600 font-[Cafe24_Ssurround]">
                반려해변 전문가 Q&A를 작성하고 답변을 관리하세요
              </p>
            </div>
            <Link href="/forkwonsun/qna/create">
              <Button size="lg" className="gap-2 font-[Cafe24_Ssurround]">
                <Plus className="w-5 h-5" />새 Q&A 작성
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">전체 Q&A</div>
              <div className="text-3xl text-gray-900 font-[Cafe24_Ssurround]">{qnaList.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">답변대기</div>
              <div className="text-3xl text-orange-600 font-[Cafe24_Ssurround]">
                {qnaList.filter((q) => q.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">답변완료</div>
              <div className="text-3xl text-green-600 font-[Cafe24_Ssurround]">
                {qnaList.filter((q) => q.status === "answered").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 font-[Cafe24_Ssurround] mb-1">종료</div>
              <div className="text-3xl text-gray-600 font-[Cafe24_Ssurround]">
                {qnaList.filter((q) => q.status === "closed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Q&A 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 font-[Cafe24_Ssurround]"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="font-[Cafe24_Ssurround]">
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
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="font-[Cafe24_Ssurround]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status} className="font-[Cafe24_Ssurround]">
                      {status === "전체"
                        ? "전체"
                        : status === "pending"
                          ? "답변대기"
                          : status === "answered"
                            ? "답변완료"
                            : "종료"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Q&A Table */}
        <Card>
          <CardHeader>
            <CardTitle className="font-[Cafe24_Ssurround]">Q&A 목록</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-500 font-[Cafe24_Ssurround]">로딩 중...</div>
              </div>
            ) : filteredQnA.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 font-[Cafe24_Ssurround]">등록된 Q&A가 없습니다.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-[Cafe24_Ssurround]">ID</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround]">제목</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround]">카테고리</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround]">작성자</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround]">상태</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround] text-center">답변</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround] text-center">조회</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround]">등록일</TableHead>
                    <TableHead className="font-[Cafe24_Ssurround] text-center">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQnA.map((qna) => (
                    <TableRow key={qna.id}>
                      <TableCell className="font-[Cafe24_Ssurround]">{qna.id}</TableCell>
                      <TableCell className="font-[Cafe24_Ssurround] max-w-md truncate">
                        <Link
                          href={`/forkwonsun/qna/${qna.id}`}
                          className="hover:text-blue-600 hover:underline cursor-pointer"
                        >
                          {qna.title}
                        </Link>
                      </TableCell>
                      <TableCell className="font-[Cafe24_Ssurround]">
                        <Badge variant="outline">{qna.category || "미분류"}</Badge>
                      </TableCell>
                      <TableCell className="font-[Cafe24_Ssurround]">{qna.author_name}</TableCell>
                      <TableCell>{getStatusBadge(qna.status)}</TableCell>
                      <TableCell className="text-center font-[Cafe24_Ssurround]">
                        {qna.answer_count || 0}
                      </TableCell>
                      <TableCell className="text-center font-[Cafe24_Ssurround]">
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="w-4 h-4 text-gray-400" />
                          {qna.views}
                        </div>
                      </TableCell>
                      <TableCell className="font-[Cafe24_Ssurround]">
                        {new Date(qna.created_at).toLocaleDateString("ko-KR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/forkwonsun/qna/${qna.id}/edit`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedQnA(qna.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-[Cafe24_Ssurround]">Q&A 삭제</AlertDialogTitle>
              <AlertDialogDescription className="font-[Cafe24_Ssurround]">
                이 Q&A를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="font-[Cafe24_Ssurround]">취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 font-[Cafe24_Ssurround]"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
