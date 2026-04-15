"use client";

export default function ArticleEditorError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-10">
            <div className="max-w-lg w-full space-y-6 p-8 border border-red-900/40 bg-red-950/10 rounded-3xl text-center">
                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500">
                        Editor Error
                    </p>
                    <h1 className="text-2xl font-black uppercase italic tracking-tighter text-white">
                        Failed to Load Article
                    </h1>
                    <p className="text-sm text-slate-400 font-mono leading-relaxed mt-2">
                        {error.message || "An unexpected error occurred while loading the editor."}
                    </p>
                    {error.digest && (
                        <p className="text-[10px] text-slate-600 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
                <div className="flex gap-3 justify-center pt-2">
                    <button
                        onClick={reset}
                        className="px-6 py-2 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-all"
                    >
                        Try Again
                    </button>
                    <a
                        href="/admin/articles/"
                        className="px-6 py-2 rounded-xl border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                    >
                        Back to Articles
                    </a>
                </div>
            </div>
        </div>
    );
}
