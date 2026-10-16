import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChartBar, ChartContainer, ChartLegend, type ChartConfig } from '@/components/ui/chart';

const data = [
  { month: 'January', sessions: 4 },
  { month: 'February', sessions: 6 },
  { month: 'March', sessions: 9 },
];
const config = { sessions: { label: 'Sessions', color: 'var(--chart-3)' } } satisfies ChartConfig;

describe('Chart', () => {
  it('gives the plot an accessible summary and a title', () => {
    render(
      <ChartContainer config={config} title="Sessions per month" summary="Sessions rise from 4 to 9" className="mine">
        <div />
      </ChartContainer>,
    );
    const figure = screen.getByRole('figure', { name: 'Sessions per month' });
    expect(figure).toHaveClass('pa-chart-frame', 'mine');
    expect(figure.style.getPropertyValue('--color-sessions')).toBe('var(--chart-3)');
    expect(screen.getByRole('img', { name: 'Sessions rise from 4 to 9' })).toBeInTheDocument();
  });

  it('renders a legend from the config plus extra entries', () => {
    render(
      <ChartContainer config={config} summary="s" legend={<ChartLegend extra={{ current: { label: 'This month', color: 'var(--chart-1)' } }} />}>
        <div />
      </ChartContainer>,
    );
    const items = screen.getAllByRole('listitem');
    expect(items.map((i) => i.textContent)).toEqual(['Sessions', 'This month']);
    expect(items[1]!.querySelector('.pa-chart-swatch')).toHaveStyle({ background: 'var(--chart-1)' });
  });

  it('draws one bar per datum in chart tokens, with the highlight in chart-1', () => {
    const { container } = render(
      <ChartContainer config={config} summary="s">
        <ChartBar
          data={data}
          xKey="month"
          yKey="sessions"
          width={400}
          height={200}
          animate={false}
          tickFormatter={(m) => m.slice(0, 1)}
          highlight={(d) => d.month === 'March'}
        />
      </ChartContainer>,
    );
    const bars = container.querySelectorAll('path.pa-chart-bar');
    expect(bars).toHaveLength(3);
    expect(bars[0]).toHaveAttribute('fill', 'var(--color-sessions, var(--chart-3))');
    expect(bars[2]).toHaveAttribute('fill', 'var(--chart-1)');
    expect(bars[2]).toHaveClass('hi');
    expect(screen.getByText('J')).toBeInTheDocument();
  });
});
