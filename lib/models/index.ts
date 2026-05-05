/** Modelli allineati alle collection Payload (notes / tags). */

export interface NoteTag {
  note_id: string;
  tag_id: string;
}

export interface Note {
  ai_summary: string | null;
  content: string | null;
  created_at: string | null;
  id: string;
  title: string | null;
  updated_at: string | null;
  user_id: string;
  note_tags?: NoteTag[];
}

export interface Tag {
  created_at: string | null;
  id: string;
  name: string;
  user_id: string;
}
