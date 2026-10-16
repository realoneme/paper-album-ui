import '@/styles/extra/chart.css';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, Rectangle, Tooltip, XAxis, YAxis, type BarShapeProps, type TooltipContentProps } from 'recharts';
import { cn } from '@/lib/cn';

/** Series configuration, as in shadcn: each key gets a label and a colour token (for example `var(--chart-3)`). */
export type ChartConfig = Record<string, { label: React.ReactNode; color: string }>;

const ChartConfigContext = React.createContext<ChartConfig>({});
export function useChartConfig() {
  return React.useContext(ChartConfigContext);
}

export interface ChartContainerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  config: ChartConfig;
  /** One sentence that states what the chart shows; it is the plot's accessible name. */
  summary: string;
  title?: React.ReactNode;
  /** Legend or other controls shown next to the title. */
  legend?: React.ReactNode;
}

/**
 * The frame for a chart: title, legend and the plot. Exposes each config key as `--color-<key>`
 * and gives the plot `role="img"` with the summary as its name.
 */
export const ChartContainer = React.forwardRef<HTMLElement, ChartContainerProps>(
  ({ config, summary, title, legend, className, style, children, ...props }, ref) => {
    const titleId = React.useId();
    const vars = Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color]));
    return (
      <ChartConfigContext.Provider value={config}>
        <figure
          ref={ref}
          aria-labelledby={title ? titleId : undefined}
          className={cn('pa-chart-frame', className)}
          style={{ ...vars, ...style }}
          {...props}
        >
          {title || legend ? (
            <div className="pa-chart-head">
              {title ? <div id={titleId} className="pa-chart-title">{title}</div> : <span />}
              {legend}
            </div>
          ) : null}
          <div className="pa-chart-plot" role="img" aria-label={summary}>
            {children}
          </div>
        </figure>
      </ChartConfigContext.Provider>
    );
  },
);
ChartContainer.displayName = 'ChartContainer';

export interface ChartLegendProps extends React.HTMLAttributes<HTMLUListElement> {
  /** Extra entries not in the config, for example a highlighted value. */
  extra?: ChartConfig;
}
/** A legend built from the container's config. */
export const ChartLegend = React.forwardRef<HTMLUListElement, ChartLegendProps>(({ className, extra, ...props }, ref) => {
  const config = useChartConfig();
  const entries = Object.entries({ ...config, ...extra });
  return (
    <ul ref={ref} className={cn('pa-chart-legend', className)} {...props}>
      {entries.map(([key, item]) => (
        <li key={key}>
          <span className="pa-chart-swatch" style={{ background: item.color }} aria-hidden />
          {item.label}
        </li>
      ))}
    </ul>
  );
});
ChartLegend.displayName = 'ChartLegend';

type Datum = Record<string, string | number>;

function ChartTooltipContent({ active, payload, label }: TooltipContentProps) {
  const config = useChartConfig();
  if (!active || !payload?.length) return null;
  return (
    <div className="pa-pop pa-chart-tooltip">
      <b>{label}</b>
      {payload.map((entry) => {
        const key = String(entry.dataKey ?? entry.name ?? '');
        return (
          <div key={key}>
            {config[key]?.label ?? entry.name}: {entry.value}
          </div>
        );
      })}
    </div>
  );
}

export interface ChartBarProps<T extends Datum> {
  data: T[];
  /** Category key for the x axis. */
  xKey: keyof T & string;
  /** Value key; colour comes from `config[yKey].color` via `--color-<yKey>`. */
  yKey: keyof T & string;
  /** Returns true for bars drawn in the highlight colour. */
  highlight?: (datum: T, index: number) => boolean;
  /** Highlight colour token. Default `var(--chart-1)`. */
  highlightColor?: string;
  /** Formats x-axis ticks, for example (month) => month.slice(0, 1). */
  tickFormatter?: (value: string) => string;
  /** Plot height in px. Default 200. */
  height?: number;
  /** Fixed width in px; omit to fill the container (responsive). */
  width?: number;
  showYAxis?: boolean;
  showTooltip?: boolean;
  animate?: boolean;
}

/** A simple bar chart in the chart tokens: bars `--color-<yKey>`, highlighted bars `--chart-1`. Use inside ChartContainer. */
export function ChartBar<T extends Datum>({
  data,
  xKey,
  yKey,
  highlight,
  highlightColor = 'var(--chart-1)',
  tickFormatter,
  height = 200,
  width,
  showYAxis = false,
  showTooltip = true,
  animate = true,
}: ChartBarProps<T>) {
  const fill = `var(--color-${yKey}, var(--chart-3))`;
  const xDataKey: string = xKey;
  const yDataKey: string = yKey;
  const sizing = width ? { width, height } : { responsive: true, style: { width: '100%', height } };
  return (
    <BarChart data={data as Datum[]} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} barCategoryGap="14%" {...sizing}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey={xDataKey} tickLine={false} axisLine={{ stroke: 'var(--border)' }} interval={0} tickMargin={6} tickFormatter={tickFormatter ? (value: string | number) => tickFormatter(String(value)) : undefined} />
      {showYAxis ? <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} /> : null}
      {showTooltip ? <Tooltip cursor content={(props: TooltipContentProps) => <ChartTooltipContent {...props} />} /> : null}
      <Bar
        dataKey={yDataKey}
        radius={[4, 4, 0, 0]}
        isAnimationActive={animate}
        shape={(props: BarShapeProps) => {
          const datum = data[props.index];
          const hi = datum !== undefined && highlight ? highlight(datum, props.index) : false;
          return <Rectangle {...props} fill={hi ? highlightColor : fill} className={cn('pa-chart-bar', hi && 'hi')} />;
        }}
      />
    </BarChart>
  );
}
ChartBar.displayName = 'ChartBar';
