import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VacanciesPageSchema } from '../../model/types/vacanciesPage.ts';
import { fetchVacancies } from '../services/fetchVacancies/fetchVacancies.ts';
import { InterviewInfo } from 'widgets/MeetingsList';

const initialState: VacanciesPageSchema = {
    isLoading: false,
    error: undefined,
    interviews: [],
};

export const vacanciesPageSlice = createSlice({
    name: 'vacanciesPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVacancies.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchVacancies.fulfilled, (state, action: PayloadAction<InterviewInfo[]>) => {
                state.isLoading = false;
                state.interviews = action.payload;
            })
            .addCase(fetchVacancies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: vacanciesPageActions } = vacanciesPageSlice;
export const { reducer: vacanciesPageReducer } = vacanciesPageSlice;
