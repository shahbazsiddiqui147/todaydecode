"use client";

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface ForecastTrendProps {
    data: {
        month: string;
        likely: number;
        best: number;
        worst: number;
    }[];
}

export function ForecastTrend({ data }: ForecastTrendProps) {
    return (
        <div className="h-[400px] w-full bg-slate-900/30 border border-border-slate rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                        Predictive Trend Analysis
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                        Impact Divergence Forecast (12 Months)
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                    <XAxis
                        dataKey="month"
                        stroke="#64748b"
                        fontSize={10}
                        fontWeight="bold"
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        fontWeight="bold"
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#0A0F1E',
                            borderColor: '#1E293B',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '20px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="worst"
                        stroke="#FF4B4B"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Worst Case"
                    />
                    <Line
                        type="monotone"
                        dataKey="likely"
                        stroke="#EAB308"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#EAB308', strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                        name="Most Likely"
                    />
                    <Line
                        type="monotone"
                        dataKey="best"
                        stroke="#22C55E"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Best Case"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
