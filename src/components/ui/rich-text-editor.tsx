"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import { 
    Bold as BoldIcon, 
    Italic as ItalicIcon, 
    Underline as UnderlineIcon, 
    Heading2, 
    Heading3, 
    List, 
    ListOrdered, 
    Quote, 
    Link as LinkIcon, 
    Undo2, 
    Redo2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) return;

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const buttons = [
        {
            icon: BoldIcon,
            title: "Bold",
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive("bold"),
        },
        {
            icon: ItalicIcon,
            title: "Italic",
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive("italic"),
        },
        {
            icon: UnderlineIcon,
            title: "Underline",
            action: () => editor.chain().focus().toggleUnderline().run(),
            isActive: () => editor.isActive("underline"),
        },
        {
            icon: Heading2,
            title: "Heading 2",
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive("heading", { level: 2 }),
        },
        {
            icon: Heading3,
            title: "Heading 3",
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive("heading", { level: 3 }),
        },
        {
            icon: List,
            title: "Bullet List",
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: () => editor.isActive("bulletList"),
        },
        {
            icon: ListOrdered,
            title: "Ordered List",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: () => editor.isActive("orderedList"),
        },
        {
            icon: Quote,
            title: "Blockquote",
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: () => editor.isActive("blockquote"),
        },
        {
            icon: LinkIcon,
            title: "Link",
            action: setLink,
            isActive: () => editor.isActive("link"),
        },
        {
            icon: Undo2,
            title: "Undo",
            action: () => editor.chain().focus().undo().run(),
            isActive: () => false,
            disabled: () => !editor.can().undo(),
        },
        {
            icon: Redo2,
            title: "Redo",
            action: () => editor.chain().focus().redo().run(),
            isActive: () => false,
            disabled: () => !editor.can().redo(),
        },
    ];

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0F172A] border-b border-[#1E293B]">
            {buttons.map((btn, i) => (
                <button
                    key={i}
                    type="button"
                    onClick={btn.action}
                    disabled={btn.disabled?.()}
                    className={cn(
                        "p-2 rounded-lg transition-all hover:bg-[#1E293B] hover:text-[#22D3EE]",
                        btn.isActive() ? "bg-[#1E293B] text-[#22D3EE]" : "text-[#64748B]",
                        btn.disabled?.() && "opacity-30 cursor-not-allowed"
                    )}
                    title={btn.title}
                >
                    <btn.icon className="h-4 w-4" />
                </button>
            ))}
        </div>
    );
};

export default function RichTextEditor({ 
    content, 
    onChange, 
    placeholder = "Start writing...", 
    minHeight = "300px" 
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                orderedList: false,
                blockquote: false,
                bold: false,
                italic: false,
            }),
            Heading.configure({ levels: [2, 3] }),
            BulletList,
            OrderedList,
            Blockquote,
            Bold,
            Italic,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-[#22D3EE] underline font-bold",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-invert max-w-none focus:outline-none min-h-full",
                    "prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic prose-headings:text-[#F1F5F9]",
                    "prose-p:text-[#CBD5E1] prose-p:leading-relaxed",
                    "prose-li:text-[#CBD5E1]"
                ),
            },
        },
    });

    // Update editor content when content prop changes (e.g. when loading existing data)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={cn(
            "group rounded-2xl overflow-hidden border border-[#1E293B] bg-[#020617] transition-all",
            "focus-within:ring-2 focus-within:ring-[#22D3EE] focus-within:border-transparent"
        )}>
            <MenuBar editor={editor} />
            <div 
                className="overflow-y-auto w-full p-4" 
                style={{ minHeight }}
                onClick={() => editor?.chain().focus().run()}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
