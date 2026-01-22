// 📁 src/lib/email/newsletter-templates.ts
/**
 * Newsletter HTML 템플릿 생성기
 * PHP에서 사용할 HTML 문자열을 생성
 */

export interface NewsletterTemplateProps {
  title: string;
  markdown: string;
  recipient: {
    name: string;
    organization: string;
  };
  campaign: {
    id: number;
    title: string;
  };
  viewOnlineUrl?: string;
  unsubscribeUrl?: string;
}

export function generateNewsletterHTML(props: NewsletterTemplateProps): string {
  const {
    title,
    markdown,
    recipient,
    campaign,
    viewOnlineUrl,
    unsubscribeUrl,
  } = props;

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: white;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #0066cc;
    }
    .header h1 {
      color: #0066cc;
      margin: 0;
      font-size: 24px;
    }
    .content {
      margin-bottom: 30px;
    }
    .content h2 {
      color: #333;
      font-size: 20px;
      margin-top: 20px;
    }
    .content p {
      margin: 10px 0;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #0066cc;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 10px 0;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌊 이타시티 Newsletter</h1>
    </div>
    
    <div class="greeting">
      <p><strong>${recipient.name}</strong> 님 (${recipient.organization})</p>
      <p>안녕하세요! 이타시티에서 소식을 전해드립니다.</p>
    </div>
    
    <div class="content">
      ${markdown}
    </div>
    
    ${
      viewOnlineUrl
        ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${viewOnlineUrl}" class="button">웹에서 보기</a>
      </div>
    `
        : ""
    }
    
    <div class="footer">
      <p>이 이메일은 ${recipient.organization}에 발송되었습니다.</p>
      <p>문의사항이 있으시면 support@itacity.kr로 연락주세요.</p>
      ${
        unsubscribeUrl
          ? `
        <p><a href="${unsubscribeUrl}" style="color: #666;">수신거부</a></p>
      `
          : ""
      }
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Next.js API Route에서 HTML 생성
 * POST /api/newsletter/generate-html
 */
export async function generateNewsletterHTMLForPHP(
  props: NewsletterTemplateProps
) {
  // Markdown → HTML 변환 (Next.js에서 처리)
  const { marked } = await import("marked");
  const htmlContent = await marked.parse(props.markdown);

  return generateNewsletterHTML({
    ...props,
    markdown: htmlContent,
  });
}
