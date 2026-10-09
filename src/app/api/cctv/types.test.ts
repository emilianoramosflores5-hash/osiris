declare module 'vitest' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void): void;
  export function expect(actual: any): {
    toBe(expected: any): void;
  };
}

import { describe, expect, it } from 'vitRead 
Completed with input: {
  "path": "C:\\Users\\llane\\OneDrive\\Documents\\GitHub\\osiris\\src\\app\\api\\cctv\\types.test.ts"
}

Read 
Completed with input: {
  "path": "C:\\Users\\llane\\OneDrive\\Documents\\GitHub\\osiris\\package.json"
}

Find files matching `**/tsconfig*.json`

Search for `vitest|types\.test|declare module`

Read 
Completed with input: {
  "path": "C:\\Users\\llane\\OneDrive\\Documents\\GitHub\\osiris\\tsconfig.json"
}

Read 
Completed with input: {
  "path": "C:\\Users\\llane\\OneDrive\\Documents\\GitHub\\osiris\\vitest.config.ts"
}

Search for `declare module ['"]vitest['"]`

This file both **declares** and **imports** `vitest`. Because it contains imports, TypeScript treats it as a module, so `declare module 'vitest'` is interpreted as a *module augmentation*—a change to an already-resolvable module—not as a way to define a missing module. TypeScript can’t resolve `vitest` in that context, so it reports the error.

The declaration block in `types.test.ts` is unnecessary: `vitest` is already listed as a dev dependency in `package.json`, and it supplies its own types. Remove the `declare module 'vitest' { ... }` block. If the error remains on the import, check that dependencies are installed in the repository root and that VS Code has refreshed its TypeScript project.est';
import { inferStreamType, normalizeFeedUrl, proxiedImageUrl } from './types';

describe('cctv URL helpers', () => {
  it('proxy only the hosts that need it, and trims whitespace', () => {
    expect(proxiedImageUrl(' http://infobanjirjps.selangor.gov.my/InfoBanjir.WebAdmin/CCTV_Image/14.jpg '))
      .toBe('/api/cctv/proxy?url=http%3A%2F%2Finfobanjirjps.selangor.gov.my%2FInfoBanjir.WebAdmin%2FCCTV_Image%2F14.jpg');
    expect(proxiedImageUrl('https://cam.example/1.jpg')).toBe('https://cam.example/1.jpg');
    expect(proxiedImageUrl('   ')).toBe('');
  });

  it('normalizes frozen feed URLs without preserving a query string', () => {
    expect(normalizeFeedUrl('pics/abc/stream.jpg?token=abc')).toBe('http://free-webcambg.com/pics/abc/stream.jpg');
    expect(normalizeFeedUrl('https://cam.example/live.jpg?cache=1')).toBe('https://cam.example/live.jpg');
    expect(normalizeFeedUrl('  https://cam.example/live.jpg?cache=1  ')).toBe('https://cam.example/live.jpg');
  });

  it('infers each major live stream type from the URL', () => {
    expect(inferStreamType('https://example.com/live.m3u8?token=1')).toBe('hls');
    expect(inferStreamType('https://example.com/camera.ashx?id=4057&format=mp4')).toBe('mp4');
    expect(inferStreamType('https://cam.example/cgi-bin/axis.cgi?camera=1')).toBe('mjpeg');
    expect(inferStreamType('https://youtube.com/embed/abc123')).toBe('iframe');
    expect(inferStreamType('https://example.com/image.jpg')).toBe('jpg');
  });
});
