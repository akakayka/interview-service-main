import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewInfo } from 'widgets/MeetingsList';
import { fetchVacancyDetails } from '../services/fetchVacancyDetails/fetchVacancyDetails.ts';
import { VacancyDetailsPageSchema } from '../../model/types/vacancyDetails.ts';
import { fetchVacancyTasks } from '../services/fetchVacancyTasks/fetchVacancyTasks.ts';
import { TaskInfo } from 'entities/Task';

const initialState: VacancyDetailsPageSchema = {
    isLoading: false,
    error: undefined,
    vacancy: undefined,
    tasks: [],
};

export const vacancyDetailsPageSlice = createSlice({
    name: 'vacancyDetailsPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVacancyDetails.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchVacancyDetails.fulfilled,
                (state, action: PayloadAction<InterviewInfo>) => {
                    state.isLoading = false;
                    state.vacancy = action.payload;
                },
            )
            .addCase(fetchVacancyDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchVacancyTasks.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchVacancyTasks.fulfilled, (state, action: PayloadAction<TaskInfo[]>) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchVacancyTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: vacancyDetailsPageActions } = vacancyDetailsPageSlice;
export const { reducer: vacancyDetailsPageReducer } = vacancyDetailsPageSlice;
