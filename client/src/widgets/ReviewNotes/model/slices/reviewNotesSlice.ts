import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notes, ReviewNotesSchema } from '../types/notes.ts';
import { fetchReviewNotes } from '../services/fetchReviewNotes/fetchReviewNotes.ts';
import { updateReviewNotes } from '../services/updateReviewNotes/updateReviewNotes.ts';

const initialState: ReviewNotesSchema = {
    isLoading: false,
    error: undefined,
    newNote: '',
    notes: [],
};

export const reviewNotesSlice = createSlice({
    name: 'reviewNotes',
    initialState,
    reducers: {
        setNewNote: (state, action: PayloadAction<string>) => {
            state.newNote = action.payload;
        },
        addNewNote: (state, action: PayloadAction<string>) => {
            state.notes = [
                ...state.notes,
                {
                    value: action.payload,
                    isChecked: false,
                },
            ];
        },
        setIsChecked: (state, action: PayloadAction<{ index: number; value: boolean }>) => {
            state.notes[action.payload.index].isChecked = action.payload.value;
        },
        removeNote: (state, action: PayloadAction<number>) => {
            state.notes.splice(action.payload, 1);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewNotes.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchReviewNotes.fulfilled, (state, action: PayloadAction<Notes>) => {
                state.isLoading = false;
                state.notes = action.payload.checkboxes;
            })
            .addCase(fetchReviewNotes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(updateReviewNotes.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(updateReviewNotes.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updateReviewNotes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: reviewNotesActions } = reviewNotesSlice;
export const { reducer: reviewNotesReducer } = reviewNotesSlice;
