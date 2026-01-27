// lib/email/utils/generatePDFBuffer.ts
import { renderToStaticMarkup } from "react-dom/server";
import puppeteer from "puppeteer";
import type { FormId } from "@/types/form";

/**
 * PDF용 HTML 문자열 생성
 */
function generateHTML(data: any, formId: FormId): string {
  const rows = Object.entries(data).map(([key, value]) => {
    const content = Array.isArray(value)
      ? value.join(", ")
      : typeof value === "boolean"
        ? value
          ? "예"
          : "아니오"
        : String(value);

    return `<tr><th>${key}</th><td>${content}</td></tr>`;
  });

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: sans-serif; padding: 2rem; }
          h1 { color: #0064ff; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
          td, th { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>CareSea - ${formId} 신청서</h1>
        <table>
          <tbody>
            ${rows.join("\n")}
          </tbody>
        </table>
      </body>
    </html>
  `;
}

/**
 * Puppeteer를 활용한 PDF 버퍼 생성
 */
export async function generatePDFBuffer(data: any, formId: FormId): Promise<Buffer> {
  const html = generateHTML(data, formId);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return Buffer.from(pdfBuffer); // 🟢 안전하게 변환
  } finally {
    await browser.close(); // ✅ 리소스 정리
  }
}
