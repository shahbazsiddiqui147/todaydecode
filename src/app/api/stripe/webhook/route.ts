import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
    return NextResponse.json(
        {
            status: "DORMANT",
            message: "Institutional payment processing is currently in maintenance."
        },
        { status: 503 }
    );
}
