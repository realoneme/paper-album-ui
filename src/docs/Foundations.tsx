import { THEMES, resolveColor, tokens } from '@/tokens/resolve';

interface Style { name: string; fontSize: string; lineHeight: string | number; fontWeight: number | string; letterSpacing?: string; fontStyle?: string; family?: string; sample?: string; usage?: string }
interface Group { name: string; family: string; note?: string; styles: Style[] }

export function ColorTable() {
  return (
    <div className="table-scroll">
      <table className="colors">
        <thead>
          <tr>
            <th scope="col">Token</th>
            {THEMES.map((t) => <th scope="col" key={t.id}>{t.name}</th>)}
            <th scope="col">Usage</th>
          </tr>
        </thead>
        <tbody>
          {tokens.color.tokens.map((tok) => (
            <tr key={tok.name}>
              <th scope="row"><code>--{tok.name}</code></th>
              {THEMES.map((t) => (
                <td key={t.id}>
                  <span className="sw-wrap" data-theme={t.id}><span className="sw" style={{ background: `var(--${tok.name})` }} /></span>
                  <code>{resolveColor(tok.name, t.id)}</code>
                </td>
              ))}
              <td className="usage">{tok.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TypeScale() {
  return (
    <div className="panel-list">
      {(tokens.type.groups as Group[]).map((g) => g.styles.map((s) => (
        <div className="type-row" key={s.name}>
          <div className="type-meta"><code>{s.name}</code><span>{g.name} · {s.fontSize} / {s.lineHeight} · {s.fontWeight}</span></div>
          <p className="type-sample" style={{
            fontFamily: `var(--font-${s.family ?? g.family})`, fontSize: s.fontSize, lineHeight: s.lineHeight,
            fontWeight: s.fontWeight, letterSpacing: s.letterSpacing, fontStyle: s.fontStyle,
          }}>{s.sample ?? s.name}</p>
          <p className="usage">{s.usage}</p>
        </div>
      )))}
    </div>
  );
}

export function SpacingAndRadius() {
  return (
    <>
      <div className="panel-list">
        {tokens.spacing.tokens.map((s) => (
          <div className="space-row" key={s.name}>
            <code>--{s.name}</code>
            <span className="bar" style={{ width: `var(--${s.name})` }} />
            <span className="val">{s.value}</span>
            <span className="usage">{s.usage}</span>
          </div>
        ))}
      </div>
      <div className="cells">
        {tokens.radius.tokens.map((r) => (
          <figure key={r.name}>
            <span className="radius-box" style={{ borderRadius: `var(--${r.name})` }} />
            <figcaption><code>--{r.name}</code> {r.value}<br /><span className="usage">{r.usage}</span></figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

export function Shadows() {
  return (
    <div className="cells">
      {tokens.shadow.tokens.map((s) => (
        <figure key={s.name}>
          <span className="shadow-box" style={{ boxShadow: `var(--${s.name})` }} />
          <figcaption><code>--{s.name}</code><br /><span className="usage">{s.usage}</span></figcaption>
        </figure>
      ))}
    </div>
  );
}
