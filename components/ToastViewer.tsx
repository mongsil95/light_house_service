"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface HtmlViewerProps {
  content: string;
}

export default function HtmlViewer({ content }: HtmlViewerProps) {
  return (
    <div
      className="prose prose-lg max-w-none"
      style={{ fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      <style jsx global>{`
        .prose {
          font-family:
            "Pretendard",
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            sans-serif;
        }
        .prose strong {
          font-weight: 700;
          color: inherit;
        }
        .prose em {
          font-style: italic;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 2em;
          margin: 1em 0;
        }
        .prose ol {
          list-style-type: decimal;
          padding-left: 2em;
          margin: 1em 0;
        }
        .prose li {
          margin: 0.5em 0;
        }
        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .prose th,
        .prose td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .prose th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}
