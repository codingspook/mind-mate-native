/** Payload REST: envelope `docs` oppure array da route custom. */
export function payloadDocs<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === 'object' && Array.isArray((json as { docs?: unknown[] }).docs)) {
    return (json as { docs: T[] }).docs;
  }
  return [];
}
