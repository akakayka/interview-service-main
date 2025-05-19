import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VacancyEditPageSchema } from '../../model/types/vacancyEditPage.ts';
import { fetchVacancyEditInfo } from '../services/fetchVacancyEditInfo/fetchVacancyEditInfo.ts';
import { createNewInterview } from '../services/createNewInterview/createNewInterview.ts';
import { deleteOldVacancy } from '../services/deleteOldVacancy/deleteOldVacancy.ts';
import { fetchVacancyEditAllTasks } from '../services/fetchVacancyEditAllTasks/fetchVacancyEditAllTasks.ts';
import { TaskInfo } from 'entities/Task';
import { fetchVacancyEditSelectedTasks } from '../services/fetchVacancyEditSelectedTasks/fetchVacancyEditSelectedTasks.ts';
import { InterviewInfo } from 'widgets/MeetingsList';

const initialState: VacancyEditPageSchema = {
    isLoading: false,
    error: undefined,
    tasks: [],
    vacancyEditForm: {
        vacancy: '',
        taskIds: [],
        interviewDurationMs: -1,
        interviewText: '',
    },
    newInterviewId: undefined,
};

export const vacancyEditPageSlice = createSlice({
    name: 'vacancyEditPage',
    initialState,
    reducers: {
        setTime: (state, action: PayloadAction<number>) => {
            state.vacancyEditForm.interviewDurationMs = action.payload;
        },
        setInterviewText: (state, action: PayloadAction<string>) => {
            state.vacancyEditForm.interviewText = action.payload;
        },
        setVacancy: (state, action: PayloadAction<string>) => {
            state.vacancyEditForm.vacancy = action.payload;
        },
        pushTaskId: (state, action: PayloadAction<string>) => {
            state.vacancyEditForm.taskIds.push(action.payload);
        },
        removeTaskId: (state, action: PayloadAction<string>) => {
            state.vacancyEditForm.taskIds = state.vacancyEditForm.taskIds.filter(
                (taskId) => taskId !== action.payload,
            );
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVacancyEditInfo.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchVacancyEditInfo.fulfilled,
                (state, action: PayloadAction<InterviewInfo>) => {
                    state.isLoading = false;
                    state.vacancyEditForm.vacancy = action.payload.vacancy;
                    state.vacancyEditForm.interviewText = action.payload.interviewText;
                    state.vacancyEditForm.interviewDurationMs = action.payload.interviewDurationMs;
                },
            )
            .addCase(fetchVacancyEditInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteOldVacancy.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(deleteOldVacancy.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(deleteOldVacancy.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createNewInterview.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                createNewInterview.fulfilled,
                (state, action: PayloadAction<{ interviewId: string }>) => {
                    state.isLoading = false;
                    state.newInterviewId = action.payload.interviewId;
                },
            )
            .addCase(createNewInterview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchVacancyEditAllTasks.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchVacancyEditAllTasks.fulfilled,
                (state, action: PayloadAction<TaskInfo[]>) => {
                    state.isLoading = false;
                    state.tasks = action.payload;
                },
            )
            .addCase(fetchVacancyEditAllTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchVacancyEditSelectedTasks.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchVacancyEditSelectedTasks.fulfilled,
                (state, action: PayloadAction<string[]>) => {
                    state.isLoading = false;
                    state.vacancyEditForm.taskIds = action.payload;
                },
            )
            .addCase(fetchVacancyEditSelectedTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: vacancyEditPageActions } = vacancyEditPageSlice;
export const { reducer: vacancyEditPageReducer } = vacancyEditPageSlice;
