import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExecutionResult } from 'entities/CodeEditor';
import { TaskSolutionInfo } from 'entities/Task';
import { LastSavedCodeResponse } from 'pages/InterviewPage';
import { fetchReviewData } from '../services/fetchReviewData/fetchReviewData.ts';
import { fetchTaskSolutionsInfo } from '../services/fetchTaskSolutionsInfo/fetchTaskSolutionsInfo.ts';
import { fetchLastSolutionSavedCode } from '../services/fetchLastSolutionSavedCode/fetchLastSolutionSavedCode.ts';
import { ReviewInfo } from 'pages/SyncReviewPage';
import { executeReviewCode } from '../services/executeReviewCode/executeReviewCode.ts';
import { AsyncReviewPageSchema } from '../..';

const initialState: AsyncReviewPageSchema = {
    isLoading: false,
    error: undefined,
    tasks: [],
    interview: undefined,
    currentTask: undefined,
    currentTaskCode: '',
    currentTaskId: undefined,
};

export const asyncReviewPageSlice = createSlice({
    name: 'asyncReviewPage',
    initialState,
    reducers: {
        setCurrentTaskCode: (state, action: PayloadAction<string>) => {
            state.currentTaskCode = action.payload;
        },
        setCurrentTask: (state, action: PayloadAction<TaskSolutionInfo>) => {
            state.currentTask = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReviewData.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchReviewData.fulfilled, (state, action: PayloadAction<ReviewInfo>) => {
                state.isLoading = false;
                state.interview = action.payload;
            })
            .addCase(fetchReviewData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTaskSolutionsInfo.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchTaskSolutionsInfo.fulfilled,
                (state, action: PayloadAction<TaskSolutionInfo[]>) => {
                    state.isLoading = false;
                    state.tasks = action.payload;
                },
            )
            .addCase(fetchTaskSolutionsInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchLastSolutionSavedCode.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchLastSolutionSavedCode.fulfilled,
                (state, action: PayloadAction<LastSavedCodeResponse>) => {
                    state.isLoading = false;
                    if (action.payload.code) {
                        state.currentTaskCode = action.payload.code;
                    }
                },
            )
            .addCase(fetchLastSolutionSavedCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(executeReviewCode.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                executeReviewCode.fulfilled,
                (state, action: PayloadAction<ExecutionResult>) => {
                    state.isLoading = false;
                    state.executionResult = action.payload;
                },
            )
            .addCase(executeReviewCode.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: asyncReviewPageActions } = asyncReviewPageSlice;
export const { reducer: asyncReviewPageReducer } = asyncReviewPageSlice;
