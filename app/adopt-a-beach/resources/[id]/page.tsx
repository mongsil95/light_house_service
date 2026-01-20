"use client";

import CategorySidebar from "@/components/CategorySidebar";
import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Home,
  MessageCircle,
  Share2,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BaeminStyleViewer = dynamic(() => import("@/components/BaeminStyleViewer"), {
  ssr: false,
  loading: () => <div className="text-gray-500">로딩 중...</div>,
});

interface Attachment {
  id: number;
  file_name: string;
  file_size: string;
  file_url: string;
}

interface ResourceDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  views: number;
  likes: number;
  published_at: string;
  created_at: string;
  attachments: Attachment[];
}

export default function ResourceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [resource, setResource] = useState<ResourceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");
  const [mounted, setMounted] = useState(false);

  // 카테고리 구조
  const resourceCategories = [
    {
      label: "입양 안내",
      value: "입양안내",
      subItems: [
        { label: "전체", value: "입양안내" },
        { label: "입양 절차", value: "입양절차" },
        { label: "신청 방법", value: "신청방법" },
        { label: "자격 요건", value: "자격요건" },
      ],
    },
    {
      label: "활동 가이드",
      value: "활동가이드",
      subItems: [
        { label: "전체", value: "활동가이드" },
        { label: "활동 매뉴얼", value: "활동매뉴얼" },
        { label: "안전 수칙", value: "안전수칙" },
        { label: "사례 공유", value: "사례공유" },
      ],
    },
    {
      label: "보고서·자료",
      value: "보고서자료",
      subItems: [
        { label: "전체", value: "보고서자료" },
        { label: "활동 보고서", value: "활동보고서" },
        { label: "통계 자료", value: "통계자료" },
        { label: "연구 자료", value: "연구자료" },
      ],
    },
    {
      label: "공지사항",
      value: "공지",
      subItems: [
        { label: "전체", value: "공지" },
        { label: "중요 공지", value: "중요공지" },
        { label: "일반 공지", value: "일반공지" },
      ],
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/resources/${id}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch resource");
        const result = await response.json();
        setResource(result.data); // result.data로 접근
      } catch (error) {
        console.error("Error fetching resource:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(".", "");
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("링크가 복사되었습니다! 다른 사람들과 공유해보세요.");
      })
      .catch(() => {
        alert("링크 복사에 실패했습니다. 다시 시도해주세요.");
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">게시글을 찾을 수 없습니다</h1>
            <Link href="/adopt-a-beach/resources">
              <Button variant="outline">목록으로 돌아가기</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-blue-600">
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/adopt-a-beach/resources" className="hover:text-blue-600">
              자료 게시판
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{resource.category}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 왼쪽 사이드바 */}
            <div className="lg:col-span-1">
              <CategorySidebar
                categories={resourceCategories}
                selectedCategory={resource?.category || ""}
                basePath="/adopt-a-beach/resources"
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Back Button */}
              <Button variant="outline" className="mb-6" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                목록으로
              </Button>

              {/* Article Card */}
              <Card className="mb-6 border border-gray-200">
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 mb-4">
                      {resource.category}
                    </Badge>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{resource.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(resource.published_at || resource.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>{(resource.views || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {resource.attachments && resource.attachments.length > 0 && (
                    <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        첨부파일 ({resource.attachments.length})
                      </h3>
                      <div className="space-y-2">
                        {resource.attachments.map((file) => (
                          <a
                            key={file.id}
                            href={file.file_url}
                            download
                            className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded group-hover:bg-blue-200 transition-colors">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                  {file.file_name}
                                </p>
                                <p className="text-xs text-gray-500">{file.file_size}</p>
                              </div>
                            </div>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="mb-8">
                    {resource.content ? (
                      mounted && <BaeminStyleViewer content={resource.content} />
                    ) : (
                      <div className="text-gray-500 italic">내용이 없습니다.</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-2" />
                      공유하기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card className="border border-gray-200 hidden">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    댓글 0
                  </h3>

                  {/* Comment Form */}
                  <div className="mb-8">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="댓글을 입력하세요..."
                      rows={4}
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button
                        className="bg-blue-300 hover:bg-blue-400"
                        onClick={() => {
                          if (comment.trim()) {
                            alert("댓글이 등록되었습니다!");
                            setComment("");
                          }
                        }}
                      >
                        댓글 작성
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    <div className="text-center text-gray-500 py-8">
                      아직 댓글이 없습니다. 첫 댓글을 작성해보세요!
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - 추후 관련 게시글 등 추가 예정 */}
            <div className="space-y-6">{/* 예약된 공간 */}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
