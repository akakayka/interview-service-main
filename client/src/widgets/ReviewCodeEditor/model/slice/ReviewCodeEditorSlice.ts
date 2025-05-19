import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskSolutionInfo } from 'entities/Task';
import { ReviewCodeEditorSchema } from '../types/ReviewCodeEditor.ts';

const initialState: ReviewCodeEditorSchema = {
    isLoading: false,
    error: undefined,
    currentTask: undefined,
    currentTaskCode: '',
};

export const reviewCodeEditorSlice = createSlice({
    name: 'reviewCodeEditor',
    initialState,
    reducers: {
        setCurrentTask: (state, action: PayloadAction<TaskSolutionInfo>) => {
            state.currentTask = action.payload;
        },
        setCurrentTaskCode: (state, action: PayloadAction<string>) => {
            state.currentTaskCode = action.payload;
        },
    },
});

export const { actions: reviewCodeEditorActions } = reviewCodeEditorSlice;
export const { reducer: reviewCodeEditorReducer } = reviewCodeEditorSlice;
