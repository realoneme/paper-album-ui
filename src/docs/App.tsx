import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';
import { THEMES, type Theme } from '@/tokens/resolve';
import { Cover } from './Cover';
import { ColorTable, Shadows, SpacingAndRadius, TypeScale } from './Foundations';
import { entries, groups, mappingDoc, overviewDoc, slug } from './registry';

const STORAGE_KEY = 'pa-theme';
const isTheme = (v: string | null): v is Theme => THEMES.some((t) => t.id === v);

function readInitialTheme(): Theme {
  const fromUrl = new URLSearchParams(window.location.search).get('theme');
  if (isTheme(fromUrl)) return fromUrl;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isTheme(saved)) return saved;
  } catch {
    // storage blocked (private mode, sandboxed preview): fall back to the default theme
  }
  return THEMES[0].id;
}

/** Trusted, repository-authored markdown only. */
function Markdown({ source, className }: { source: string; className?: string }) {
  const html = useMemo(() => marked.parse(source, { async: false }) as string, [source]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  return (
    <div className="themes" role="group" aria-label="Theme">
      {THEMES.map((t) => (
        <button key={t.id} type="button" aria-pressed={theme === t.id} onClick={() => onChange(t.id)}>{t.name}</button>
      ))}
    </div>
  );
}

/** ?demo=Name renders one demo alone (used by the end-to-end tests and for deep links). */
function Isolated({ name }: { name: string }) {
  const entry = entries.find((e) => e.name === name);
  if (!entry) return <main className="isolated"><p>Unknown component “{name}”.</p></main>;
  return (
    <main className="isolated" aria-label={`${entry.title} demo`}>
      <h1 className="pa-sr">{entry.title}</h1>
      <div className="demo-stage" style={{ minHeight: entry.height }}><entry.Demo /></div>
    </main>
  );
}

const FOUNDATIONS = [
  ['overview', 'Overview'], ['colour', 'Colour'], ['typography', 'Typography'], ['spacing', 'Spacing & radius'], ['paper-layers', 'Paper layers'], ['shadcn-mapping', 'shadcn mapping'],
] as const;

export function App() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme);
  const isolatedName = new URLSearchParams(window.location.search).get('demo');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { window.localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  if (isolatedName) return <Isolated name={isolatedName} />;

  return (
    <div className="site">
      <aside className="side" aria-label="Sections">
        <p className="brand">Paper Album UI</p>
        <ThemeSwitch theme={theme} onChange={setTheme} />
        <p className="label">Foundations</p>
        <nav aria-label="Foundations">{FOUNDATIONS.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
        <p className="label">Components</p>
        <nav aria-label="Components">{groups.map((g) => <a key={g.name} href={`#${slug(g.name)}`}>{g.name}</a>)}</nav>
      </aside>
      <main id="top">
        <Cover />
        <section id="overview" className="doc-section prose"><Markdown source={overviewDoc} /></section>
        <section id="colour" className="doc-section"><h2>Colour</h2><ColorTable /></section>
        <section id="typography" className="doc-section"><h2>Typography</h2><TypeScale /></section>
        <section id="spacing" className="doc-section"><h2>Spacing &amp; radius</h2><SpacingAndRadius /></section>
        <section id="paper-layers" className="doc-section"><h2>Paper layers</h2><Shadows /></section>
        <section id="shadcn-mapping" className="doc-section prose"><Markdown source={mappingDoc.replace(/^# (.*)$/m, '## $1')} /></section>
        {groups.map((g) => (
          <section key={g.name} id={slug(g.name)} className="doc-section">
            <h2>{g.name}</h2>
            {g.items.map((e) => (
              <article key={e.name} id={`c-${slug(e.name)}`} className="comp">
                <div className="comp-head">
                  <h3>{e.title}</h3>
                  <a className="open" href={`?demo=${e.name}&theme=${theme}`}>Open alone</a>
                </div>
                <Markdown className="comp-doc" source={e.doc} />
                <div className="demo-stage" style={{ minHeight: e.height }}><e.Demo /></div>
              </article>
            ))}
          </section>
        ))}
        <footer className="site-foot">Paper Album UI · {entries.length} components · three themes</footer>
      </main>
    </div>
  );
}
