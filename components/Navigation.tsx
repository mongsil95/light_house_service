"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface MenuItem {
  label: string;
  href: string;
  subItems?: { label: string; href: string }[];
}

export default function Navigation() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    // { label: "홈", href: "/" }, // 숨김 처리
    // TODO : 반려해변 메뉴 - 추후 활성화 예정
    //{
    //  label: "반려해변",
    //  href: "/adopt-a-beach",
    //  subItems: [
    // TODO: 반려해변 입양 메뉴만 숨김 처리
    // { label: "반려해변 입양", href: "/adopt-a-beach" },
    //    { label: "반려해변 가이드", href: "/adopt-a-beach/resources" },
    //    { label: "전문가 Q&A", href: "/adopt-a-beach/expertsqna" },
    //  ],
    //},
    // { label: "반려해변 가이드", href: "/adopt-a-beach/resources" }, // 숨김 처리
    //{ label: "등대지기 Q&A", href: "/adopt-a-beach/expertsqna" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-blue-100 bg-white/80">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/adopt-a-beach.png"
              alt="등대지기의 랜턴"
              className="h-10 md:h-12 w-auto"
            />
          </Link>

          {/* Center: Navigation Menu (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.subItems && setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                {item.subItems ? (
                  <>
                    <button className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-blue-600 font-[Cafe24_Ssurround] transition-colors">
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openMenu === item.label && (
                      <div className="absolute top-full left-0 pt-0 bg-white border border-blue-100 rounded-lg shadow-lg min-w-[180px] py-2 mt-0">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-[Cafe24_Ssurround] transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-[Cafe24_Ssurround] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            aria-label="메뉴"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Right: Link (Desktop) */}
          <a
            href="https://caresea.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 px-3 md:px-5 py-1.5 md:py-2 bg-white/70 border-2 border-blue-500 text-blue-600 hover:bg-white/90 rounded-full transition-colors duration-300 font-[Cafe24_Ssurround] text-xs md:text-sm"
          >
            <span>반려해변 홈</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <path d="M7 7h10v10"></path>
              <path d="M7 17 17 7"></path>
            </svg>
          </a>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-blue-100">
            <nav className="flex flex-col space-y-1 pt-4">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.subItems ? (
                    <>
                      <button
                        onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-[Cafe24_Ssurround] transition-colors rounded-lg"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openMenu === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openMenu === item.label && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.label}
                              href={subItem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-4 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-[Cafe24_Ssurround] transition-colors rounded-lg"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-[Cafe24_Ssurround] transition-colors rounded-lg"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              {/* Mobile Link */}
              <a
                href="https://caresea.kr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mx-4 mt-4 px-5 py-2.5 bg-white/70 border-2 border-blue-500 text-blue-600 hover:bg-white/90 rounded-full transition-colors duration-300 font-[Cafe24_Ssurround] text-sm"
              >
                <span>반려해변 홈</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <path d="M7 7h10v10"></path>
                  <path d="M7 17 17 7"></path>
                </svg>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
