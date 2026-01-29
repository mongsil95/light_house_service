"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Link from "next/link";
import { useState, useEffect } from "react";

interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  subItems?: { label: string; href: string }[];
}

// 망원경 아이콘 (탐색) - 항해사 손망원경
const TelescopeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="10" width="12" height="4" rx="1" transform="rotate(-30 8 12)" />
    <rect x="12" y="7" width="8" height="3" rx="0.5" transform="rotate(-30 16 8.5)" />
    <circle cx="3" cy="13" r="1.5" />
    <circle cx="18" cy="6" r="1" />
    <line x1="14" y1="14" x2="12" y2="18" />
    <line x1="10" y1="12" x2="8" y2="16" />
  </svg>
);

// 무전기 아이콘 (무전)
const RadioIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="8" y="4" width="8" height="16" rx="1.5" />
    <circle cx="12" cy="9" r="2" />
    <line x1="10" y1="14" x2="14" y2="14" />
    <line x1="10" y1="16" x2="14" y2="16" />
    <line x1="12" y1="4" x2="12" y2="2" />
    <circle cx="12" cy="1.5" r="0.5" fill="currentColor" />
  </svg>
);

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [hideMenu, setHideMenu] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const menuItems: MenuItem[] = [
    { label: "탐색", href: "/", icon: "telescope" },
    { label: "무전", href: "/coffeechat", icon: "radio" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // 스크롤 다운
        setHideMenu(true);
      } else {
        // 스크롤 업
        setHideMenu(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      {/* Desktop Layout */}
      <div className="hidden md:block max-w-7xl mx-auto px-8 lg:px-12 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <img src="/images/adopt-a-beach.png" alt="등대지기의 랜턴" className="h-10 w-auto" />
          </Link>

          {/* Center: Navigation Menu */}
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-bold text-black font-[Cafe24_Ssurround] hover:text-blue-600 transition-colors"
            >
              <TelescopeIcon className="w-5 h-5" />
              탐색
            </Link>
            <Link
              href="/coffeechat"
              className="flex items-center gap-2 text-base font-bold text-black font-[Cafe24_Ssurround] hover:text-blue-600 transition-colors"
            >
              <RadioIcon className="w-5 h-5" />
              무전
            </Link>
          </nav>

          {/* Right: Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://caresea.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-black font-[Cafe24_Ssurround] hover:bg-gray-50 transition-colors"
            >
              반려해변 홈
            </a>
            <button
              onClick={() => setAboutModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs text-black font-[Cafe24_Ssurround] hover:bg-gray-50 transition-colors"
            >
              등대지기가 뭐예요?
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden px-4 py-2">
        {/* Top Row: Logo + Buttons */}
        <div className="flex items-center justify-between mb-2">
          <Link href="/" className="flex items-center">
            <img src="/images/adopt-a-beach.png" alt="등대지기의 랜턴" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="https://caresea.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-[9px] text-black font-[Cafe24_Ssurround]"
            >
              반려해변 홈
            </a>
            <button
              onClick={() => setAboutModalOpen(true)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-[9px] text-black font-[Cafe24_Ssurround] whitespace-nowrap"
            >
              등대지기가 뭐예요?
            </button>
          </div>
        </div>

        {/* Bottom Row: Menu Links - 스크롤 시 숨김 */}
        <div 
          className={`flex items-center gap-8 justify-center overflow-hidden transition-all duration-300 py-3 ${hideMenu ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}
        >
          <Link href="/" className="flex items-center gap-2">
            <TelescopeIcon className="w-6 h-6 text-black" />
            <span className="text-[15px] font-bold text-black font-[Cafe24_Ssurround]">탐색</span>
          </Link>
          <Link href="/coffeechat" className="flex items-center gap-2">
            <RadioIcon className="w-6 h-6 text-black" />
            <span className="text-[15px] font-bold text-black font-[Cafe24_Ssurround]">무전</span>
          </Link>
        </div>
      </div>

      {/* About Modal - Desktop (Dialog) */}
      <Dialog open={aboutModalOpen} onOpenChange={setAboutModalOpen}>
        <DialogContent className="hidden sm:block sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 font-[Cafe24_Ssurround]">
              반려해변 등대지기는 이런 역할이에요.
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="text-gray-700 leading-relaxed font-[Pretendard]">
              해변을 사랑하는 사람들이 안전하고 즐겁게 정화 활동을 할 수 있도록 보이지 않는 곳에서
              길을 밝혀요.
            </p>
            <p className="text-gray-700 leading-relaxed font-[Pretendard]">
              처음이어도, 혼자여도 걱정 없게. 활동이 막히지 않도록 곁에서 도와드려요.
            </p>
            <p className="text-gray-700 leading-relaxed font-[Pretendard]">
              여러분의 해변정화가 순항할 수 있도록 함께할게요.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setAboutModalOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Cafe24_Ssurround]"
              >
                닫기
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Modal - Mobile (Sheet) */}
      <Sheet open={aboutModalOpen} onOpenChange={setAboutModalOpen}>
        <SheetContent side="bottom" className="sm:hidden">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-gray-900 font-[Cafe24_Ssurround]">
              반려해변 등대지기는 이런 역할이에요.
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <p className="text-gray-700 leading-relaxed font-[Pretendard]">
              해변을 사랑하는 사람들이 안전하고 즐겁게 정화 활동을 할 수 있도록 보이지 않는 곳에서
              길을 밝혀요.
            </p>
            <p className="text-gray-700 leading-relaxed font-[Pretendard]">
              처음이어도, 혼자여도 걱정 없게. 활동이 막히지 않도록 곁에서 도와드려요.
            </p>
            <p className="text-gray-700 leading-relaxed font-[Pretendard]">
              여러분의 해변정화가 순항할 수 있도록 함께할게요.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setAboutModalOpen(false)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[Cafe24_Ssurround]"
              >
                닫기
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
