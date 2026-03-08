"use client";

import { useState } from "react";
import { Upload, X, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadInstitutionalAsset } from "@/lib/actions/upload-actions";
import { toast } from "sonner";

interface UploadNodeProps {
    label: string;
    currentUrl?: string;
    onUploadComplete: (url: string) => void;
}

export function UploadNode({ label, currentUrl, onUploadComplete }: UploadNodeProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState(currentUrl || "");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Visual Feedback
        setIsUploading(true);
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await uploadInstitutionalAsset(formData);
            if (res.success && res.url) {
                setPreview(res.url);
                onUploadComplete(res.url);
                toast.success("Asset verified and stored.");
            } else {
                toast.error(res.error || "Uplink rejected.");
                setPreview(currentUrl || "");
            }
        } catch (error) {
            toast.error("Network reconciliation failure.");
            setPreview(currentUrl || "");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#64748B] dark:text-[#94A3B8] pl-1">{label}</label>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Upload Zone */}
                <div className="md:col-span-8 group relative">
                    <div className="h-32 border-2 border-dashed border-[#1E293B] rounded-2xl bg-[#020617] flex flex-col items-center justify-center transition-all group-hover:border-[#22D3EE]/50 group-hover:bg-[#020617]/80">
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-6 w-6 text-[#22D3EE] animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#F1F5F9] animate-pulse">Reconciling Nodes...</span>
                            </div>
                        ) : (
                            <label className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                <Upload className="h-6 w-6 text-[#64748B] group-hover:text-[#22D3EE] transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B] group-hover:text-[#F1F5F9]">Select Global Asset</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Preview Pane */}
                <div className="md:col-span-4">
                    <div className="h-32 border border-[#1E293B] rounded-2xl bg-[#020617] flex items-center justify-center relative overflow-hidden group">
                        {preview ? (
                            <>
                                <img src={preview} alt="Branding Preview" className="max-h-24 max-w-[80%] object-contain" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-[#22D3EE]" />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-1 opacity-20">
                                <ImageIcon className="h-6 w-6 text-[#64748B]" />
                                <span className="text-[8px] font-black uppercase tracking-widest">No Asset</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
