"use client";

import Navigation from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CheckCircle2, CreditCard, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PetBeachPage() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // 각 단계별 가이드 콘텐츠
  const step1Contents = [
    {
      title: "반려해변에 대한 정보를 알아보기",
      description: "반려해변에 대해서 자세히 알아보세요",
      type: "가이드",
      link: "/adopt-a-beach/resources/1",
    },
    {
      title: "입양 가능한 해변 찾기",
      description: "전국 반려해변 지도에서 원하는 해변을 선택하세요",
      type: "가이드",
      link: "/beach-finder",
    },
    {
      title: "반려해변 기획안 준비하기",
      description: "기획안을 이렇게 작성해보세요!",
      type: "가이드",
      link: "/adopt-a-beach/resources/3",
    },
  ];

  const step2Contents = [
    {
      title: "입양서류 쉽게 작성하기",
      description: "등대지기가 입양서류를 쉽게 작성하실 수 있게 준비해두었어요!",
      type: "가이드",
      link: "/application",
    },
    {
      title: "기관 증빙 서류 제출",
      description: "사업자등록증 또는 고유번호증 제출 방법",
      type: "가이드",
      link: "/adopt-a-beach/resources/6",
    },
    {
      title: "활동 계획서 작성 팁",
      description: "승인률 높이는 활동 계획서 작성법",
      type: "가이드",
      link: "/adopt-a-beach/resources/7",
    },
  ];

  const step3Contents = [
    {
      title: "입양 기금 안내",
      description: "반려해변 입양 기금의 목적과 사용처",
      type: "가이드",
      link: "/adopt-a-beach/resources/9",
    },
    {
      title: "기금 납부 방법",
      description: "계좌이체, 카드결제 등 납부 방법 안내",
      type: "가이드",
      link: "/adopt-a-beach/resources/10",
    },
    {
      title: "납부 영수증 발급",
      description: "기부금 영수증 신청 및 발급 방법",
      type: "가이드",
      link: "/adopt-a-beach/resources/11",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-cyan-500 via-blue-500 to-blue-600 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              반려해변 입양, 3단계로 완전정복!
            </h1>
            <p className="text-lg md:text-xl text-blue-50 max-w-2xl mx-auto">
              반려해변 입양 어렵지 않도록 단계별로 모아봤어요
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6">
          {/* 단계 네비게이션 */}
          <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 -mx-6 px-6 py-6 mb-12">
            <div className="flex justify-center items-center gap-8 max-w-4xl mx-auto">
              {/* 1단계 */}
              <button
                onClick={() => setActiveStep(1)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  activeStep === 1 ? "scale-110" : "opacity-50 hover:opacity-75"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-2xl transition-all ${
                    activeStep === 1
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    activeStep === 1 ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  반려해변 알아보기
                </span>
              </button>

              {/* 화살표 */}
              <div className="flex items-center">
                <svg
                  className="w-12 h-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* 2단계 */}
              <button
                onClick={() => setActiveStep(2)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  activeStep === 2 ? "scale-110" : "opacity-50 hover:opacity-75"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-2xl transition-all ${
                    activeStep === 2
                      ? "bg-green-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    activeStep === 2 ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  반려해변 신청하기
                </span>
              </button>

              {/* 화살표 */}
              <div className="flex items-center">
                <svg
                  className="w-12 h-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* 3단계 */}
              <button
                onClick={() => setActiveStep(3)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  activeStep === 3 ? "scale-110" : "opacity-50 hover:opacity-75"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full font-bold text-2xl transition-all ${
                    activeStep === 3
                      ? "bg-purple-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-sm font-semibold whitespace-nowrap ${
                    activeStep === 3 ? "text-purple-600" : "text-gray-500"
                  }`}
                >
                  반려해변 선정이후
                </span>
              </button>
            </div>
          </div>

          {/* 1단계 - 입양 신청하기 */}
          {activeStep === 1 && (
            <section id="step1" className="mb-20 scroll-mt-32">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white font-bold text-xl">
                    1
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    반려해변 알아보기
                  </h2>
                </div>
                <p className="text-gray-600 ml-15">
                  반려해변이 무엇인지, 입양 신청 전 알아두면 좋은 정보를 소개해드려요
                </p>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {step1Contents.map((content, idx) => (
                    <CarouselItem
                      key={idx}
                      className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <Link href={content.link} className="block h-full">
                        <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <FileText className="w-5 h-5 text-blue-600" />
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {content.type}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {content.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                            <div className="text-blue-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                              자세히 보기
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </section>
          )}

          {/* 2단계 - 서류 제출하기 */}
          {activeStep === 2 && (
            <section id="step2" className="mb-20 scroll-mt-32">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold text-xl">
                    2
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    반려해변 신청하기
                  </h2>
                </div>
                <p className="text-gray-600 ml-15">
                  우리 기관에 맞는 반려해변을 입양 신청을 시작하세요
                </p>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {step2Contents.map((content, idx) => (
                    <CarouselItem
                      key={idx}
                      className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <Link href={content.link} className="block h-full">
                        <Card className="border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {content.type}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                              {content.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                            <div className="text-green-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                              자세히 보기
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </section>
          )}

          {/* 3단계 - 기금 납부하기 */}
          {activeStep === 3 && (
            <section id="step3" className="mb-20 scroll-mt-32">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500 text-white font-bold text-xl">
                    3
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    반려해변 입양 선정 이후
                  </h2>
                </div>
                <p className="text-gray-600 ml-15">
                  반려해변 입양 선정 후 필요한 서류 및 기금 납부 절차를 안내해드려요
                </p>
              </div>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {step3Contents.map((content, idx) => (
                    <CarouselItem
                      key={idx}
                      className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                    >
                      <Link href={content.link} className="block h-full">
                        <Card className="border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group cursor-pointer h-full">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                                <CreditCard className="w-5 h-5 text-purple-600" />
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {content.type}
                              </Badge>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                              {content.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">{content.description}</p>
                            <div className="text-purple-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                              자세히 보기
                              <ExternalLink className="w-4 h-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </section>
          )}

          {/* 하단 CTA */}
          <section className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              아직 궁금한 점이 있으신가요?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              반려해변 입양에 대해 더 자세히 알고 싶으시다면 전문가에게 직접 문의해보세요
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/adopt-a-beach/expertsqna/ask">
                <button className="px-8 py-3 bg-blue-300 text-white rounded-lg hover:bg-blue-400 transition-colors font-semibold">
                  전문가에게 질문하기
                </button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold">
                  등대지기에게 연락하기
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
