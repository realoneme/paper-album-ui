# Chart

Bars and lines drawn in the chart tokens: default bars `chart-3`, the highlighted value `chart-1`, extra series `chart-2`, `chart-4`, `chart-5`.

- Consumer provides: data, a title, a legend when there is more than one series, an accessible summary sentence.
- React: `ChartContainer` (`config` of `{ key: { label, color } }` exposed as `--color-<key>`, `title`, `legend`, `summary` = the plot's accessible name), `ChartLegend` (from the config, plus `extra` entries), `ChartBar` (Recharts v3 bar chart: `data`, `xKey`, `yKey`, `highlight`, `tickFormatter`, `height`, optional fixed `width`). For other Recharts charts, colour series with `var(--color-<key>)` inside `ChartContainer`. The simple CSS bars remain as `pa-chart`.

```tsx
const config = { sessions: { label: 'Sessions', color: 'var(--chart-3)' } } satisfies ChartConfig;

<ChartContainer config={config} title="Sessions per month" legend={<ChartLegend />}
  summary="Sessions per month, peaking in July at 21">
  <ChartBar data={data} xKey="month" yKey="sessions" highlight={(d) => d.month === 'October'} />
</ChartContainer>
```
