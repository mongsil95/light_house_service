"use client";

import { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo,
  Table as TableIcon,
  Trash2,
  Undo,
} from "lucide-react";
import { useCallback } from "react";

interface MenuBarProps {
  editor: Editor | null;
}

export default function MenuBar({ editor }: MenuBarProps) {
  const addImage = useCallback(() => {
    const url = window.prompt("이미지 URL을 입력하세요:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("링크 URL을 입력하세요:", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const insertBaeminTable = useCallback(() => {
    if (!editor) return;

    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const insertTemplate1 = useCallback(() => {
    if (!editor) return;

    const template = `
<h2 style="color: #2ac1bc; font-weight: bold; margin-bottom: 1rem;">반려해변 입양 안내</h2>
<p style="line-height: 1.8;">해변을 사랑하는 마음으로 시작하는 작은 실천, 반려해변 입양에 함께해주세요.</p>

<h3 style="color: #333; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">입양 절차</h3>
<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
  <thead>
    <tr>
      <th style="background-color: #e4e6e8; border: 1px solid #ccc; padding: 0.75rem; text-align: left;">단계</th>
      <th style="background-color: #e4e6e8; border: 1px solid #ccc; padding: 0.75rem; text-align: left;">내용</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ccc; padding: 0.75rem;">1단계</td>
      <td style="border: 1px solid #ccc; padding: 0.75rem;">신청서 작성</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 0.75rem;">2단계</td>
      <td style="border: 1px solid #ccc; padding: 0.75rem;">검토 및 승인</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ccc; padding: 0.75rem;">3단계</td>
      <td style="border: 1px solid #ccc; padding: 0.75rem;">활동 시작</td>
    </tr>
  </tbody>
</table>
    `;

    editor.chain().focus().setContent(template).run();
  }, [editor]);

  const insertTemplate2 = useCallback(() => {
    if (!editor) return;

    const template = `
<h2 style="color: #2ac1bc; font-weight: bold; margin-bottom: 1rem;">자주 묻는 질문</h2>

<h3 style="color: #333; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">Q. 반려해변 입양은 무엇인가요?</h3>
<p style="line-height: 1.8;">반려해변 입양은 특정 해변을 정기적으로 방문하여 청소하고 관리하는 자원봉사 활동입니다.</p>

<h3 style="color: #333; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">Q. 누구나 참여할 수 있나요?</h3>
<p style="line-height: 1.8;">네, 개인, 가족, 단체 모두 참여 가능합니다.</p>

<h3 style="color: #333; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">Q. 활동 비용이 있나요?</h3>
<p style="line-height: 1.8;">기본 활동은 무료이며, 필요한 도구는 지원됩니다.</p>
    `;

    editor.chain().focus().setContent(template).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-300" : ""}`}
        title="굵게"
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("italic") ? "bg-gray-300" : ""
        }`}
        title="기울임"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 1 }) ? "bg-gray-300" : ""
        }`}
        title="제목 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 2 }) ? "bg-gray-300" : ""
        }`}
        title="제목 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("heading", { level: 3 }) ? "bg-gray-300" : ""
        }`}
        title="제목 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("bulletList") ? "bg-gray-300" : ""
        }`}
        title="글머리 기호 목록"
      >
        <List className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("orderedList") ? "bg-gray-300" : ""
        }`}
        title="번호 매기기 목록"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive("blockquote") ? "bg-gray-300" : ""
        }`}
        title="인용문"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Alignment */}
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : ""
        }`}
        title="왼쪽 정렬"
      >
        <AlignLeft className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : ""
        }`}
        title="가운데 정렬"
      >
        <AlignCenter className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : ""
        }`}
        title="오른쪽 정렬"
      >
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Insert Link & Image */}
      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive("link") ? "bg-gray-300" : ""}`}
        title="링크"
      >
        <LinkIcon className="w-4 h-4" />
      </button>

      <button onClick={addImage} className="p-2 rounded hover:bg-gray-200" title="이미지">
        <ImageIcon className="w-4 h-4" />
      </button>

      <button onClick={insertBaeminTable} className="p-2 rounded hover:bg-gray-200" title="표 삽입">
        <TableIcon className="w-4 h-4" />
      </button>

      {/* Table Editing - only show when inside a table */}
      {editor.isActive("table") && (
        <>
          <button
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="위에 행 추가"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="아래에 행 추가"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="왼쪽에 열 추가"
          >
            <Plus className="w-4 h-4 rotate-90" />
          </button>

          <button
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="오른쪽에 열 추가"
          >
            <Plus className="w-4 h-4 rotate-90" />
          </button>

          <button
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-2 rounded hover:bg-gray-200 hover:bg-red-100"
            title="행 삭제"
          >
            <Minus className="w-4 h-4 text-red-600" />
          </button>

          <button
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-2 rounded hover:bg-gray-200 hover:bg-red-100"
            title="열 삭제"
          >
            <Minus className="w-4 h-4 rotate-90 text-red-600" />
          </button>

          <button
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-2 rounded hover:bg-gray-200 hover:bg-red-100"
            title="표 삭제"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </>
      )}

      <div className="w-px bg-gray-300 mx-1" />

      {/* Undo / Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200"
        title="실행 취소"
      >
        <Undo className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200"
        title="다시 실행"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px bg-gray-300 mx-1" />

      {/* Templates */}
      <button
        onClick={insertTemplate1}
        className="px-3 py-2 rounded bg-blue-50 hover:bg-blue-100 text-xs font-[Cafe24_Ssurround] text-blue-700"
        title="입양 안내 템플릿"
      >
        템플릿 1
      </button>

      <button
        onClick={insertTemplate2}
        className="px-3 py-2 rounded bg-green-50 hover:bg-green-100 text-xs font-[Cafe24_Ssurround] text-green-700"
        title="FAQ 템플릿"
      >
        템플릿 2
      </button>
    </div>
  );
}
