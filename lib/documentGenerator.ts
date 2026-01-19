import { FormData } from "@/types/easyGuide";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";

// Word 템플릿 파일 로드 함수
const loadTemplate = async (templatePath: string): Promise<ArrayBuffer> => {
  const response = await fetch(templatePath);
  if (!response.ok) {
    throw new Error(`템플릿 파일을 로드할 수 없습니다: ${templatePath}`);
  }
  return await response.arrayBuffer();
};

// Word 템플릿에 데이터 삽입 및 다운로드
export const generateWordFromTemplate = async (formData: FormData) => {
  try {
    // 템플릿 파일 로드
    const templatePath = "/templates/반려해변_입양_가입서_템플릿.docx";
    const content = await loadTemplate(templatePath);

    // PizZip으로 압축 해제
    const zip = new PizZip(content);

    // Docxtemplater 인스턴스 생성
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 템플릿에 삽입할 데이터 준비
    const templateData = {
      organizationName: formData.organizationName || "",
      organizationType: formData.organizationType || "",
      registrationNumber: formData.registrationNumber || "",
      representativeName: formData.representativeName || "",
      managerName: formData.managerName || "",
      officePhone: formData.officePhone || "",
      mobilePhone: formData.mobilePhone || "",
      email: formData.email || "",
      address: formData.address || "",
      beachCount: formData.beachCount || "",
      fundAmount: formData.fundAmount || "",
      grassrootsSupport: formData.grassrootsSupport || "",
      grassrootsCount: formData.grassrootsCount || "",
      grassrootsAmount: formData.grassrootsAmount || "",
      paymentMethod: formData.paymentMethod || "",
      paymentMethodDetail: formData.paymentMethodDetail || "",
      paymentDate: formData.paymentDate || "",
      beachLocation: formData.beachLocation || "",
      beachAdminDistrict: formData.beachAdminDistrict || "",
      activityPeriod: formData.activityPeriod || "",
      safetyInsurance: formData.safetyInsurance || "",
      safetyMeasure: formData.safetyMeasure || "",
      consentDate: formData.consentDate || new Date().toISOString().split("T")[0],
      currentDate: new Date().toLocaleDateString("ko-KR"),
    };

    // 데이터 삽입
    doc.setData(templateData);

    try {
      doc.render();
    } catch (error) {
      console.error("템플릿 렌더링 오류:", error);
      throw error;
    }

    // 수정된 문서 생성
    const output = doc.getZip().generate({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // 파일명 생성
    const fileName = `반려해변_입양_가입서_${formData.organizationName || "신청서"}_${new Date().toISOString().split("T")[0]}.docx`;

    // 파일 다운로드
    saveAs(output, fileName);

    return fileName;
  } catch (error) {
    console.error("Word 문서 생성 중 오류:", error);
    // 오류 발생 시 기본 방식으로 폴백
    return await generateWord(formData);
  }
};

// PDF 생성 함수 (jsPDF 사용)
export const generatePDF = async (formData: FormData) => {
  // 동적 import로 jsPDF 로드
  const { jsPDF } = await import("jspdf");

  // 한글 폰트 지원을 위한 설정
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // 제목
  doc.setFontSize(20);
  doc.text("해변 입양 신청 서류", pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 15;

  // 문서 1: 기관 정보
  doc.setFontSize(16);
  doc.text("1. 기관 정보", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  const orgInfo = [
    `기관명: ${formData.organizationName || ""}`,
    `대표자: ${formData.representativeName || ""}`,
    `연락처: ${formData.officePhone || formData.mobilePhone || ""}`,
    `이메일: ${formData.email || ""}`,
    `주소: ${formData.address || ""}`,
  ];

  orgInfo.forEach((line) => {
    doc.text(line, 25, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // 문서 2: 구성원 안전 확보 및 보험 지원 확약서
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.text("2. 구성원 안전 확보 및 보험 지원 확약서", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  const safetyInfo = [
    `활동 기간: ${formData.activityPeriod || ""}`,
    `보험 가입 여부: ${formData.safetyInsurance || ""}`,
  ];

  safetyInfo.forEach((line) => {
    doc.text(line, 25, yPosition);
    yPosition += 8;
  });

  yPosition += 5;
  doc.setFontSize(10);
  doc.text(
    "본 기관은 해변 입양 활동에 참여하는 모든 구성원의 안전을 최우선으로 하며,",
    25,
    yPosition
  );
  yPosition += 6;
  doc.text(
    "활동 중 발생할 수 있는 사고에 대비하여 적절한 보험에 가입할 것을 확약합니다.",
    25,
    yPosition
  );

  yPosition += 15;

  // 문서 3: 기금 확약서
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.text("3. 기금 확약서", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(12);
  doc.text(`예상 기금: ${formData.fundAmount || ""}원`, 25, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  doc.text("본 기관은 해변 입양 활동을 위해 위 금액의 기금을 마련하여", 25, yPosition);
  yPosition += 6;
  doc.text("활동에 필요한 물품 구입 및 프로그램 운영에 사용할 것을 확약합니다.", 25, yPosition);

  yPosition += 15;

  // 문서 4: 개인정보 수집 및 이용 동의서
  if (yPosition > pageHeight - 40) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(16);
  doc.text("4. 개인정보 수집 및 이용 동의서", 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  const consentText = [
    "본인은 해변 입양 신청을 위해 아래와 같이 개인정보를 제공하는 것에 동의합니다.",
    "",
    "- 수집 항목: 기관명, 대표자명, 연락처, 이메일, 주소",
    "- 수집 목적: 해변 입양 프로그램 운영 및 관리",
    "- 보유 기간: 프로그램 종료 후 1년",
    "",
    "위 내용을 충분히 이해하였으며, 개인정보 수집 및 이용에 동의합니다.",
  ];

  consentText.forEach((line) => {
    doc.text(line, 25, yPosition);
    yPosition += 6;
  });

  yPosition += 10;
  doc.setFontSize(12);
  doc.text(`날짜: ${formData.consentDate || ""}`, 25, yPosition);

  // PDF 파일명 생성
  const fileName = `해변입양신청서_${formData.organizationName || "신청서"}_${new Date().toISOString().split("T")[0]}.pdf`;

  // PDF 다운로드
  doc.save(fileName);

  return fileName;
};

// Word 문서 생성 함수 (docx 사용)
export const generateWord = async (formData: FormData) => {
  // 동적 import로 docx 로드
  const docx = await import("docx");
  const { Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;

  // 문서 생성
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // 제목
          new Paragraph({
            text: "해변 입양 신청 서류",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // 1. 기관 정보
          new Paragraph({
            text: "1. 기관 정보",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `기관명: ${formData.organizationName || ""}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `대표자: ${formData.representativeName || ""}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `연락처: ${formData.contact || ""}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `이메일: ${formData.email || ""}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `주소: ${formData.address || ""}`,
              }),
            ],
            spacing: { after: 200 },
          }),

          // 2. 구성원 안전 확보 및 보험 지원 확약서
          new Paragraph({
            text: "2. 구성원 안전 확보 및 보험 지원 확약서",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `활동 기간: ${formData.activityPeriod || ""}`,
              }),
            ],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `보험 가입 여부: ${formData.safetyInsurance || ""}`,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "본 기관은 해변 입양 활동에 참여하는 모든 구성원의 안전을 최우선으로 하며, 활동 중 발생할 수 있는 사고에 대비하여 적절한 보험에 가입할 것을 확약합니다.",
            spacing: { after: 200 },
          }),

          // 3. 기금 확약서
          new Paragraph({
            text: "3. 기금 확약서",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `예상 기금: ${formData.fundAmount || ""}원`,
              }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "본 기관은 해변 입양 활동을 위해 위 금액의 기금을 마련하여 활동에 필요한 물품 구입 및 프로그램 운영에 사용할 것을 확약합니다.",
            spacing: { after: 200 },
          }),

          // 4. 개인정보 수집 및 이용 동의서
          new Paragraph({
            text: "4. 개인정보 수집 및 이용 동의서",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
          }),
          new Paragraph({
            text: "본인은 해변 입양 신청을 위해 아래와 같이 개인정보를 제공하는 것에 동의합니다.",
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- 수집 항목: 기관명, 대표자명, 연락처, 이메일, 주소",
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- 수집 목적: 해변 입양 프로그램 운영 및 관리",
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: "- 보유 기간: 프로그램 종료 후 1년",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "위 내용을 충분히 이해하였으며, 개인정보 수집 및 이용에 동의합니다.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `날짜: ${formData.consentDate || ""}`,
              }),
            ],
          }),
        ],
      },
    ],
  });

  // Word 파일로 변환
  const { Packer } = docx;
  const blob = await Packer.toBlob(doc);

  // 파일 다운로드
  const fileName = `해변입양신청서_${formData.organizationName || "신청서"}_${new Date().toISOString().split("T")[0]}.docx`;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return fileName;
};
