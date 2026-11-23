import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Submit Your Analysis",
    description: "Submit original strategic analysis for editorial review. Share geopolitics, security, and economic research with Today Decode readers.",
    path: "/contributors/submit/",
});

export default function SubmitArticleLayout({ children }: { children: React.ReactNode }) {
    return children;
}
