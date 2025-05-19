import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidateInfo, InterviewsSchema } from '../types/interviewsSchema.ts';
import { fetchCandidateList } from '../../model/services/fetchCandidateList/fetchCandidateList.ts';

const initialState: InterviewsSchema = {
    isLoading: false,
    error: undefined,
    candidates: [],
};

export const interviewsPageSlice = createSlice({
    name: 'interviewsPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidateList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchCandidateList.fulfilled,
                (state, action: PayloadAction<CandidateInfo[]>) => {
                    state.isLoading = false;
                    state.candidates = action.payload;
                },
            )
            .addCase(fetchCandidateList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: interviewsPageActions } = interviewsPageSlice;
export const { reducer: interviewsPageReducer } = interviewsPageSlice;
