import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchInterviewData } from '../services/fetchInterviewData/fetchInterviewData.ts';
import { InterviewSolutionInfo } from 'entities/Interview';
import { fetchTasksData } from '../services/fetchTasksData/fetchTasksData.ts';
import { InterviewPageSchema } from '../types/interviewPage';
import { TaskSolutionInfo } from 'entities/Task';

const initialState: InterviewPageSchema = {
    isLoading: false,
    pageLoading: false,
    error: undefined,
    tasks: [],
    interview: undefined,
};

export const interviewPageSlice = createSlice({
    name: 'interviewPage',
    initialState,
    reducers: {
        setTaskDone: (state, action: PayloadAction<TaskSolutionInfo>) => {
            state.tasks.forEach((task) => {
                if (task.id === action.payload.id) {
                    task.isDone = true;
                }
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterviewData.pending, (state) => {
                state.error = undefined;
                state.pageLoading = true;
            })
            .addCase(
                fetchInterviewData.fulfilled,
                (state, action: PayloadAction<InterviewSolutionInfo>) => {
                    state.pageLoading = false;
                    state.interview = action.payload;
                },
            )
            .addCase(fetchInterviewData.rejected, (state, action) => {
                state.pageLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTasksData.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchTasksData.fulfilled,
                (state, action: PayloadAction<TaskSolutionInfo[]>) => {
                    state.isLoading = false;
                    state.tasks = action.payload;
                },
            )
            .addCase(fetchTasksData.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: interviewPageActions } = interviewPageSlice;
export const { reducer: interviewPageReducer } = interviewPageSlice;
