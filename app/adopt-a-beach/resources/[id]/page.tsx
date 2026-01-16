"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, FileText, Home, ThumbsUp, Video } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// 가이드 데이터 (실제로는 API나 DB에서 가져와야 함)
const guideData: Record<string, any> = {
  "1": {
    category: "반려해변 입양",
    title: "반려해변 입양 신청서 작성",
    description: "해변 정보와 입양 동기를 작성하세요",
    readTime: "3분",
    views: 1234,
    likes: 45,
    lastUpdated: "2026.01.15",
    videoUrl: "https://www.youtube.com/embed/example",
    sections: [
      {
        title: "영상 가이드",
        type: "video",
        content: "",
      },
      {
        title: "반려해변 입양 신청서란?",
        type: "text",
        content:
          "반려해변 입양 신청서는 여러분이 선택한 해변을 정기적으로 관리하고 보호하겠다는 약속의 시작입니다. 신청서를 통해 입양하고자 하는 해변의 정보와 관리 계획을 제출하게 됩니다.",
      },
      {
        title: "화면 설명",
        type: "image-explanation",
        items: [
          {
            number: "①",
            title: "입양 희망 해변 선택",
            description:
              "전국 해변 지도에서 입양을 희망하는 해변을 선택합니다. 이미 입양된 해변은 선택할 수 없습니다.",
          },
          {
            number: "②",
            title: "기관/단체 정보",
            description:
              "입양을 신청하는 기관이나 단체의 기본 정보를 입력합니다. 사업자등록증 또는 고유번호증이 필요합니다.",
          },
          {
            number: "③",
            title: "활동 계획",
            description: "월 1회 이상의 정화 활동 계획과 해변 관리 방안을 구체적으로 작성합니다.",
          },
          {
            number: "④",
            title: "입양 동기",
            description:
              "왜 이 해변을 입양하고 싶은지, 어떤 활동을 하고 싶은지 자유롭게 작성해주세요.",
          },
        ],
      },
      {
        title: "신청서 작성 항목",
        type: "list",
        subsections: [
          {
            subtitle: "필수 작성 항목",
            items: [
              "입양 희망 해변 선택",
              "기관/단체명 및 대표자명",
              "사업자등록번호 또는 고유번호",
              "담당자 연락처 (휴대폰, 이메일)",
              "월별 활동 계획",
              "입양 신청 동기",
              "해변 관리 방안",
            ],
          },
          {
            subtitle: "선택 작성 항목",
            items: ["참여 예상 인원", "보유 장비 현황", "과거 환경 활동 이력", "협력 기관 정보"],
          },
        ],
      },
      {
        title: "작성 팁",
        type: "tips",
        items: [
          {
            icon: "💡",
            title: "구체적인 활동 계획 작성",
            description:
              "막연한 계획보다는 '매월 첫째 주 토요일 오전 10시, 20명이 참여하여 2시간 동안 정화 활동'처럼 구체적으로 작성하면 승인률이 높아집니다.",
          },
          {
            icon: "📝",
            title: "진정성 있는 입양 동기",
            description:
              "단순히 '환경 보호'보다는 '우리 지역 해변을 깨끗하게 만들어 주민들에게 쉼터를 제공하고 싶다'처럼 진정성 있게 작성해주세요.",
          },
          {
            icon: "🎯",
            title: "실현 가능한 계획 수립",
            description:
              "과도한 계획보다는 현실적으로 실천 가능한 계획을 세우는 것이 중요합니다. 작게 시작해서 점차 확대하는 것을 권장합니다.",
          },
        ],
      },
    ],
    relatedGuides: [
      {
        id: "2",
        title: "입양 가능한 해변 찾기",
        category: "반려해변 입양",
      },
      {
        id: "3",
        title: "입양 신청 시 필요한 정보",
        category: "반려해변 입양",
      },
      {
        id: "5",
        title: "입양 계약서 다운로드 및 작성",
        category: "서류 제출",
      },
    ],
    tags: ["입양신청", "신청서작성", "해변입양", "시작하기"],
  },
  "2": {
    category: "반려해변 입양",
    title: "입양 가능한 해변 찾기",
    description: "전국 반려해변 지도에서 원하는 해변을 선택하세요",
    readTime: "2분",
    views: 987,
    likes: 32,
    lastUpdated: "2026.01.14",
    sections: [
      {
        title: "전국 반려해변 지도",
        type: "text",
        content:
          "전국의 입양 가능한 해변을 지도에서 한눈에 확인할 수 있습니다. 지역별, 규모별로 검색하여 우리 기관에 맞는 해변을 찾아보세요.",
      },
      {
        title: "해변 선택 가이드",
        type: "list",
        subsections: [
          {
            subtitle: "고려사항",
            items: [
              "기관 위치에서의 접근성",
              "해변 규모 (소형: 100m 이하, 중형: 100-300m, 대형: 300m 이상)",
              "주변 편의시설 (주차장, 화장실 등)",
              "쓰레기 수거 협조 체계",
            ],
          },
        ],
      },
    ],
    relatedGuides: [
      {
        id: "1",
        title: "반려해변 입양 신청서 작성",
        category: "반려해변 입양",
      },
      {
        id: "3",
        title: "입양 신청 시 필요한 정보",
        category: "반려해변 입양",
      },
    ],
    tags: ["해변찾기", "지도", "검색", "위치"],
  },
  // 더 많은 가이드 데이터...
};

