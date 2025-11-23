"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  className = "",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value prop changes (for edit mode)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  // Simple word count from editor text content
  const text = editor.getText();
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className={cn("rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900", className)}>
      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 flex gap-1 rounded-t-xl">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("bold")
              ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("italic")
              ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            editor.isActive("underline")
              ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
          )}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </button>

        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 my-auto mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            editor.isActive("bulletList")
              ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-slate-200 dark:hover:bg-slate-700",
            editor.isActive("orderedList")
              ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white"
              : "text-slate-600 dark:text-slate-400"
          )}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />

      {/* Word Count (optional) */}
      {wordCount > 0 && (
        <div className="px-4 py-2 text-right text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-700">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </div>
      )}
    </div>
  );
}
