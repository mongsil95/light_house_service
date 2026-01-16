import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
};

export const metadata: Metadata = {
  title: "반려해변 라이트하우스 서비스",
  description: "반려해변 라이트하우스 서비스. 평일 09:00-17:00 운영.",
  keywords: [
    "이타서울",
    "반려해변",
    "전국대회",
    "컨시어지",
    "라이트하우스",
    "등대지기",
    "참여기관",
    "고객지원",
  ],
  authors: [{ name: "이타서울" }],
  openGraph: {
    type: "website",
    title: "반려해변 라이트하우스 서비스",
    description:
      "반려해변, 더 이상 혼자 고민하지 마세요. 전담 등대지기가 문의 응대부터 활동 안내까지 함께합니다.",
    siteName: "라이트하우스 서비스",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "반려해변 라이트하우스 서비스",
    description: "반려해변, 더 이상 혼자 고민하지 마세요. 등대지기가 함께합니다.",
  },
  other: {
    contact: "0507-1855-3148",
    email: "itaseoul@naver.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2108-2@1.0/Cafe24Ssurround.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "2026 반려해변 라이트하우스 서비스",
              description: "반려해변 라이트하우스 서비스",
              telephone: "0507-1855-3148",
              email: "itaseoul@naver.com",
              areaServed: "KR",
              availableLanguage: "Korean",
            }),
          }}
        />
      </head>
      <body className="font-cafe24">{children}</body>
    </html>
  );
}
