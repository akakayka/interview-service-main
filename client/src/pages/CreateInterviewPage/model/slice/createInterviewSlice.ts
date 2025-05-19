import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskInfo } from 'entities/Task';
import { CreateInterviewPageSchema } from '../types/createInterviewPage.ts';
import { fetchTasks } from '../services/fetchTasks/fetchTasks.ts';
import { createInterview } from '../services/createInterview/createInterview.ts';

const initialState: CreateInterviewPageSchema = {
    isLoading: false,
    error: undefined,
    tasks: [],
    createInterviewForm: {
        interviewDurationMs: 3600000,
        interviewText: '',
        taskIds: [],
        vacancy: '',
    },
    success: false,
};

export const createInterviewPageSlice = createSlice({
    name: 'createInterviewPage',
    initialState,
    reducers: {
        setTime: (state, action: PayloadAction<number>) => {
            state.createInterviewForm.interviewDurationMs = action.payload;
        },
        setInterviewText: (state, action: PayloadAction<string>) => {
            state.createInterviewForm.interviewText = action.payload;
        },
        setVacancy: (state, action: PayloadAction<string>) => {
            state.createInterviewForm.vacancy = action.payload;
        },
        pushTaskId: (state, action: PayloadAction<string>) => {
            state.createInterviewForm.taskIds.push(action.payload);
        },
        removeTaskId: (state, action: PayloadAction<string>) => {
            state.createInterviewForm.taskIds = state.createInterviewForm.taskIds.filter(
                (taskId) => taskId !== action.payload,
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<TaskInfo[]>) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createInterview.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(createInterview.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(createInterview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { actions: createInterviewPageActions } = createInterviewPageSlice;
export const { reducer: createInterviewPageReducer } = createInterviewPageSlice;
