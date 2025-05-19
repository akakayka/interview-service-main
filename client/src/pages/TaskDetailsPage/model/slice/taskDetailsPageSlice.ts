import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskInfo } from 'entities/Task';
import { TaskDetailsPageSchema } from '../..';
import { fetchTaskDetails } from '../services/fetchTaskDetails/fetchTaskDetails.ts';

const initialState: TaskDetailsPageSchema = {
    isLoading: false,
    error: undefined,
    taskDetails: undefined,
};

export const taskDetailsPageSlice = createSlice({
    name: 'taskDetailsPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskDetails.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchTaskDetails.fulfilled, (state, action: PayloadAction<TaskInfo>) => {
                state.isLoading = false;
                state.taskDetails = action.payload;
            })
            .addCase(fetchTaskDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: taskDetailsPageActions } = taskDetailsPageSlice;
export const { reducer: taskDetailsPageReducer } = taskDetailsPageSlice;
