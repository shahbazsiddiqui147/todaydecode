import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

interface QuickAnswersProps {
    faqData: FAQItem[];
}

export function QuickAnswers({ faqData }: QuickAnswersProps) {
    if (!faqData || faqData.length === 0) return null;

    return (
        <section
            className="aeo-qa-section bg-[#111827] border border-[#1E293B] rounded-3xl p-8 my-10 relative overflow-hidden"
            aria-label="Strategic Q&A"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-red/5 blur-[100px]" />
            <div className="flex items-center space-x-4 mb-10 border-b border-[#1E293B] pb-6 relative z-10">
                <div className="bg-accent-red/10 p-3 rounded-xl border border-accent-red/20 shadow-[0_0_15px_rgba(255,75,75,0.1)]">
                    <ShieldCheck className="h-6 w-6 text-accent-red" />
                </div>
                <div>
                    <h2 className="text-md font-black text-[#F1F5F9] uppercase tracking-tighter">
                        Institutional Strategic Analysis Desk Q&A
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] mt-1.5 flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                        AEO Optimized Assessment // Structural Discovery
                    </p>
                </div>
            </div>

            <div className="space-y-8">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className="group"
                        itemScope
                        itemType="https://schema.org/Question"
                    >
                        <h3
                            className="text-lg font-black text-[#22D3EE] tracking-tighter mb-4 group-hover:text-white transition-colors uppercase italic"
                            itemProp="name"
                        >
                            {item.question}
                        </h3>
                        <div
                            itemScope
                            itemType="https://schema.org/Answer"
                            itemProp="acceptedAnswer"
                            className="relative pl-6"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#22D3EE] to-transparent" />
                            <p
                                className="text-[#F1F5F9] text-[15px] font-medium leading-[1.75] max-w-2xl"
                                itemProp="text"
                            >
                                {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
