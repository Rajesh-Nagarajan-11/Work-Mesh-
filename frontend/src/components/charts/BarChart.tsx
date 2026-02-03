import React from 'react';

interface BarChartProps {
    data: { label: string; value: number; color?: string }[];
    height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, height = 240 }) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const padding = { top: 20, right: 20, bottom: 60, left: 50 };
    const chartWidth = 600;
    const chartHeight = height;
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    const barWidth = innerWidth / data.length * 0.7;
    const spacing = innerWidth / data.length;

    const colors = [
        'rgb(99, 102, 241)',   // primary blue
        'rgb(234, 88, 12)',    // orange
        'rgb(34, 197, 94)',    // green
        'rgb(239, 68, 68)',    // red
        'rgb(168, 85, 247)',   // purple
        'rgb(236, 72, 153)',   // pink
        'rgb(14, 165, 233)',   // sky
        'rgb(251, 146, 60)',   // amber
    ];

    return (
        <div className="w-full h-full">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => {
                    const y = padding.top + (innerHeight / 4) * i;
                    const value = maxValue - (maxValue / 4) * i;
                    return (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={chartWidth - padding.right}
                                y2={y}
                                stroke="currentColor"
                                className="stroke-secondary-200 dark:stroke-slate-700"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                className="text-xs fill-secondary-500 dark:fill-secondary-400"
                            >
                                {Math.round(value)}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const x = padding.left + i * spacing + (spacing - barWidth) / 2;
                    const barHeight = (d.value / maxValue) * innerHeight;
                    const y = padding.top + innerHeight - barHeight;
                    const color = d.color || colors[i % colors.length];

                    return (
                        <g key={i}>
                            {/* Bar with gradient */}
                            <defs>
                                <linearGradient id={`barGradient${i}`} x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                                    <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                                </linearGradient>
                            </defs>

                            <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={`url(#barGradient${i})`}
                                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                rx="4"
                            >
                                <title>{`${d.label}: ${d.value}`}</title>
                            </rect>

                            {/* Value on top */}
                            <text
                                x={x + barWidth / 2}
                                y={y - 5}
                                textAnchor="middle"
                                className="text-xs font-semibold fill-secondary-700 dark:fill-secondary-300"
                            >
                                {d.value}
                            </text>

                            {/* Label */}
                            <text
                                x={x + barWidth / 2}
                                y={chartHeight - padding.bottom + 15}
                                textAnchor="middle"
                                className="text-xs fill-secondary-600 dark:fill-secondary-400"
                            >
                                {d.label.length > 8 ? d.label.substring(0, 8) + '...' : d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
