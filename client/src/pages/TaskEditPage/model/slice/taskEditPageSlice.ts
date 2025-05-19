import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskInfo } from 'entities/Task';
import { TaskEditPageSchema } from '../../model/types/taskEditPage.ts';
import { fetchTaskEditInfo } from '../services/fetchTaskEditInfo/fetchTaskEditInfo.ts';
import { deleteOldTask } from '../services/deleteOldTask/deleteOldTask.ts';
import { createNewTask } from '../services/createNewTask/createNewTask.ts';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

const initialState: TaskEditPageSchema = {
    isLoading: false,
    error: undefined,
    taskEditForm: {
        taskText: '',
        name: '',
        runAttempts: 1000,
        startCode: '',
        testsCode: '',
        programmingLanguage: ProgrammingLanguage.unknown,
    },
    newTaskId: undefined,
};

export const taskEditPageSlice = createSlice({
    name: 'taskEditPage',
    initialState,
    reducers: {
        setTaskText: (state, action: PayloadAction<string>) => {
            state.taskEditForm.taskText = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.taskEditForm.name = action.payload;
        },
        setStartCode: (state, action: PayloadAction<string>) => {
            state.taskEditForm.startCode = action.payload;
        },
        setTestsCode: (state, action: PayloadAction<string>) => {
            state.taskEditForm.testsCode = action.payload;
        },
        setProgrammingLanguage: (state, action: PayloadAction<ProgrammingLanguage>) => {
            state.taskEditForm.programmingLanguage = action.payload;
        },
        setRunAttempts: (state, action: PayloadAction<number>) => {
            state.taskEditForm.runAttempts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTaskEditInfo.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchTaskEditInfo.fulfilled, (state, action: PayloadAction<TaskInfo>) => {
                state.isLoading = false;
                state.taskEditForm = action.payload;
            })
            .addCase(fetchTaskEditInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteOldTask.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(deleteOldTask.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteOldTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createNewTask.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                createNewTask.fulfilled,
                (state, action: PayloadAction<{ taskId: string }>) => {
                    state.isLoading = false;
                    state.newTaskId = action.payload.taskId;
                },
            )
            .addCase(createNewTask.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: taskEditPageActions } = taskEditPageSlice;
export const { reducer: taskEditPageReducer } = taskEditPageSlice;
