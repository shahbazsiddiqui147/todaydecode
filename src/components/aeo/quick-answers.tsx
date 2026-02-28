import React from 'react';
import { HelpCircle } from 'lucide-react';

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
            className="aeo-qa-section bg-slate-900 border border-slate-800 rounded-2xl p-8 my-10"
            aria-label="Intelligence Q&A"
        >
            <div className="flex items-center space-x-3 mb-8 border-b border-border-slate pb-4">
                <div className="bg-accent-red/20 p-2 rounded-lg">
                    <HelpCircle className="h-5 w-5 text-accent-red" />
                </div>
                <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.2em]">
                        Strategic Intelligence Q&A
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                        Optimized for AI Read-Aloud & Snippet Extraction
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
                            className="text-lg font-black text-white tracking-tight mb-3 group-hover:text-accent-red transition-colors"
                            itemProp="name"
                        >
                            {item.question}
                        </h3>
                        <div
                            itemScope
                            itemType="https://schema.org/Answer"
                            itemProp="acceptedAnswer"
                        >
                            <p
                                className="text-slate-400 text-base leading-relaxed max-w-2xl"
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
