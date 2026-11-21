/**
 * Runs once when the server starts, before it handles requests: load the
 * admin's saved content into memory, so the first page served already shows
 * it (see lib/cms/server.ts).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { loadContent, usingMongo } = await import('./lib/cms/server');
  await loadContent();
  console.log(
    `[cms] Content store: ${usingMongo() ? 'MongoDB' : 'local files (set MONGODB_URI to use MongoDB)'}`,
  );
}
