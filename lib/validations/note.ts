import { z } from 'zod';

export const noteSchema = z.object({
  title: z.string(),
  content: z.string().min(1, 'La descrizione è obbligatoria'),
});

export type NoteFormData = z.infer<typeof noteSchema>;
