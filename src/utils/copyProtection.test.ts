import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isEditableCopyTarget,
  shouldBlockProtectedKeyCombo,
} from './copyProtection';

test('isEditableCopyTarget blocks non-editable study text and headings', () => {
  const paragraph = {
    tagName: 'P',
    getAttribute: () => null,
    parentElement: {
      tagName: 'ARTICLE',
      getAttribute: () => null,
      parentElement: null,
    },
  };
  const textNodeInsideHeading = {
    nodeType: 3,
    parentElement: {
      tagName: 'H1',
      getAttribute: () => null,
      parentElement: null,
    },
  };

  assert.equal(isEditableCopyTarget(paragraph), false);
  assert.equal(isEditableCopyTarget(textNodeInsideHeading), false);
  assert.equal(isEditableCopyTarget(null), false);
});

test('isEditableCopyTarget permits input, textarea, select, contenteditable, and data-allow-copy', () => {
  assert.equal(isEditableCopyTarget({ tagName: 'INPUT' }), true);
  assert.equal(isEditableCopyTarget({ tagName: 'textarea' }), true);
  assert.equal(isEditableCopyTarget({ tagName: 'SELECT' }), true);
  assert.equal(
    isEditableCopyTarget({
      tagName: 'DIV',
      isContentEditable: true,
    }),
    true
  );
  assert.equal(
    isEditableCopyTarget({
      tagName: 'SPAN',
      getAttribute: () => null,
      parentElement: {
        tagName: 'CODE',
        getAttribute: (attr: string) => (attr === 'data-allow-copy' ? 'true' : null),
        parentElement: null,
      },
    }),
    true
  );
});

test('shouldBlockProtectedKeyCombo blocks Ctrl/Cmd+C/X/A on screen text but allows them in inputs', () => {
  const screenSpan = { tagName: 'SPAN', parentElement: null };
  const textInput = { tagName: 'INPUT', parentElement: null };

  assert.equal(
    shouldBlockProtectedKeyCombo({ key: 'c', ctrlKey: true, target: screenSpan }),
    true
  );
  assert.equal(
    shouldBlockProtectedKeyCombo({ key: 'C', metaKey: true, target: screenSpan }),
    true
  );
  assert.equal(
    shouldBlockProtectedKeyCombo({ key: 'a', ctrlKey: true, target: screenSpan }),
    true
  );
  assert.equal(
    shouldBlockProtectedKeyCombo({ key: 'c', ctrlKey: true, target: textInput }),
    false
  );
  assert.equal(
    shouldBlockProtectedKeyCombo({ key: 'v', ctrlKey: true, target: screenSpan }),
    false
  );
  assert.equal(
    shouldBlockProtectedKeyCombo({ key: 'ArrowDown', ctrlKey: false, target: screenSpan }),
    false
  );
});
