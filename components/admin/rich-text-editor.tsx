"use client";

import { useEffect } from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

type Props = {
  label: string;
  value: JSONContent;
  onChange: (next: JSONContent) => void;
};

const defaultDoc: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function RichTextEditor({ label, value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value ?? defaultDoc,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none min-h-[220px] rounded-b-xl border border-slate-200 bg-white px-3 py-2.5 focus:outline-none",
      },
    },
    onUpdate: ({ editor: nextEditor }) => onChange(nextEditor.getJSON()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  async function insertImage() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async () => {
      const file = fileInput.files?.[0];
      if (!file || !editor) return;
      const fd = new FormData();
      fd.set("image", file);
      const res = await fetch("/api/blogs/upload-image", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        alert(data.error ?? "Upload failed");
        return;
      }
      editor.chain().focus().setImage({ src: data.url }).run();
    };
    fileInput.click();
  }

  if (!editor) return null;

  const btn = "rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:bg-slate-50";
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-800">{label}</label>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
          <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
          <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
          <button type="button" className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
          <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullets</button>
          <button type="button" className={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}>Numbers</button>
          <button
            type="button"
            className={btn}
            onClick={() => {
              const href = window.prompt("Enter URL");
              if (!href) return;
              editor.chain().focus().setLink({ href }).run();
            }}
          >
            Link
          </button>
          <button type="button" className={btn} onClick={insertImage}>Image</button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

export const EMPTY_EDITOR_DOC: JSONContent = defaultDoc;
