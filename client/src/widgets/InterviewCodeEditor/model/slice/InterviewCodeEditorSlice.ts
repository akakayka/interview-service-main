import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskSolutionInfo } from 'entities/Task';
import { InterviewCodeEditorSchema } from '../types/interviewCodeEditor.ts';
import { fetchLastSavedCode } from '../services/fetchLastSavedCode/fetchLastSavedCode.ts';
import { executeCode } from '../services/executeCode/executeCode.ts';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { runTestsCode } from '../services/runTestsCode/runTestsCode.ts';

const initialState: InterviewCodeEditorSchema = {
    isLoading: false,
    codeLoading: false,
    error: undefined,
    currentTask: undefined,
    currentTaskCode: undefined,
};

export const interviewCodeEditorSlice = createSlice({
    name: 'interviewCodeEditor',
    initialState,
    reducers: {
        setCurrentTask: (state, action: PayloadAction<TaskSolutionInfo>) => {
            state.currentTask = action.payload;
        },
        setCurrentTaskCode: (state, action: PayloadAction<string>) => {
            state.currentTaskCode = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLastSavedCode.pending, (state) => {
                state.error = undefined;
                state.codeLoading = true;
            })
            .addCase(fetchLastSavedCode.fulfilled, (state) => {
                state.codeLoading = false;
            })
            .addCase(fetchLastSavedCode.rejected, (state, action) => {
                state.codeLoading = false;
                state.error = action.payload as string;
            })
            .addCase(executeCode.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(executeCode.fulfilled, (state, action: PayloadAction<ExecutionResult>) => {
                state.isLoading = false;
                state.result = action.payload;
            })
            .addCase(executeCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(runTestsCode.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(runTestsCode.fulfilled, (state, action: PayloadAction<TestsRunResponse>) => {
                state.isLoading = false;
                state.tests = action.payload;
            })
            .addCase(runTestsCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: interviewCodeEditorActions } = interviewCodeEditorSlice;
export const { reducer: interviewCodeEditorReducer } = interviewCodeEditorSlice;
