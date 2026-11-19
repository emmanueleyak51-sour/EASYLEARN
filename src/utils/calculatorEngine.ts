export type CalcAngleMode = 'deg' | 'rad';

interface Token {
  type: 'num' | 'op' | 'fn' | 'lparen' | 'rparen';
  value: string;
}

const FUNCTIONS = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs']);

function tokenize(raw: string): Token[] {
  const s = raw
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .replace(/\s+/g, '');

  const tokens: Token[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (/[0-9.]/.test(ch)) {
      let num = '';
      let dots = 0;
      while (i < s.length && /[0-9.]/.test(s[i])) {
        if (s[i] === '.') dots++;
        if (dots > 1) throw new Error('Invalid decimal number');
        num += s[i++];
      }
      tokens.push({ type: 'num', value: num });
      continue;
    }

    if (/[a-zA-Z]/.test(ch)) {
      let ident = '';
      while (i < s.length && /[a-zA-Z]/.test(s[i])) {
        ident += s[i++];
      }
      const lower = ident.toLowerCase();
      if (lower === 'pi') {
        tokens.push({ type: 'num', value: String(Math.PI) });
      } else if (lower === 'e') {
        tokens.push({ type: 'num', value: String(Math.E) });
      } else if (FUNCTIONS.has(lower)) {
        tokens.push({ type: 'fn', value: lower });
      } else {
        throw new Error(`Unknown identifier: ${ident}`);
      }
      continue;
    }

    if (ch === '(') {
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }
    if ('+-*/^%'.includes(ch)) {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    throw new Error(`Unexpected symbol: ${ch}`);
  }

  // Insert implicit multiplication where valid, e.g., 2(3), 2pi, (2)(3), 2sin(30)
  const out: Token[] = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const cur = tokens[idx];
    const prev = out[out.length - 1];
    if (
      prev &&
      (prev.type === 'num' || prev.type === 'rparen') &&
      (cur.type === 'lparen' || cur.type === 'fn' || cur.type === 'num')
    ) {
      out.push({ type: 'op', value: '*' });
    }
    out.push(cur);
  }
  return out;
}

export function evaluateMathExpression(
  expression: string,
  angleMode: CalcAngleMode = 'deg'
): { ok: true; value: number; formatted: string } | { ok: false; error: string } {
  const trimmed = expression.trim();
  if (!trimmed) return { ok: false, error: 'Enter an expression' };

  try {
    const tokens = tokenize(trimmed);
    let pos = 0;

    const peek = (): Token | undefined => tokens[pos];
    const consume = (): Token => tokens[pos++];

    const parseAddSub = (): number => {
      let left = parseMulDiv();
      while (peek()?.type === 'op' && (peek()!.value === '+' || peek()!.value === '-')) {
        const op = consume().value;
        const right = parseMulDiv();
        left = op === '+' ? left + right : left - right;
      }
      return left;
    };

    const parseMulDiv = (): number => {
      let left = parsePower();
      while (peek()?.type === 'op' && (peek()!.value === '*' || peek()!.value === '/')) {
        const op = consume().value;
        const right = parsePower();
        if (op === '/') {
          if (right === 0) throw new Error('Cannot divide by zero');
          left = left / right;
        } else {
          left = left * right;
        }
      }
      return left;
    };

    const parsePower = (): number => {
      const base = parseUnary();
      if (peek()?.type === 'op' && peek()!.value === '^') {
        consume();
        const exp = parsePower();
        return Math.pow(base, exp);
      }
      return base;
    };

    const parseUnary = (): number => {
      if (peek()?.type === 'op' && peek()!.value === '+') {
        consume();
        return parseUnary();
      }
      if (peek()?.type === 'op' && peek()!.value === '-') {
        consume();
        return -parseUnary();
      }
      return parsePostfix();
    };

    const parsePostfix = (): number => {
      let val = parsePrimary();
      while (peek()?.type === 'op' && peek()!.value === '%') {
        consume();
        val = val / 100;
      }
      return val;
    };

    const parsePrimary = (): number => {
      const tok = peek();
      if (!tok) throw new Error('Incomplete expression');

      if (tok.type === 'num') {
        consume();
        const n = Number(tok.value);
        if (!Number.isFinite(n)) throw new Error('Invalid number');
        return n;
      }

      if (tok.type === 'fn') {
        const fnName = consume().value;
        let arg: number;
        if (peek()?.type === 'lparen') {
          consume();
          arg = parseAddSub();
          if (peek()?.type !== 'rparen') throw new Error('Missing closing parenthesis');
          consume();
        } else {
          arg = parseUnary();
        }
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        switch (fnName) {
          case 'sin':
            return Math.sin(angleMode === 'deg' ? toRad(arg) : arg);
          case 'cos':
            return Math.cos(angleMode === 'deg' ? toRad(arg) : arg);
          case 'tan':
            return Math.tan(angleMode === 'deg' ? toRad(arg) : arg);
          case 'sqrt':
            if (arg < 0) throw new Error('Square root of negative number');
            return Math.sqrt(arg);
          case 'log':
            if (arg <= 0) throw new Error('Logarithm requires positive value');
            return Math.log10(arg);
          case 'ln':
            if (arg <= 0) throw new Error('Natural log requires positive value');
            return Math.log(arg);
          case 'abs':
            return Math.abs(arg);
          default:
            throw new Error(`Unsupported function: ${fnName}`);
        }
      }

      if (tok.type === 'lparen') {
        consume();
        const val = parseAddSub();
        if (peek()?.type !== 'rparen') throw new Error('Missing closing parenthesis');
        consume();
        return val;
      }

      throw new Error(`Unexpected token: ${tok.value}`);
    };

    const result = parseAddSub();
    if (pos < tokens.length) {
      throw new Error('Unexpected trailing input');
    }
    if (!Number.isFinite(result)) {
      throw new Error('Result out of range');
    }

    const cleaned = Math.abs(result) < 1e-12 ? 0 : Number(result.toPrecision(12));
    const formatted = Number.isInteger(cleaned)
      ? String(cleaned)
      : String(parseFloat(cleaned.toFixed(8)));
    return { ok: true, value: cleaned, formatted };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Math syntax error' };
  }
}
