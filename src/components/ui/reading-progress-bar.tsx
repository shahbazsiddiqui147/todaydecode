"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100);
            }
        };

        window.addEventListener("scroll", updateProgress);
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div className="fixed top-16 left-0 w-full h-1 z-40">
            <div
                className="h-full bg-accent-red transition-all duration-200"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
