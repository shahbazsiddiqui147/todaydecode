"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Image as ImageIcon,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    Undo,
    Redo,
    Code,
    Share2
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { DiagramBlock } from "@/components/admin/Editor/extensions/DiagramBlock";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addImage = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
                const response = await fetch(
                    `/api/upload?filename=${encodeURIComponent(file.name)}`,
                    {
                        method: 'POST',
                        body: file,
                    }
                );

                if (!response.ok) throw new Error('Upload failed');

                const blob = await response.json();
                editor.chain().focus().setImage({ src: blob.url }).run();
            } catch (error) {
                console.error('[Strategic Editor Upload Error]:', error);
                alert("Failed to synchronize strategic asset.");
            }
        };
        input.click();
    };

    const setLink = () => {
        const url = window.prompt("Enter strategic source URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    const getBtnClass = (activeName: string, attrs?: any) => cn(
        "h-8 w-8 flex items-center justify-center rounded-md transition-all duration-200 outline-none focus:ring-2 focus:ring-[#22D3EE]/50",
        editor.isActive(activeName, attrs)
            ? "bg-[#22D3EE] text-[#020617] shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            : "text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800"
    );

    const Divider = () => <div className="w-px h-4 bg-slate-300 dark:bg-[#1E293B] mx-2" />;

    return (
        <div className="editor-toolbar flex flex-wrap items-center gap-1 p-2 border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-[#111827] sticky top-0 z-20 backdrop-blur-md rounded-t-2xl shadow-xl">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={getBtnClass("bold")}
                title="Bold (Ctrl+B)"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={getBtnClass("italic")}
                title="Italic (Ctrl+I)"
            >
                <Italic className="h-4 w-4" />
            </button>

            <Divider />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={getBtnClass("heading", { level: 1 })}
                title="Heading 1"
            >
                <Heading1 className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={getBtnClass("heading", { level: 2 })}
                title="Heading 2"
            >
                <Heading2 className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={getBtnClass("heading", { level: 3 })}
                title="Heading 3"
            >
                <Heading3 className="h-4 w-4" />
            </button>

            <Divider />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={getBtnClass("bulletList")}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={getBtnClass("orderedList")}
                title="Numbered List"
            >
                <ListOrdered className="h-4 w-4" />
            </button>

            <Divider />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={getBtnClass("blockquote")}
                title="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={addImage}
                className="h-8 w-8 flex items-center justify-center rounded-md text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all outline-none"
                title="Upload Image"
            >
                <ImageIcon className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={setLink}
                className={getBtnClass("link")}
                title="Insert Link"
            >
                <LinkIcon className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().insertContent({ type: 'diagramBlock' }).run()}
                className="flex items-center gap-2 px-3 h-8 rounded-md text-[#22D3EE] hover:bg-[#22D3EE]/10 transition-all border border-[#22D3EE]/30"
                title="Sovereign Structural Model"
            >
                <Share2 className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">Add Strategic Diagram</span>
            </button>

            <div className="ml-auto flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all opacity-60 hover:opacity-100 outline-none"
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="h-8 w-8 flex items-center justify-center rounded-md text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all opacity-60 hover:opacity-100 outline-none"
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export function RichTextEditor({ value, onChange, placeholder = "Synthesize strategic analysis..." }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false, // Handled by Heading extension below
            }),
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Image,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-accent-red underline underline-offset-4 font-bold"
                }
            }),
            Placeholder.configure({
                placeholder,
            }),
            DiagramBlock,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose dark:prose-invert max-w-none min-h-[500px] px-8 py-8 focus:outline-none font-serif text-lg leading-relaxed",
            },
        },
    });

    return (
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#020617] flex flex-col group focus-within:ring-1 focus-within:ring-slate-400 dark:focus-within:ring-[#22D3EE]/30 transition-all rounded-2xl overflow-hidden shadow-2xl">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} className="text-[#0F172A] dark:text-[#F1F5F9]" />
        </div>
    );
}
