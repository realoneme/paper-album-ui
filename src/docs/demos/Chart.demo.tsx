import { ChartBar, ChartContainer, ChartLegend, type ChartConfig } from '@/components/ui/chart';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Chart', group: 'Data display', height: 300 };

/** Sample data. */
const sessions = [
  { month: 'January', sessions: 4 },
  { month: 'February', sessions: 6 },
  { month: 'March', sessions: 9 },
  { month: 'April', sessions: 12 },
  { month: 'May', sessions: 15 },
  { month: 'June', sessions: 18 },
  { month: 'July', sessions: 21 },
  { month: 'August', sessions: 19 },
  { month: 'September', sessions: 14 },
  { month: 'October', sessions: 16 },
  { month: 'November', sessions: 8 },
  { month: 'December', sessions: 5 },
];

const config = { sessions: { label: 'Sessions', color: 'var(--chart-3)' } } satisfies ChartConfig;
const highlight = { current: { label: 'This month', color: 'var(--chart-1)' } } satisfies ChartConfig;

export default function ChartDemo() {
  return (
    <div className="pa-panel" style={{ maxWidth: 640 }}>
      <ChartContainer
        config={config}
        title={
          <>
            Sessions per month <span className="pa-caption">(sample data)</span>
          </>
        }
        legend={<ChartLegend extra={highlight} />}
        summary="Sessions per month, sample data, peaking in July at 21; October highlighted at 16"
      >
        <ChartBar data={sessions} xKey="month" yKey="sessions" tickFormatter={(m) => m.slice(0, 1)} highlight={(d) => d.month === 'October'} />
      </ChartContainer>
    </div>
  );
}
