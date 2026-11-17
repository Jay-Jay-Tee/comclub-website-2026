import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';

const source = readFileSync(new URL('../src/pages/events/eventSharing.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
});
const { shareEvent, copyEventLink } = await import(`data:text/javascript;base64,${
  Buffer.from(outputText).toString('base64')}`);

const title = 'Camp & code: 猫 🎉';
const url = 'https://www.nuscomputing.com/events/fsc?source=club#details';

test('native sharing receives the current title and URL, preserving method context', async () => {
  const calls = [];
  const browser = {
    canShare(data) {
      assert.equal(this, browser);
      calls.push(['canShare', data]);
      return true;
    },
    async share(data) {
      assert.equal(this, browser);
      calls.push(['share', data]);
    },
  };

  assert.equal(await shareEvent(title, url, browser), 'shared');
  const nextUrl = 'https://www.nuscomputing.com/events/fow';
  assert.equal(await shareEvent('Next event', nextUrl, browser), 'shared');
  assert.deepEqual(calls, [
    ['canShare', { title, url }], ['share', { title, url }],
    ['canShare', { title: 'Next event', url: nextUrl }],
    ['share', { title: 'Next event', url: nextUrl }],
  ]);
});

test('older sharing implementations do not need canShare', async () => {
  assert.equal(await shareEvent(title, url, { share: async () => {} }), 'shared');
});

test('unsupported sharing and rejected payloads return a fallback result without opening a sheet', async () => {
  assert.equal(await shareEvent(title, url, {}), 'unavailable');
  assert.equal(await shareEvent(title, url, {
    canShare: () => false,
    share: () => assert.fail('must not share an unsupported payload'),
  }), 'unavailable');
});

test('cancelling the share sheet is separate from permission and system failures', async () => {
  assert.equal(await shareEvent(title, url, {
    share: async () => { throw { name: 'AbortError' }; },
  }), 'cancelled');
  assert.equal(await shareEvent(title, url, {
    share: async () => { throw { name: 'NotAllowedError' }; },
  }), 'failed');
  assert.equal(await shareEvent(title, url, {
    canShare: () => { throw new Error('policy blocked'); },
    share: () => assert.fail('must not share after capability check fails'),
  }), 'failed');
});

test('copying reports success only after the clipboard write resolves and preserves its receiver', async () => {
  let resolve;
  let finished = false;
  const clipboard = {
    writeText(text) {
      assert.equal(this, clipboard);
      assert.equal(text, url);
      return new Promise((done) => { resolve = done; });
    },
  };
  const copying = copyEventLink(url, { clipboard }).then((success) => {
    finished = true;
    return success;
  });
  await Promise.resolve();
  assert.equal(finished, false);
  resolve();
  assert.equal(await copying, true);
});

test('missing or blocked clipboard support returns a manual-copy fallback', async () => {
  assert.equal(await copyEventLink(url, {}), false);
  assert.equal(await copyEventLink(url, { clipboard: {} }), false);
  assert.equal(await copyEventLink(url, {
    clipboard: { writeText: async () => { throw new Error('permission denied'); } },
  }), false);
});
