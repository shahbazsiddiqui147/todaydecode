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
    Code
} from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const Toolbar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addImage = () => {
        const url = window.prompt("Enter Strategic Image URL:");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const setLink = () => {
        const url = window.prompt("Enter strategic source URL:");
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("h-8 w-8", editor.isActive("bold") && "bg-slate-200 dark:bg-slate-800")}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("h-8 w-8", editor.isActive("italic") && "bg-slate-200 dark:bg-slate-800")}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-200 dark:border-slate-800 mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={cn("h-8 w-8", editor.isActive("heading", { level: 1 }) && "bg-slate-200 dark:bg-slate-800")}
            >
                <Heading1 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("h-8 w-8", editor.isActive("heading", { level: 2 }) && "bg-slate-200 dark:bg-slate-800")}
            >
                <Heading2 className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn("h-8 w-8", editor.isActive("heading", { level: 3 }) && "bg-slate-200 dark:bg-slate-800")}
            >
                <Heading3 className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-200 dark:border-slate-800 mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("h-8 w-8", editor.isActive("bulletList") && "bg-slate-200 dark:bg-slate-800")}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("h-8 w-8", editor.isActive("orderedList") && "bg-slate-200 dark:bg-slate-800")}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-slate-200 dark:border-slate-800 mx-1" />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn("h-8 w-8", editor.isActive("blockquote") && "bg-slate-200 dark:bg-slate-800")}
            >
                <Quote className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={addImage}
                className="h-8 w-8"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={setLink}
                className={cn("h-8 w-8", editor.isActive("link") && "bg-slate-200 dark:bg-slate-800")}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>
            <div className="ml-auto flex gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="h-8 w-8"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="h-8 w-8"
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
        <div className="border border-slate-200 dark:border-slate-800 bg-transparent flex flex-col group focus-within:ring-1 focus-within:ring-slate-400 transition-all">
            <Toolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
