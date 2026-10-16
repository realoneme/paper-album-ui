import tokens from './tokens.json';

export type Theme = 'parchment' | 'oak' | 'walnut';
export const THEMES = tokens.color.themes as { id: Theme; name: string }[];

type ThemedValue = string | Partial<Record<Theme, string>>;
interface Token { name: string; value: ThemedValue; usage?: string }

const ALIAS = /^\{([A-Za-z0-9][A-Za-z0-9_.-]*)\}$/;
const colors = tokens.color.tokens as Token[];

/** Concrete value of a colour token in one theme, following {alias} references. */
export function resolveColor(name: string, theme: Theme, seen: string[] = []): string {
  const tok = colors.find((t) => t.name === name);
  if (!tok) throw new Error(`Unknown colour token "${name}"`);
  if (seen.includes(name)) throw new Error(`Alias cycle: ${[...seen, name].join(' -> ')}`);
  const raw = typeof tok.value === 'string' ? tok.value : (tok.value[theme] ?? tok.value[THEMES[0].id]);
  if (raw === undefined) throw new Error(`"${name}" has no value for ${theme}`);
  const m = ALIAS.exec(raw);
  return m ? resolveColor(m[1], theme, [...seen, name]) : raw;
}

export { tokens };
