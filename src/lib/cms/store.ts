/**
 * The CMS content store, shared by server and browser.
 *
 * Every editable content object on the site is wrapped once, where it is
 * defined, with `cms(id, defaults)`. The wrapper is a Proxy: each property
 * read returns the admin's saved version of that object if there is one, and
 * the original (the code's default) if not. Pages keep importing their
 * content exactly as before; nothing else changes.
 *
 *   server   saved versions are read from disk by lib/cms/server.ts, which
 *            installs a reader on `globalThis` when the root layout loads.
 *   browser  the root layout writes every saved version into the page as
 *            `window.__PEN_CMS__` before any script runs, so client
 *            components render the same content the server did.
 *
 * Reads happen at render time, not when a module loads, so an edit shows on
 * the next page view without a rebuild.
 */

export type CmsReader = (id: string) => unknown;

interface CmsGlobal {
  __penCmsRead?: CmsReader;
  __PEN_CMS__?: Record<string, unknown>;
}

const g = globalThis as unknown as CmsGlobal;

/** Original values, by id, for the admin's "reset" and form shapes. */
const defaults = new Map<string, unknown>();

/** The saved version of a content object, or undefined. */
export function readOverride(id: string): unknown {
  if (typeof window !== 'undefined') return g.__PEN_CMS__?.[id];
  return g.__penCmsRead?.(id);
}

/** Install the server-side reader (lib/cms/server.ts). */
export function installReader(reader: CmsReader) {
  g.__penCmsRead = reader;
}

/** The code's original value for an id, as registered by `cms()`. */
export function getDefault(id: string): unknown {
  return defaults.get(id);
}

/**
 * Make a content object editable. Returns a stand-in with the same type that
 * always reads the current version.
 */
export function cms<T extends object>(id: string, value: T): T {
  defaults.set(id, value);
  const current = () => (readOverride(id) as T | undefined) ?? value;
  return new Proxy(value, {
    get(_target, key) {
      const target = current();
      const out = Reflect.get(target, key);
      // Methods such as Array.prototype.map run against the current version.
      return typeof out === 'function' && key !== 'constructor' ? out.bind(target) : out;
    },
    has(_target, key) {
      return Reflect.has(current(), key);
    },
    ownKeys(target) {
      const keys = new Set(Reflect.ownKeys(current()));
      // Proxy invariant: non-configurable keys of the target (an array's
      // `length`) must always be reported.
      for (const key of Reflect.ownKeys(target)) {
        const d = Reflect.getOwnPropertyDescriptor(target, key);
        if (d && !d.configurable) keys.add(key);
      }
      return [...keys];
    },
    getOwnPropertyDescriptor(target, key) {
      const d = Reflect.getOwnPropertyDescriptor(current(), key);
      const t = Reflect.getOwnPropertyDescriptor(target, key);
      if (t && !t.configurable) {
        return d ? { ...t, value: d.value } : t;
      }
      return d ? { ...d, configurable: true } : undefined;
    },
  });
}
