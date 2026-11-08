import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/pages/home/wordpress.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { parsePosts, loadPosts, toText } = await import(`data:text/javascript;base64,${
  Buffer.from(outputText).toString('base64')}`);

const site = 'https://www.comp.nus.edu.sg';
const item = (id, extra = {}) => ({
  id, date: '2026-11-02T07:27:31', link: `${site}/news/story-${id}/`,
  title: { rendered: `Story ${id}` }, excerpt: { rendered: '<p>Hello</p>' }, ...extra,
});

test('toText strips tags and decodes entities', () => {
  assert.equal(toText('<p>From Code to Cancer: NUS Computing&#8217;s &amp; AI&#x2019;s <b>role</b></p>\n'),
    'From Code to Cancer: NUS Computing’s & AI’s role');
  assert.equal(toText('&unknown; &#99999999;'), '&unknown; &#99999999;');
});

test('parsePosts keeps valid posts and rejects bad shapes and off-site URLs', () => {
  assert.throws(() => parsePosts({}));
  const posts = parsePosts([
    item(1, {
      excerpt: { rendered: '<p>Sean Er started his first company [&hellip;]</p>' },
      _embedded: { 'wp:featuredmedia': [{ source_url: `${site}/full.png`,
        media_details: { sizes: { medium_large: { source_url: `${site}/card.png` } } } }] },
    }),
    item(2, { _embedded: { 'wp:featuredmedia': [{ source_url: 'https://evil.example/x.png' }] } }),
    item(3, { link: 'javascript:alert(1)' }),
    item('4'),
    null,
  ]);
  assert.deepEqual(posts.map(p => p.id), [1, 2]);
  assert.equal(posts[0].excerpt, 'Sean Er started his first company');
  assert.equal(posts[0].image, `${site}/card.png`);
  assert.equal(posts[1].image, undefined);
});

test('loadPosts shares one request, caches it, and retries after a failure', async () => {
  const realFetch = globalThis.fetch;
  const calls = [];
  let fail = true;
  globalThis.fetch = async (url) => {
    calls.push(url);
    if (fail) return { ok: false, status: 503 };
    return { ok: true, json: async () => [item(1)] };
  };
  try {
    const first = loadPosts('news');
    assert.equal(loadPosts('news'), first);
    await assert.rejects(first, /503/);
    fail = false;
    assert.equal((await loadPosts('news')).length, 1);
    await loadPosts('news');
    assert.equal(calls.length, 2);
    assert.match(calls[0], /\/wp-json\/wp\/v2\/news\?per_page=6&/);
  } finally {
    globalThis.fetch = realFetch;
  }
});
