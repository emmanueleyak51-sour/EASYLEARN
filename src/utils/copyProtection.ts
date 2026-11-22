/**
 * Content Copy Protection (Text-Selection & Clipboard Lock)
 *
 * Prevents casual copying, cutting, dragging, text selection, and context-menu
 * scraping of study notes, exam questions, and explanations while keeping all
 * interactive form controls (`<input>`, `<textarea>`, `<select>`,
 * `[contenteditable="true"]`, and `[data-allow-copy="true"]`) fully editable
 * and accessible. Programmatic `navigator.clipboard.writeText(...)` buttons
 * (for Pass PINs, Device IDs, and Duel codes) continue to work normally.
 */

const EDITABLE_SELECTOR =
  'input, textarea, select, [contenteditable="true"], [contenteditable=""], [data-allow-copy="true"]';

interface ElementLike {
  tagName?: unknown;
  isContentEditable?: unknown;
  getAttribute?: (name: string) => string | null;
  closest?: (selector: string) => unknown;
  parentElement?: ElementLike | null;
}

function resolveElementFromTarget(target: unknown): ElementLike | null {
  if (!target || typeof target !== 'object') return null;
  const candidate = target as ElementLike & { nodeType?: number };
  // Element node (nodeType === 1) or duck-typed mock with tagName
  if (typeof candidate.tagName === 'string') {
    return candidate;
  }
  // Text node (nodeType === 3) -> inspect parentElement
  if (candidate.parentElement && typeof candidate.parentElement.tagName === 'string') {
    return candidate.parentElement;
  }
  return null;
}

/**
 * Pure check returning `true` when a DOM event target is inside an editable
 * input, textarea, select, contenteditable surface, or an explicitly marked
 * `[data-allow-copy="true"]` container.
 */
export function isEditableCopyTarget(target: unknown): boolean {
  const el = resolveElementFromTarget(target);
  if (!el) return false;

  if (el.isContentEditable === true) return true;

  const tag = String(el.tagName || '').toUpperCase();
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    return true;
  }

  if (typeof el.getAttribute === 'function') {
    const ce = el.getAttribute('contenteditable');
    if (ce === '' || ce === 'true') return true;
    if (el.getAttribute('data-allow-copy') === 'true') return true;
  }

  if (typeof el.closest === 'function') {
    try {
      if (el.closest(EDITABLE_SELECTOR)) return true;
    } catch {
      /* ignore non-standard selector environments */
    }
  }

  // Fallback ancestor walk for lightweight test mocks without `.closest`
  let cur: ElementLike | null | undefined = el.parentElement;
  while (cur) {
    if (cur.isContentEditable === true) return true;
    const pTag = String(cur.tagName || '').toUpperCase();
    if (pTag === 'INPUT' || pTag === 'TEXTAREA' || pTag === 'SELECT') return true;
    if (typeof cur.getAttribute === 'function') {
      const ce = cur.getAttribute('contenteditable');
      if (ce === '' || ce === 'true') return true;
      if (cur.getAttribute('data-allow-copy') === 'true') return true;
    }
    cur = cur.parentElement;
  }

  return false;
}

/**
 * Pure check for Ctrl/Cmd+C, Ctrl/Cmd+X, and Ctrl/Cmd+A keyboard shortcuts
 * outside editable fields so desktop keyboard copy/select-all is also guarded.
 */
export function shouldBlockProtectedKeyCombo(ev: {
  key?: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  target?: unknown;
}): boolean {
  if (!ev.ctrlKey && !ev.metaKey) return false;
  if (ev.altKey) return false;
  const k = String(ev.key || '').toLowerCase();
  if (k !== 'c' && k !== 'x' && k !== 'a') return false;
  return !isEditableCopyTarget(ev.target);
}

/**
 * Attaches capture-phase listeners on `root` to block screen text copying,
 * cutting, dragging, selection, and right-click/long-press copy menus outside
 * editable inputs. Returns an unsubscribe cleanup function.
 */
export function installCopyProtection(root: Document = document): () => void {
  const guardEvent = (ev: Event) => {
    if (isEditableCopyTarget(ev.target)) return;
    ev.preventDefault();
  };

  const guardKeyDown = (ev: KeyboardEvent) => {
    if (!shouldBlockProtectedKeyCombo(ev)) return;
    ev.preventDefault();
    try {
      const sel = root.defaultView?.getSelection?.();
      if (sel && sel.rangeCount > 0 && !isEditableCopyTarget(sel.anchorNode)) {
        sel.removeAllRanges();
      }
    } catch {
      /* ignore selection errors */
    }
  };

  const events: Array<keyof DocumentEventMap> = [
    'copy',
    'cut',
    'contextmenu',
    'selectstart',
    'dragstart',
  ];

  for (const name of events) {
    root.addEventListener(name, guardEvent, true);
  }
  root.addEventListener('keydown', guardKeyDown, true);

  return () => {
    for (const name of events) {
      root.removeEventListener(name, guardEvent, true);
    }
    root.removeEventListener('keydown', guardKeyDown, true);
  };
}
