import React from 'react';

interface LineChartProps {
    data: { label: string; value: number }[];
    height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, height = 240 }) => {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = 600;
    const chartHeight = height;
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    const xStep = innerWidth / (data.length - 1);
    const points = data.map((d, i) => {
        const x = padding.left + i * xStep;
        const normalizedValue = (d.value - minValue) / range;
        const y = padding.top + innerHeight - (normalizedValue * innerHeight);
        return { x, y, value: d.value, label: d.label };
    });

    const pathD = points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');

    const lastPoint = points[points.length - 1];
    const areaPathD = lastPoint
        ? `${pathD} L ${lastPoint.x} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`
        : pathD;

    return (
        <div className="w-full h-full">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => {
                    const y = padding.top + (innerHeight / 4) * i;
                    const value = maxValue - (range / 4) * i;
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

                {/* Area gradient */}
                <defs>
                    <linearGradient id="lineChartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* Area under line */}
                <path
                    d={areaPathD}
                    fill="url(#lineChartGradient)"
                    className="transition-all duration-500"
                />

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="rgb(99, 102, 241)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                />

                {/* Data points */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r="5"
                            fill="white"
                            stroke="rgb(99, 102, 241)"
                            strokeWidth="2"
                            className="transition-all duration-300 hover:r-7 cursor-pointer"
                        />
                        <title>{`${p.label}: ${p.value}`}</title>
                    </g>
                ))}

                {/* X-axis labels */}
                {points.map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={chartHeight - padding.bottom + 20}
                        textAnchor="middle"
                        className="text-xs fill-secondary-600 dark:fill-secondary-400"
                    >
                        {p.label}
                    </text>
                ))}
            </svg>
        </div>
    );
};
