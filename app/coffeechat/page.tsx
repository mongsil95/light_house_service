"use client";

import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { useEffect, useState } from "react";

export default function CoffeeChatPage() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />

      <main className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          {/* 라인 스타일 무전기 애니메이션 SVG */}
          <div
            className={`mb-12 transition-all duration-1000 ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 mx-auto animate-bounce-slow"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 무전기 본체 */}
              <rect
                x="60"
                y="40"
                width="80"
                height="120"
                rx="8"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="#ffffff"
                className="animate-pulse-slow"
              />

              {/* 안테나 */}
              <line
                x1="100"
                y1="40"
                x2="100"
                y2="15"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                className="animate-wiggle"
              />
              <circle cx="100" cy="12" r="4" fill="#3b82f6" className="animate-ping-slow" />

              {/* 스피커 */}
              <circle cx="100" cy="70" r="15" stroke="#3b82f6" strokeWidth="2" fill="none" />
              <circle cx="100" cy="70" r="10" fill="#e0f2fe" />
              <circle cx="100" cy="70" r="5" fill="#3b82f6" />

              {/* 버튼들 */}
              <rect x="75" y="100" width="50" height="8" rx="4" fill="#e0f2fe" />
              <rect x="75" y="115" width="50" height="8" rx="4" fill="#e0f2fe" />
              <rect x="75" y="130" width="50" height="8" rx="4" fill="#e0f2fe" />

              {/* 하단 버튼 */}
              <rect x="80" y="145" width="40" height="12" rx="6" fill="#3b82f6" />

              {/* 전파 신호 (왼쪽) */}
              <path
                d="M 40 70 Q 35 60 30 50"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
                opacity="0.6"
              />
              <path
                d="M 35 70 Q 30 60 25 50"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
                opacity="0.4"
                style={{ animationDelay: "0.2s" }}
              />

              {/* 전파 신호 (오른쪽) */}
              <path
                d="M 160 70 Q 165 60 170 50"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
                opacity="0.6"
              />
              <path
                d="M 165 70 Q 170 60 175 50"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                className="animate-pulse"
                opacity="0.4"
                style={{ animationDelay: "0.2s" }}
              />
            </svg>
          </div>

          {/* 타이틀 */}
          <h1
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-300 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ fontFamily: "Cafe24_Ssurround, sans-serif" }}
          >
            등대 무전 준비중
          </h1>

          {/* 설명 */}
          <div
            className={`max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-500 ${
              animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <p
              className="text-lg md:text-xl text-gray-600 mb-4"
              style={{ fontFamily: "Pretendard, sans-serif" }}
            >
              해변 정화를 위해 항해하다가
              <br />
              등대에 무전을 쳐서 일정을 예약하는
              <br />
              <span className="text-blue-600 font-semibold">커피챗 기능</span>을 준비하고 있어요
            </p>

            <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-blue-100">
              <p className="text-sm text-gray-500" style={{ fontFamily: "Pretendard, sans-serif" }}>
                <span className="text-blue-600 font-semibold">💡 무전이란?</span>
                <br />
                해양 정화 활동가들이 등대지기와 직접 소통하며
                <br />
                활동 일정을 조율하고 조언을 구할 수 있는
                <br />
                1:1 커피챗 예약 시스템입니다.
              </p>
            </div>
          </div>

          {/* 준비중 배지 */}
          <div
            className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg transition-all duration-1000 delay-700 ${
              animate ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-white rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
            <span className="font-semibold" style={{ fontFamily: "Cafe24_Ssurround, sans-serif" }}>
              곧 만나요!
            </span>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
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

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-5deg);
          }
          75% {
            transform: rotate(5deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
