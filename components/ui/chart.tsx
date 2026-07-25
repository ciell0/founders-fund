// components/ui/chart.tsx
import * as React from "react";

interface ChartDataPoint {
  label: string;
  value: number;
  income?: number;
  expense?: number;
}

interface CashFlowChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar';
}

export function CashFlowChart({ data, type = 'line' }: CashFlowChartProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/20 text-zinc-500 text-sm">
        Belum ada data untuk ditampilkan.
      </div>
    );
  }

  // Dimension helpers
  const width = 600;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find boundaries
  const values = data.map(d => d.value);
  const incomes = data.map(d => d.income || 0);
  const expenses = data.map(d => d.expense || 0);
  const allNumbers = type === 'line' ? values : [...incomes, ...expenses];
  
  let maxValue = Math.max(...allNumbers, 1000000); // default minimum ceiling
  let minValue = Math.min(...allNumbers, 0);

  // Buffer at top/bottom
  const range = maxValue - minValue;
  maxValue += range * 0.1;
  if (minValue < 0) {
    minValue -= range * 0.1;
  }

  const getY = (val: number) => {
    const scale = (val - minValue) / (maxValue - minValue);
    return height - paddingBottom - scale * chartHeight;
  };

  const getX = (index: number) => {
    if (data.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  // Generate grid lines
  const gridLinesCount = 4;
  const gridLines = Array.from({ length: gridLinesCount + 1 }).map((_, i) => {
    const value = minValue + (i / gridLinesCount) * (maxValue - minValue);
    return {
      value,
      y: getY(value),
    };
  });

  // SVG Line path generation
  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.value)}`)
    .join(" ");

  // SVG Area path generation (for gradient fill below the line)
  const areaPath = data.length > 0
    ? `${linePath} L ${getX(data.length - 1)} ${getY(Math.max(0, minValue))} L ${getX(0)} ${getY(Math.max(0, minValue))} Z`
    : "";

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000_000) {
      return `Rp ${(val / 1_000_000_000).toFixed(1)}M`;
    }
    if (val >= 1_000_000) {
      return `Rp ${(val / 1_000_000).toFixed(0)}jt`;
    }
    if (val >= 1000) {
      return `Rp ${(val / 1000).toFixed(0)}rb`;
    }
    return `Rp ${val}`;
  };

  return (
    <div className="relative w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradients */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Grid lines & Y axis labels */}
        {gridLines.map((line, i) => (
          <g key={i} className="opacity-40">
            <line
              x1={paddingLeft}
              y1={line.y}
              x2={width - paddingRight}
              y2={line.y}
              stroke="#27272a"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
            <text
              x={paddingLeft - 8}
              y={line.y + 4}
              textAnchor="end"
              className="fill-zinc-500 text-[10px] font-medium"
            >
              {formatCurrency(line.value)}
            </text>
          </g>
        ))}

        {/* Line Chart Style */}
        {type === "line" && (
          <>
            {/* Area under the line */}
            <path d={areaPath} fill="url(#chartGradient)" />

            {/* The trend line */}
            <path
              d={linePath}
              fill="none"
              stroke="#a78bfa"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Interactive vertical hover line */}
            {hoveredIndex !== null && (
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={height - paddingBottom}
                stroke="#6d28d9"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}

            {/* Data nodes */}
            {data.map((d, i) => (
              <g
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={getX(i)}
                  cy={getY(d.value)}
                  r={hoveredIndex === i ? "6" : "4"}
                  fill={hoveredIndex === i ? "#c084fc" : "#8b5cf6"}
                  stroke="#09090b"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
                {/* Transparent hit area for hover */}
                <circle
                  cx={getX(i)}
                  cy={getY(d.value)}
                  r="15"
                  fill="transparent"
                />
              </g>
            ))}
          </>
        )}

        {/* Bar Chart Style (Income vs Expense) */}
        {type === "bar" && (
          <g>
            {data.map((d, i) => {
              const count = data.length;
              const colWidth = chartWidth / count;
              const barWidth = Math.max(colWidth * 0.35, 6);
              const spacing = colWidth * 0.08;

              const xCenter = paddingLeft + i * colWidth + colWidth / 2;
              const xInc = xCenter - barWidth - spacing / 2;
              const xExp = xCenter + spacing / 2;

              const incValue = d.income || 0;
              const expValue = d.expense || 0;

              const yZero = getY(0);
              const yInc = getY(incValue);
              const yExp = getY(expValue);

              const hInc = Math.max(Math.abs(yZero - yInc), 2);
              const hExp = Math.max(Math.abs(yZero - yExp), 2);

              return (
                <g 
                  key={i} 
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Income Bar */}
                  <rect
                    x={xInc}
                    y={incValue >= 0 ? yInc : yZero}
                    width={barWidth}
                    height={hInc}
                    rx="2"
                    fill="url(#incomeGradient)"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="transition-all duration-200 hover:opacity-100 opacity-90"
                  />
                  {/* Expense Bar */}
                  <rect
                    x={xExp}
                    y={expValue >= 0 ? yExp : yZero}
                    width={barWidth}
                    height={hExp}
                    rx="2"
                    fill="url(#expenseGradient)"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    className="transition-all duration-200 hover:opacity-100 opacity-90"
                  />
                  {/* Hover Hit Box */}
                  <rect
                    x={paddingLeft + i * colWidth}
                    y={paddingTop}
                    width={colWidth}
                    height={chartHeight}
                    fill="transparent"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* X axis labels */}
        {data.map((d, i) => {
          // If many items, only show some labels to avoid overlapping
          const modulo = Math.ceil(data.length / 6);
          if (i % modulo !== 0 && i !== data.length - 1) return null;

          const labelX = type === 'line' 
            ? getX(i) 
            : paddingLeft + i * (chartWidth / data.length) + (chartWidth / data.length) / 2;

          return (
            <text
              key={i}
              x={labelX}
              y={height - paddingBottom + 18}
              textAnchor="middle"
              className="fill-zinc-400 text-[10px] font-medium"
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* Floating HTML tooltip */}
      {hoveredIndex !== null && (
        <div
          className="absolute z-10 p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/90 text-xs text-zinc-100 shadow-xl pointer-events-none backdrop-blur-sm transition-opacity duration-150"
          style={{
            left: `${((getX(hoveredIndex) / width) * 100).toFixed(1)}%`,
            top: "20px",
            transform: "translateX(-50%)",
          }}
        >
          <div className="font-semibold text-zinc-300 mb-1">{data[hoveredIndex].label}</div>
          {type === 'line' ? (
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span>Balance: <span className="font-bold text-white">{formatCurrency(data[hoveredIndex].value)}</span></span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Pemasukan: <span className="font-bold text-emerald-400">{formatCurrency(data[hoveredIndex].income || 0)}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Pengeluaran: <span className="font-bold text-rose-400">{formatCurrency(data[hoveredIndex].expense || 0)}</span></span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