export default function GuideDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const guide = guideData[id];

  if (!guide) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">가이드를 찾을 수 없습니다</h1>
            <Link href="/adopt-a-beach" className="text-blue-600 hover:underline">
              목록으로 돌아가기
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
            <Link href="/adopt-a-beach" className="hover:text-blue-600">
              반려해변 입양
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{guide.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="bg-white rounded-xl p-8 mb-6 shadow-sm border border-gray-200">
                <Badge className="mb-4 bg-blue-50 text-blue-600 hover:bg-blue-100">
                  {guide.category}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{guide.title}</h1>
                <p className="text-lg text-gray-600 mb-6">{guide.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{guide.readTime} 소요</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>조회 {guide.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>좋아요 {guide.likes}</span>
                  </div>
                  <div className="ml-auto text-gray-400">최종 수정일: {guide.lastUpdated}</div>
                </div>
              </div>

              {/* Content Sections */}
              {guide.sections.map((section: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-8 mb-6 shadow-sm border border-gray-200"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    {section.type === "video" && <Video className="w-6 h-6 text-red-500" />}
                    {section.title}
                  </h2>

                  {section.type === "video" && guide.videoUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg mb-6">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={guide.videoUrl}
                        title="가이드 영상"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {section.type === "text" && (
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  )}

                  {section.type === "image-explanation" && (
                    <div className="space-y-6">
                      {/* 이미지 자리 */}
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-8">
                        <span className="text-gray-400">가이드 이미지 (예정)</span>
                      </div>

                      {/* 설명 항목들 */}
                      <div className="space-y-4">
                        {section.items.map((item: any, itemIdx: number) => (
                          <div key={itemIdx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              {item.number}
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {section.type === "list" && (
                    <div className="space-y-6">
                      {section.subsections?.map((subsection: any, subIdx: number) => (
                        <div key={subIdx}>
                          <h3 className="font-bold text-lg text-gray-900 mb-3">
                            {subsection.subtitle}
                          </h3>
                          <ul className="space-y-2">
                            {subsection.items.map((item: string, itemIdx: number) => (
                              <li key={itemIdx} className="flex items-start gap-2 text-gray-700">
                                <span className="text-blue-500 mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === "tips" && (
                    <div className="space-y-4">
                      {section.items.map((tip: any, tipIdx: number) => (
                        <div
                          key={tipIdx}
                          className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{tip.icon}</span>
                            <div>
                              <h4 className="font-bold text-gray-900 mb-2">{tip.title}</h4>
                              <p className="text-sm text-gray-700">{tip.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Tags */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {guide.tags.map((tag: string, idx: number) => (
                    <Link
                      key={idx}
                      href={`/search?query=${tag}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Like Button */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <p className="text-gray-600 mb-4">이 가이드가 도움이 되셨나요?</p>
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto">
                  <ThumbsUp className="w-5 h-5" />
                  도움이 됐어요
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Table of Contents */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  목차
                </h3>
                <nav className="space-y-2">
                  {guide.sections.map((section: any, idx: number) => (
                    <a
                      key={idx}
                      href={`#section-${idx}`}
                      className="block text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Related Guides */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">함께 보면 좋은 글</h3>
                <div className="space-y-3">
                  {guide.relatedGuides.map((related: any) => (
                    <Link
                      key={related.id}
                      href={`/adopt-a-beach/resources/${related.id}`}
                      className="block p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
                    >
                      <div className="text-xs text-gray-500 mb-1">{related.category}</div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                        {related.title}
                      </div>
                    </Link>
                  ))}
                </div>

                <Link
                  href="/adopt-a-beach"
                  className="block mt-4 text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  전체 가이드 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto px-6 mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              아직 궁금한 점이 있으신가요?
            </h3>
            <p className="text-gray-600 mb-8">
              전문가에게 직접 문의하시거나 등대지기에게 연락해보세요
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/adopt-a-beach/community">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  전문가 Q&A 보기
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  등대지기에게 연락하기
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
