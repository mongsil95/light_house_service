"use client";

import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import { Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect } from "react";
import MenuBar from "./TipTapMenuBar";

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const CTAButton = Node.create({
    name: "ctaButton",
    inline: true,
    group: "inline",
    atom: true,
    selectable: true,
    draggable: false,
    addAttributes() {
      return {
        href: { default: null },
        label: { default: "버튼" },
        bg: { default: null },
        color: { default: null },
      };
    },
    parseHTML() {
      return [
        {
          tag: "a[data-cta]",
          getAttrs: (dom: any) => {
            const href = dom.getAttribute("href");
            const label = dom.textContent || null;
            const style = dom.getAttribute("style") || "";
            // try to extract background-color and color from inline style
            const bgMatch = /background-color:\s*([^;]+)/i.exec(style);
            const colorMatch = /color:\s*([^;]+)/i.exec(style);
            return {
              href: href || null,
              label: label || null,
              bg: bgMatch ? bgMatch[1].trim() : dom.style.backgroundColor || null,
              color: colorMatch ? colorMatch[1].trim() : dom.style.color || null,
            };
          },
        },
      ];
    },
    renderHTML({ HTMLAttributes }) {
      const { href, label, bg, color } = HTMLAttributes as any;
      const styleParts: string[] = [];
      if (bg) styleParts.push(`background-color: ${bg}`);
      if (color) styleParts.push(`color: ${color}`);
      const style = styleParts.length ? styleParts.join("; ") : undefined;
      const attrs: any = {
        href: href || undefined,
        "data-cta": "1",
        class:
          "inline-block px-5 py-2 rounded-md text-base font-semibold no-underline shadow-sm hover:opacity-95",
      };
      if (style) attrs.style = style;
      // default background if none provided
      if (!bg) attrs.class = attrs.class + " bg-[#2ac1bc] text-white";
      return ["a", attrs, label || "버튼"];
    },
    // Commands handled via editor.chain() in the MenuBar; no custom
    // typed commands here to avoid TypeScript mismatches.
  });
  const handleUpdate = useCallback(
    ({ editor }: any) => {
      const html = editor.getHTML();
      if (html !== content) {
        onChange(html);
      }
    },
    [onChange, content]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      CTAButton,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#2ac1bc] underline hover:text-[#25a8a4]",
        },
      }),
      Image,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "w-full border-collapse",
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-3",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-gray-300 p-3 bg-[#e4e6e8] font-bold",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      TextStyle,
    ],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none h-[500px] overflow-y-auto px-4 py-3 font-sans text-sm",
      },
    },
    onUpdate: handleUpdate,
  });

  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(content, { emitUpdate: false });
      editor.commands.setTextSelection({ from, to });
    }
  }, [content, editor]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <style jsx>{`
        .tiptap-editor :global(.ProseMirror) {
          line-height: 1.8 !important;
        }
        .tiptap-editor :global(.ProseMirror p) {
          margin: 16px 0 !important;
          line-height: 1.8 !important;
        }
        .tiptap-editor :global(.ProseMirror h1) {
          line-height: 1.4 !important;
          margin: 32px 0 16px !important;
        }
        .tiptap-editor :global(.ProseMirror h2) {
          line-height: 1.4 !important;
          margin: 32px 0 16px !important;
        }
        .tiptap-editor :global(.ProseMirror h3) {
          line-height: 1.4 !important;
          margin: 24px 0 12px !important;
        }
        .tiptap-editor :global(.ProseMirror ul),
        .tiptap-editor :global(.ProseMirror ol) {
          margin: 16px 0 !important;
        }
        .tiptap-editor :global(.ProseMirror li) {
          margin: 8px 0 !important;
          line-height: 1.8 !important;
        }
      `}</style>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <MenuBar editor={editor} />
      </div>
      <div className="tiptap-editor">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
