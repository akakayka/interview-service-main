import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { TaskSolutionInfo } from 'entities/Task';
import { LastSavedCodeResponse } from 'pages/InterviewPage';
import { ReviewInfo, ReviewPageSchema } from '../types/reviewPage.ts';
import { fetchReviewData } from '../services/fetchReviewData/fetchReviewData.ts';
import { fetchTaskSolutionsInfo } from '../services/fetchTaskSolutionsInfo/fetchTaskSolutionsInfo.ts';
import { fetchLastSolutionSavedCode } from '../services/fetchLastSolutionSavedCode/fetchLastSolutionSavedCode.ts';

const initialState: ReviewPageSchema = {
    isLoading: false,
    error: undefined,
    tasks: [],
    interview: undefined,
    currentTask: undefined,
    currentTaskCode: '',
    currentTaskId: undefined,
};

export const reviewPageSlice = createSlice({
    name: 'reviewPage',
    initialState,
    reducers: {
        setCurrentTaskCode: (state, action: PayloadAction<string>) => {
            state.currentTaskCode = action.payload;
        },
        setCurrentTaskId: (state, action: PayloadAction<string>) => {
            state.currentTaskId = action.payload;
        },
        setCurrentTask: (state, action: PayloadAction<TaskSolutionInfo>) => {
            state.currentTask = action.payload;
        },
        setTestsResult: (state, action: PayloadAction<TestsRunResponse>) => {
            state.testsResult = action.payload;
        },
        setExecutionResult: (state, action: PayloadAction<ExecutionResult>) => {
            state.executionResult = action.payload;
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
            });
    },
});

export const { actions: reviewPageActions } = reviewPageSlice;
export const { reducer: reviewPageReducer } = reviewPageSlice;
