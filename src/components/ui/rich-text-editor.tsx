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
import { MermaidBlock } from "@/components/admin/Editor/extensions/MermaidNode";

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

    return (
        <div className="editor-toolbar flex flex-wrap items-center gap-1 p-2 border-b border-[#334155] bg-slate-100 dark:bg-[#111827] sticky top-0 z-10 backdrop-blur-sm text-slate-600 dark:text-[#F1F5F9]">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("bold")
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("italic")
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-300 dark:bg-[#334155] mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("heading", { level: 1 })
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("heading", { level: 2 })
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("heading", { level: 3 })
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <Heading3 className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-300 dark:bg-[#334155] mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("bulletList")
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("orderedList")
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-300 dark:bg-[#334155] mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("blockquote")
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={addImage}
                className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-[#1E293B]"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={setLink}
                className={cn(
                    "h-8 w-8 transition-all",
                    editor.isActive("link")
                        ? "bg-[#22D3EE] text-[#0A0F1E] hover:bg-[#22D3EE]/90"
                        : "hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                )}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().insertContent({ type: 'mermaidBlock' }).run()}
                className="h-8 w-8 text-[#22D3EE] hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                title="Insert Structural Diagram (Mermaid)"
            >
                <Share2 className="h-4 w-4" />
            </Button>
            <div className="ml-auto flex gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="h-8 w-8 hover:bg-slate-200 dark:hover:bg-[#1E293B]"
                >
                    <Redo className="h-4 w-4" />
                </Button>
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
            MermaidBlock,
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
