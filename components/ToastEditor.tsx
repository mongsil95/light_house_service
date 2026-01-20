"use client";

import MDEditor from "@uiw/react-md-editor";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

export default function RichEditor({ value, onChange, height = "600px" }: RichEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        preview="live"
        height={parseInt(height)}
        visibleDragbar={false}
        textareaProps={{
          placeholder:
            "# 제목\n\n내용을 작성하세요...\n\n## 소제목\n\n- 목록 1\n- 목록 2\n\n| 열1 | 열2 |\n|-----|-----|\n| 데이터1 | 데이터2 |",
        }}
      />
    </div>
  );
}
