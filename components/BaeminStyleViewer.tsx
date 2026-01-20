"use client";

interface BaeminStyleViewerProps {
  content: string;
}

export default function BaeminStyleViewer({ content }: BaeminStyleViewerProps) {
  return (
    <div className="baemin-content">
      <style jsx>{`
        .baemin-content {
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
            sans-serif;
          font-size: 16px;
          line-height: 1.8;
          color: #181a1c;
        }

        .baemin-content p {
          margin: 16px 0;
        }

        .baemin-content h1 {
          font-size: 28px;
          font-weight: 700;
          line-height: 1.4;
          margin: 32px 0 16px;
          color: #181a1c;
        }

        .baemin-content h2 {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.4;
          margin: 32px 0 16px;
          color: #181a1c;
        }

        .baemin-content h3 {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.4;
          margin: 24px 0 12px;
          color: #181a1c;
        }

        .baemin-content hr {
          border: none;
          border-top: 1px solid #e4e6e8;
          margin: 32px 0;
        }

        .baemin-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 24px 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .baemin-content table td {
          padding: 16px 20px;
          border: 1px solid #e4e6e8;
          vertical-align: top;
        }

        .baemin-content table td[style*="background-color: rgb(228, 230, 232)"],
        .baemin-content table td.header {
          background-color: #e4e6e8;
          font-weight: 700;
          text-align: center;
        }

        .baemin-content a {
          color: #2ac1bc;
          text-decoration: none;
          transition: opacity 0.2s;
        }

        .baemin-content a:hover {
          opacity: 0.7;
          text-decoration: underline;
        }

        .baemin-content strong {
          font-weight: 700;
          color: #181a1c;
        }

        .baemin-content ul,
        .baemin-content ol {
          margin: 16px 0;
          padding-left: 24px;
        }

        .baemin-content li {
          margin: 8px 0;
          line-height: 1.8;
        }

        .baemin-content br {
          display: block;
          content: "";
          margin: 8px 0;
        }

        .baemin-content .highlight-box {
          background-color: #f8f9fa;
          border-left: 4px solid #2ac1bc;
          padding: 16px 20px;
          margin: 20px 0;
          border-radius: 4px;
        }

        .baemin-content .info-box {
          background-color: #e8f4f8;
          padding: 20px;
          border-radius: 8px;
          margin: 24px 0;
        }

        .baemin-content blockquote {
          border-left: 4px solid #e4e6e8;
          padding-left: 20px;
          margin: 20px 0;
          color: #6b7280;
          font-style: italic;
        }

        /* 체크마크 스타일 */
        .baemin-content li::marker {
          color: #2ac1bc;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
