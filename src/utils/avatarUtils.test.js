import test from 'node:test';
import assert from 'node:assert/strict';
import { getAvatarResizeDimensions } from './avatarUtils.js';

test('getAvatarResizeDimensions preserves aspect ratio inside the max size', () => {
  assert.deepEqual(getAvatarResizeDimensions(2400, 1200, 512), {
    width: 512,
    height: 256,
  });

  assert.deepEqual(getAvatarResizeDimensions(800, 1600, 512), {
    width: 256,
    height: 512,
  });
});

test('getAvatarResizeDimensions does not upscale small images', () => {
  assert.deepEqual(getAvatarResizeDimensions(320, 180, 512), {
    width: 320,
    height: 180,
  });
});
