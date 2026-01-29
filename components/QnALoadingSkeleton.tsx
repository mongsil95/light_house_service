"use client";

import Navigation from "@/components/Navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function QnALoadingSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* 데스크톱에서만 Navigation 표시 */}
      <div className="hidden md:block">
        <Navigation />
      </div>

      {/* 모바일 전용 헤더 */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 h-16 border-b border-gray-200">
        <div className="flex items-center justify-between h-full px-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* 환영 메시지 - 화면 센터 오버레이 */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="relative">
            <h1
              className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 animate-pulse-slow"
              style={{ fontFamily: "Cafe24_Ssurround, sans-serif" }}
            >
              환영합니다
            </h1>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-xl animate-pulse-slow" />
          </div>
          <p
            className="text-lg text-gray-600 animate-fade-in-delay"
            style={{ fontFamily: "Pretendard, sans-serif" }}
          >
            반려해변 등대지기에게 가고 있습니다.
          </p>
          <div className="flex justify-center gap-2 mt-6 animate-fade-in-delay-2">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>

      <main className="pt-24 pb-16 md:pt-24 opacity-30">
        <div className="max-w-7xl mx-auto px-0 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* 왼쪽 사이드바 스켈레톤 - 데스크톱만 */}
            <div className="hidden md:block md:col-span-2">
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* 메인 콘텐츠 스켈레톤 */}
            <div className="md:col-span-7">
              {/* 검색바 스켈레톤 */}
              <div className="mb-6 px-4 md:px-0">
                <div className="hidden md:flex gap-3">
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                  <Skeleton className="h-12 w-24 rounded-lg" />
                  <Skeleton className="h-12 w-24 rounded-lg" />
                </div>
                <div className="md:hidden flex gap-2">
                  <Skeleton className="h-10 flex-1 rounded-[5px]" />
                  <Skeleton className="h-10 w-10 rounded" />
                </div>
              </div>

              {/* 추천 글 스켈레톤 */}
              <div className="mb-6 px-4 md:px-0">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-gray-200 rounded-[15px] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 flex-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Q&A 리스트 스켈레톤 */}
              <div className="px-4 md:px-0 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-4 border-b border-gray-300">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 오른쪽 사이드바 스켈레톤 */}
            <div className="hidden md:block md:col-span-3">
              <div className="sticky top-24 space-y-4">
                {/* 배너 스켈레톤 */}
                <Skeleton className="w-full aspect-[16/13.5] rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
