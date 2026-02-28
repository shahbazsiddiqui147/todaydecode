import { PrismaClient } from '@prisma/client';
import { cache } from 'react';

const prisma = new PrismaClient();

export interface LiveMetric {
    label: string;
    value: number;
    trend: number;
    unit?: string;
    status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

/**
 * MOCK SERVICE for Intelligence Data
 * In production, these would fetch from real financial/geopolitical APIs
 * using Next.js force-revalidate (ISR)
 */

export const getBrentCrudePrice = cache(async (): Promise<LiveMetric> => {
    // Simulating an API call with revalidation logic
    // const res = await fetch('https://api.example.com/oil', { next: { revalidate: 3600 } });

    return {
        label: "Brent Crude Oil",
        value: 84.32,
        trend: 1.2,
        unit: "USD/bbl",
        status: 'MEDIUM'
    };
});

export const getGlobalRiskIndex = cache(async (): Promise<LiveMetric> => {
    return {
        label: "Global Risk Index",
        value: 72,
        trend: 4.5,
        status: 'HIGH'
    };
});

export const getConflictIntensity = cache(async (): Promise<LiveMetric> => {
    // In a real scenario, this might be an average of risk scores from the Article table
    return {
        label: "Conflict Intensity",
        value: 85,
        trend: -2.1,
        status: 'CRITICAL'
    };
});

export const getGlobalInflation = cache(async (): Promise<LiveMetric> => {
    return {
        label: "Global Inflation",
        value: 3.4,
        trend: 0.1,
        unit: "%",
        status: 'LOW'
    };
});

export async function getDashboardMetrics() {
    const [oil, risk, conflict, inflation] = await Promise.all([
        getBrentCrudePrice(),
        getGlobalRiskIndex(),
        getConflictIntensity(),
        getGlobalInflation()
    ]);

    return {
        oil,
        risk,
        conflict,
        inflation
    };
}
