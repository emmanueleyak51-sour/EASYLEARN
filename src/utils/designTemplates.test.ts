import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  EYAK_DESIGN_TEMPLATES,
  getAdjacentDesignTemplateId,
  getDesignTemplateById,
} from '../data/designTemplates';

describe('EYAK 10 Design Templates Registry (Pure Logic)', () => {
  it('defines exactly 10 unique numbered templates with valid layout styles and palettes', () => {
    assert.equal(EYAK_DESIGN_TEMPLATES.length, 10);
    const ids = new Set(EYAK_DESIGN_TEMPLATES.map((t) => t.id));
    assert.equal(ids.size, 10);

    EYAK_DESIGN_TEMPLATES.forEach((tpl, i) => {
      assert.equal(tpl.index, i + 1);
      assert.ok(tpl.name.length > 3);
      assert.ok(['sidebar', 'topbar', 'compact-rail', 'focused'].includes(tpl.layoutStyle));
      assert.ok(tpl.preview.canvas.startsWith('#'));
      assert.ok(tpl.preview.accent.startsWith('#'));
    });
  });

  it('resolves template lookup and returns null for unknown IDs', () => {
    assert.equal(getDesignTemplateById('precision')?.name, 'Precision Studio');
    assert.equal(getDesignTemplateById('broadsheet')?.layoutStyle, 'topbar');
    assert.equal(getDesignTemplateById('unknown-id'), null);
    assert.equal(getDesignTemplateById(null), null);
  });

  it('cycles forward and backward cleanly across all 10 templates', () => {
    assert.equal(getAdjacentDesignTemplateId(null, 1), 'sovereign');
    assert.equal(getAdjacentDesignTemplateId(null, -1), 'chalkboard');
    assert.equal(getAdjacentDesignTemplateId('sovereign', -1), 'chalkboard');
    assert.equal(getAdjacentDesignTemplateId('chalkboard', 1), 'sovereign');
    assert.equal(getAdjacentDesignTemplateId('precision', 1), 'kinetic');
  });
});
