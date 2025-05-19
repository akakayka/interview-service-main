import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { CreateTaskPageSchema } from '../../model/types/createTask.ts';
import { createTask } from '../services/createTask/createTask.ts';

const initialState: CreateTaskPageSchema = {
    isLoading: false,
    error: undefined,
    createTaskForm: {
        taskText: '',
        name: '',
        programmingLanguage: ProgrammingLanguage.unknown,
        testsCode: '',
        runAttempts: 1000,
        startCode: '',
    },
    success: false,
};

export const createTaskPageSlice = createSlice({
    name: 'createTaskPage',
    initialState,
    reducers: {
        setTaskText: (state, action: PayloadAction<string>) => {
            state.createTaskForm.taskText = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.createTaskForm.name = action.payload;
        },
        setStartCode: (state, action: PayloadAction<string>) => {
            state.createTaskForm.startCode = action.payload;
        },
        setTestsCode: (state, action: PayloadAction<string>) => {
            state.createTaskForm.testsCode = action.payload;
        },
        setProgrammingLanguage: (state, action: PayloadAction<ProgrammingLanguage>) => {
            state.createTaskForm.programmingLanguage = action.payload;
        },
        setRunAttempts: (state, action: PayloadAction<number>) => {
            state.createTaskForm.runAttempts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTask.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(createTask.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
                state.success = false;
            });
    },
});

export const { actions: createTaskPageActions } = createTaskPageSlice;
export const { reducer: createTaskPageReducer } = createTaskPageSlice;
