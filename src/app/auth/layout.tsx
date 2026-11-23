import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
    title: "Account",
    description: "Sign in or create a Today Decode account.",
    noIndex: true,
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return children;
}
