export const LEVELS = ['', 'Foundation', 'Easy', 'Standard', 'Hard', 'Exam level'] as const;
export const MN = '−';
export const RA = '→';
export const EQM = '⇌';

export const fr = (a: string | number, b: string | number): string =>
  `<span class="fr"><span>${a}</span><span>${b}</span></span>`;

export const ch = (f: string | number): string =>
  String(f).replace(/([A-Za-z)\]])(\d+)/g, '$1<sub>$2</sub>');

export const esc = (s: unknown): string => {
  const ENT: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(s ?? '').replace(/[&<>"']/g, (c) => ENT[c] || c);
};

export const unesc = (s: string): string =>
  String(s)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

export const cleanRichText = (s: string): string =>
  esc(unesc(s).trim())
    .replace(/&lt;(\/?)(sub|sup|i|b|span)&gt;/g, '<$1$2>')
    .replace(/&lt;span class=&quot;(fr|mx|mr|dt)&quot;&gt;/g, '<span class="$1">');

export const mfix = (x: unknown): string =>
  String(x ?? '').replace(/(^|[\s(=×÷+])-(?=\d)/g, '$1' + MN);

export const nm = (v: number): string => {
  const r = Math.round(v * 100) / 100;
  return (r < 0 ? MN : '') + Math.abs(r);
};

export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export function frac(n: number, d: number): string {
  if (d === 0) return '—';
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  n /= g;
  d /= g;
  return d === 1 ? nm(n) : (n < 0 ? MN : '') + fr(Math.abs(n), d);
}

export function poly(a: number, b: number, c: number): string {
  const term = (k: number, s: string, first: boolean) => {
    if (!k) return '';
    const v = Math.abs(k);
    const body = s ? (v === 1 ? '' : nm(v)) + s : nm(v);
    return first ? (k < 0 ? MN : '') + body : (k < 0 ? ` ${MN} ` : ' + ') + body;
  };
  let o = term(a, 'x²', true);
  o += term(b, 'x', !o);
  o += term(c, '', !o);
  return o || '0';
}

export const isSq = (n: number): boolean => n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;

export const brk = (p: number): string =>
  `(x ${p > 0 ? MN : '+'} ${Math.abs(p)})`.replace(/\(x [−+] 0\)/, 'x');

export const MT = (() => {
  const E: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  const e = (s: string) => s.replace(/[&<>"']/g, (c) => E[c]);

  function toMarkup(src: unknown): string {
    const s = String(src == null ? '' : src).replace(/\r\n?/g, '\n').trim();
    let i = 0;

    function close(from: number, chChar: string): number {
      let d = 0;
      for (let k = from; k < s.length; k++) {
        const c = s[k];
        if (c === '\\') {
          k++;
          continue;
        }
        if (c === '[' || c === '{') d++;
        else if ((c === ']' || c === '}') && d > 0) d--;
        else if (c === chChar && d === 0) return k;
      }
      return -1;
    }

    function split(a: number, b: number, sep: string): [number, number][] {
      const out: [number, number][] = [];
      let d = 0;
      let st = a;
      for (let k = a; k < b; k++) {
        const c = s[k];
        if (c === '\\') {
          k++;
          continue;
        }
        if (c === '[' || c === '{') d++;
        else if (c === ']' || c === '}') d--;
        else if (d === 0 && (sep === ' ' ? /\s/.test(c) : c === sep)) {
          out.push([st, k]);
          st = k + 1;
        }
      }
      out.push([st, b]);
      return out;
    }

    const sub = (a: number, b: number) => {
      const save = i;
      i = a;
      const h = seq(b);
      i = save;
      return h;
    };

    const trimR = (a: number, b: number): [number, number] => {
      while (a < b && /\s/.test(s[a])) a++;
      while (b > a && /\s/.test(s[b - 1])) b--;
      return [a, b];
    };

    function grid(a: number, b: number, cls: string): string {
      const rows = split(a, b, ';')
        .map((r) => trimR(r[0], r[1]))
        .filter((r) => r[1] > r[0]);
      return `<span class="${cls}">${rows
        .map(
          (r) =>
            `<span class="mr">${split(r[0], r[1], ' ')
              .filter((c) => c[1] > c[0])
              .map((c) => `<span>${sub(c[0], c[1])}</span>`)
              .join('')}</span>`
        )
        .join('')}</span>`;
    }

    function script(tag: string): string | null {
      if (s[i] === '{') {
        const k = close(i + 1, '}');
        if (k > i) {
          const h = sub(i + 1, k);
          i = k + 1;
          return `<${tag}>${h}</${tag}>`;
        }
      }
      const m = /^[−-]?[0-9A-Za-zα-ωθπ]+/.exec(s.slice(i));
      if (m) {
        const h = sub(i, i + m[0].length).replace(/^-/, '−');
        i += m[0].length;
        return `<${tag}>${h}</${tag}>`;
      }
      return null;
    }

    function seq(end: number): string {
      let h = '';
      while (i < end) {
        const c = s[i];
        if (c === '\\' && i + 1 < end) {
          h += e(s[i + 1]);
          i += 2;
          continue;
        }
        if (c === '^' || c === '_') {
          i++;
          const r = script(c === '^' ? 'sup' : 'sub');
          h += r == null ? e(c) : r;
          continue;
        }
        if (c === '[') {
          const k = close(i + 1, ']');
          if (k > 0 && k < end) {
            const slash = split(i + 1, k, '/');
            const semi = split(i + 1, k, ';');
            if (slash.length === 2 && semi.length === 1) {
              const [a1, b1] = trimR(slash[0][0], slash[0][1]);
              const [a2, b2] = trimR(slash[1][0], slash[1][1]);
              h += `<span class="fr"><span>${sub(a1, b1)}</span><span>${sub(a2, b2)}</span></span>`;
            } else {
              h += grid(i + 1, k, 'mx');
            }
            i = k + 1;
            continue;
          }
        }
        if (c === '|') {
          const k = close(i + 1, '|');
          if (k > 0 && k < end && split(i + 1, k, ';').length > 1) {
            h += grid(i + 1, k, 'dt');
            i = k + 1;
            continue;
          }
        }
        h += e(c);
        i++;
      }
      return h;
    }

    return seq(s.length);
  }

  const UMap: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
  const un = (s: string) => s.replace(/&(amp|lt|gt|quot|#39);/g, (m) => UMap[m]);

  interface TreeNode {
    tag: string;
    cls: string;
    kids: (string | TreeNode)[];
  }

  function parse(html: string): (string | TreeNode)[] {
    const root: TreeNode = { tag: 'root', cls: '', kids: [] };
    const stack: TreeNode[] = [root];
    const re = /<(\/?)(span|sub|sup)(?: class="([a-z]+)")?>|<\/?[a-z]+[^>]*>|([^<]+)|(<)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html))) {
      const top = stack[stack.length - 1];
      if (m[4] != null || m[5]) top.kids.push(un(m[4] != null ? m[4] : '<'));
      else if (!m[2]) continue;
      else if (m[1]) {
        if (stack.length > 1) stack.pop();
      } else {
        const n: TreeNode = { tag: m[2], cls: m[3] || '', kids: [] };
        top.kids.push(n);
        stack.push(n);
      }
    }
    return root.kids;
  }

  function toSimple(html: string): string {
    const str = String(html);
    const hasSemi = /;/.test(un(str.replace(/<[^>]+>/g, '')));
    const txt = (t: string, ctx: string) =>
      t.replace(/[\\^_[\]|/;\s]/g, (c) =>
        '\\^_[]'.includes(c)
          ? '\\' + c
          : c === '|'
            ? hasSemi || ctx === 'cell'
              ? '\\|'
              : c
            : c === '/'
              ? ctx === 'fr'
                ? '\\/'
                : c
              : ctx === 'cell'
                ? '\\' + c
                : c
      );
    const kidsOf = (n: TreeNode) => n.kids.filter((k): k is TreeNode => typeof k !== 'string');

    function out(list: (string | TreeNode)[], ctx: string): string {
      let r = '';
      list.forEach((n, idx) => {
        if (typeof n === 'string') {
          r += txt(n, ctx);
          return;
        }
        if (n.tag === 'sup' || n.tag === 'sub') {
          const inner = out(n.kids, ctx);
          const next = list[idx + 1];
          const nx = typeof next === 'string' ? next[0] : '';
          const bare =
            /^[−-]?[0-9A-Za-zα-ωθπ]+$/.test(inner) && !/[0-9A-Za-zα-ωθπ{]/.test(nx || '');
          r += (n.tag === 'sup' ? '^' : '_') + (bare ? inner : `{${inner}}`);
        } else if (n.cls === 'fr') {
          const p = kidsOf(n);
          r += `[${out(p[0] ? p[0].kids : [], 'fr')}/${out(p[1] ? p[1].kids : [], 'fr')}]`;
        } else if (n.cls === 'mx' || n.cls === 'dt') {
          const rows = kidsOf(n)
            .map((row) =>
              kidsOf(row)
                .map((c) => out(c.kids, 'cell'))
                .join(' ')
            )
            .join('; ');
          r += n.cls === 'mx' ? `[${rows}]` : `|${rows}|`;
        } else {
          r += out(n.kids, ctx);
        }
      });
      return r;
    }

    return out(parse(str), '');
  }

  return { toMarkup, toSimple };
})();
