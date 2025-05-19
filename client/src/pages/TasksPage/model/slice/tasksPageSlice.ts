import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskInfo } from 'entities/Task';
import { TasksSchema } from '../types/tasks.ts';
import { fetchTasksList } from '../services/fetchTasksList/fetchTasksList.ts';

const initialState: TasksSchema = {
    isLoading: false,
    error: undefined,
    tasks: [],
};

export const tasksPageSlice = createSlice({
    name: 'tasksPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasksList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchTasksList.fulfilled, (state, action: PayloadAction<TaskInfo[]>) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasksList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: tasksPageActions } = tasksPageSlice;
export const { reducer: tasksPageReducer } = tasksPageSlice;
