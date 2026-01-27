// lib/email/utils/generatePDF.ts
import { html as beautifyHTML } from "js-beautify";
import { PDFDocument } from "pdf-lib";
import { renderToStaticMarkup } from "react-dom/server";
import { AdoptApplyConfirmationEmail } from "../templates/AdoptApplyConfirmationEmail";

export async function generatePDFBuffer(data: any) {
  const html = beautifyHTML(renderToStaticMarkup(AdoptApplyConfirmationEmail(data)));
  const blob = new Blob([html], { type: "text/html" });
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  page.drawText("입양 신청 PDF는 브라우저에서 확인 가능합니다.");
  return await pdfDoc.save();
}
