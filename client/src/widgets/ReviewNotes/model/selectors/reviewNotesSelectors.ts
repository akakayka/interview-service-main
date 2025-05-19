import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getReviewNotesIsLoading = (state: StateSchema) => state.reviewNotes?.isLoading;
export const getReviewNotesError = (state: StateSchema) => state.reviewNotes?.error || '';
export const getReviewNotesNotes = (state: StateSchema) => state.reviewNotes?.notes;
export const getReviewNotesNewNote = (state: StateSchema) => state.reviewNotes?.newNote;
