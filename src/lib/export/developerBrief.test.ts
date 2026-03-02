import { describe, it, expect } from 'vitest';
import { generateDeveloperBrief } from './developerBrief';
import { createGistDesignFile, createFeature, createBeforeAfterItem } from '../test-helpers';

describe('generateDeveloperBrief', () => {
  it('includes product name in header', () => {
    const file = createGistDesignFile({
      product: { name: 'Acme', description: null, audience: null, aiApproach: null },
    });
    const brief = generateDeveloperBrief(file, []);
    expect(brief).toContain('# Developer Brief: Acme');
  });

  it('uses fallback name when product name is null', () => {
    const file = createGistDesignFile();
    const brief = generateDeveloperBrief(file, []);
    expect(brief).toContain('# Developer Brief: your product');
  });

  it('includes before/after table when items are provided', () => {
    const file = createGistDesignFile({
      features: [createFeature({ name: 'Search' })],
    });
    const items = [createBeforeAfterItem({ without: 'AI guesses', with: 'File guides' })];
    const brief = generateDeveloperBrief(file, items);
    expect(brief).toContain('## What This File Fixes');
    expect(brief).toContain('AI guesses');
    expect(brief).toContain('File guides');
  });

  it('omits before/after section when no items', () => {
    const file = createGistDesignFile();
    const brief = generateDeveloperBrief(file, []);
    expect(brief).not.toContain('## What This File Fixes');
  });

  it('includes all 5 AI tool integration guides', () => {
    const file = createGistDesignFile();
    const brief = generateDeveloperBrief(file, []);
    expect(brief).toContain('### Cursor');
    expect(brief).toContain('### Claude Code');
    expect(brief).toContain('### ChatGPT');
    expect(brief).toContain('### Claude');
    expect(brief).toContain('### Copilot');
  });

  it('embeds the full gist.design markdown', () => {
    const file = createGistDesignFile({
      product: { name: 'TestApp', description: 'A test app', audience: null, aiApproach: null },
    });
    const brief = generateDeveloperBrief(file, []);
    expect(brief).toContain('## Full gist.design File');
    expect(brief).toContain('# TestApp');
    expect(brief).toContain('A test app');
  });
});
