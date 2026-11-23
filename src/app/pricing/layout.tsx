import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Pricing",
    description: "Public analysis and editorial membership for Today Decode strategic research.",
    path: "/pricing/",
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
