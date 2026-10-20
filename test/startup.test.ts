import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../src/storage';

function installBrowserStubs(dom: JSDOM): void {
  const context = {
    createRadialGradient: () => ({ addColorStop: () => undefined }),
    setTransform: () => undefined,
    save: () => undefined,
    restore: () => undefined,
    translate: () => undefined,
    scale: () => undefined,
    clearRect: () => undefined,
    fillRect: () => undefined,
    beginPath: () => undefined,
    arc: () => undefined,
    fill: () => undefined,
    stroke: () => undefined,
    moveTo: () => undefined,
    lineTo: () => undefined,
    strokeText: () => undefined,
    fillText: () => undefined,
  } as unknown as CanvasRenderingContext2D;
  dom.window.HTMLCanvasElement.prototype.getContext = (() => context) as unknown as typeof dom.window.HTMLCanvasElement.prototype.getContext;
  dom.window.HTMLElement.prototype.getBoundingClientRect = (() => ({ width: 900, height: 650, top: 0, left: 0, right: 900, bottom: 650 })) as typeof dom.window.HTMLElement.prototype.getBoundingClientRect;
  (globalThis as Record<string, unknown>).ResizeObserver = class { observe(): void {} disconnect(): void {} };
  (globalThis as Record<string, unknown>).requestAnimationFrame = () => 1;
  (globalThis as Record<string, unknown>).cancelAnimationFrame = () => undefined;
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, localStorage: dom.window.localStorage });
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: dom.window.navigator });
}

async function boot(payload?: unknown): Promise<JSDOM> {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const dom = new JSDOM(html, { url: 'http://localhost/' });
  installBrowserStubs(dom);
  if (payload) dom.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  await import('../src/main');
  return dom;
}

describe('app startup', () => {
  beforeEach(() => { vi.resetModules(); });

  it('boots from index.html with empty local storage and renders the workspace', async () => {
    const dom = await boot();
    expect(dom.window.document.querySelector('.shell')).not.toBeNull();
    expect(dom.window.document.querySelector('#content')).not.toBeNull();
    expect(dom.window.document.querySelectorAll('.tab')).toHaveLength(3);
    expect(dom.window.document.querySelector('#graph-canvas')).not.toBeNull();
    expect(dom.window.document.querySelector('.graph-empty')?.textContent).toContain('No memories yet');
    expect(dom.window.document.querySelector('.recall-results')?.textContent).toContain('Ask a question');
    dom.window.dispatchEvent(new dom.window.Event('beforeunload'));
  });

  it('boots with legacy memories that omit newer flags', async () => {
    const legacyMemory = { id: 'legacy', text: 'Legacy memory', createdAt: '2026-10-01T00:00:00.000Z', category: 'note', importance: 3, archived: true, entities: { capitalizedPhrases: [], regexEntities: [], facts: {} }, facts: {} };
    const dom = await boot({ schemaVersion: 0, memories: [legacyMemory] });
    expect(dom.window.document.querySelector('.shell')).not.toBeNull();
    expect(dom.window.document.querySelector('.stats-row .stat strong')?.textContent).toBe('1');
    dom.window.dispatchEvent(new dom.window.Event('beforeunload'));
  });
});
