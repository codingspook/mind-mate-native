import type { Tag } from '@/lib/models';

import { apiFetch } from './client';
import { payloadDocs } from './payload';

const COLLECTION = '/api/tags';

function unwrapDoc(json: unknown): Record<string, unknown> | null {
  if (!json || typeof json !== 'object') return null;
  if ('doc' in json && json.doc && typeof json.doc === 'object') {
    return json.doc as Record<string, unknown>;
  }
  return json as Record<string, unknown>;
}

function normalizeTag(raw: Record<string, unknown>): Tag {
  return {
    id: String(raw.id),
    name: String(raw.name ?? ''),
    user_id: String(raw.user_id ?? raw.userId ?? ''),
    created_at: (raw.created_at as string | null) ?? (raw.createdAt as string | null) ?? null,
  };
}

export async function fetchTags(): Promise<Tag[]> {
  const res = await apiFetch(`${COLLECTION}?limit=1000&sort=-createdAt`, { method: 'GET' });
  if (!res.ok) {
    console.error('fetchTags', res.status, await res.text());
    return [];
  }
  const json: unknown = await res.json();
  return payloadDocs<Record<string, unknown>>(json).map(normalizeTag);
}

export async function fetchTagById(id: string): Promise<Tag | null> {
  const res = await apiFetch(`${COLLECTION}/${encodeURIComponent(id)}`, { method: 'GET' });
  if (!res.ok) {
    console.error('fetchTagById', res.status, await res.text());
    return null;
  }
  const json: unknown = await res.json();
  const doc = unwrapDoc(json);
  return doc ? normalizeTag(doc) : null;
}

export async function createTag(tag: Pick<Tag, 'name'>): Promise<Tag | null> {
  const res = await apiFetch(COLLECTION, {
    method: 'POST',
    body: JSON.stringify({ name: tag.name }),
  });
  if (!res.ok) {
    console.error('createTag', res.status, await res.text());
    return null;
  }
  const json: unknown = await res.json();
  const doc = unwrapDoc(json);
  return doc ? normalizeTag(doc) : null;
}

export async function patchTag(id: string, patch: Partial<Tag>): Promise<Tag | null> {
  const body: Record<string, unknown> = {};
  if (patch.name !== undefined) body.name = patch.name;

  const res = await apiFetch(`${COLLECTION}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error('patchTag', res.status, await res.text());
    return null;
  }
  const json: unknown = await res.json();
  const doc = unwrapDoc(json);
  return doc ? normalizeTag(doc) : null;
}

export async function removeTag(id: string): Promise<Tag | null> {
  const res = await apiFetch(`${COLLECTION}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    console.error('removeTag', res.status, await res.text());
    return null;
  }
  const text = await res.text();
  if (!text.trim()) {
    return { id, name: '', user_id: '', created_at: null };
  }
  try {
    const json: unknown = JSON.parse(text);
    const doc = unwrapDoc(json);
    return doc ? normalizeTag(doc) : null;
  } catch {
    return { id, name: '', user_id: '', created_at: null };
  }
}
