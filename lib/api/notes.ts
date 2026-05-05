import type { Note } from '@/lib/models';

import { apiFetch } from './client';
import { payloadDocs } from './payload';

const COLLECTION = '/api/notes';

function unwrapDoc(json: unknown): Record<string, unknown> | null {
  if (!json || typeof json !== 'object') return null;
  if ('doc' in json && json.doc && typeof json.doc === 'object') {
    return json.doc as Record<string, unknown>;
  }
  return json as Record<string, unknown>;
}

function normalizeNote(raw: Record<string, unknown>): Note {
  const noteTags =
    (raw.note_tags as Note['note_tags']) ?? (raw.noteTags as Note['note_tags']) ?? undefined;

  return {
    id: String(raw.id),
    title: (raw.title as string | null) ?? null,
    content: (raw.content as string | null) ?? null,
    ai_summary: (raw.ai_summary as string | null) ?? (raw.aiSummary as string | null) ?? null,
    created_at: (raw.created_at as string | null) ?? (raw.createdAt as string | null) ?? null,
    updated_at: (raw.updated_at as string | null) ?? (raw.updatedAt as string | null) ?? null,
    user_id: String(raw.user_id ?? raw.userId ?? ''),
    note_tags: noteTags,
  };
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await apiFetch(`${COLLECTION}?depth=2&limit=1000&sort=-updatedAt`, { method: 'GET' });
  if (!res.ok) {
    console.error('fetchNotes', res.status, await res.text());
    return [];
  }
  const json: unknown = await res.json();
  return payloadDocs<Record<string, unknown>>(json).map(normalizeNote);
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  const res = await apiFetch(`${COLLECTION}/${encodeURIComponent(id)}?depth=2`, {
    method: 'GET',
  });
  if (!res.ok) {
    console.error('fetchNoteById', res.status, await res.text());
    return null;
  }
  const json: unknown = await res.json();
  const doc = unwrapDoc(json);
  return doc ? normalizeNote(doc) : null;
}

export async function createNote(note: Pick<Note, 'title' | 'content'>): Promise<Note | null> {
  const res = await apiFetch(COLLECTION, {
    method: 'POST',
    body: JSON.stringify({
      title: note.title,
      content: note.content,
    }),
  });
  if (!res.ok) {
    console.error('createNote', res.status, await res.text());
    return null;
  }
  const json: unknown = await res.json();
  const doc = unwrapDoc(json);
  return doc ? normalizeNote(doc) : null;
}

export async function patchNote(id: string, patch: Partial<Note>): Promise<Note | null> {
  const body: Record<string, unknown> = {};
  if (patch.title !== undefined) body.title = patch.title;
  if (patch.content !== undefined) body.content = patch.content;
  if (patch.ai_summary !== undefined) body.ai_summary = patch.ai_summary;

  const res = await apiFetch(`${COLLECTION}/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error('patchNote', res.status, await res.text());
    return null;
  }
  const json: unknown = await res.json();
  const doc = unwrapDoc(json);
  return doc ? normalizeNote(doc) : null;
}

export async function removeNote(id: string): Promise<Note | null> {
  const res = await apiFetch(`${COLLECTION}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    console.error('removeNote', res.status, await res.text());
    return null;
  }
  const text = await res.text();
  if (!text.trim()) {
    return {
      id,
      title: null,
      content: null,
      ai_summary: null,
      created_at: null,
      updated_at: null,
      user_id: '',
    };
  }
  try {
    const json: unknown = JSON.parse(text);
    const doc = unwrapDoc(json);
    return doc ? normalizeNote(doc) : null;
  } catch {
    return {
      id,
      title: null,
      content: null,
      ai_summary: null,
      created_at: null,
      updated_at: null,
      user_id: '',
    };
  }
}
