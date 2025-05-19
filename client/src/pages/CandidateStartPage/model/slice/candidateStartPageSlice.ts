import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewSolutionInfo } from 'entities/Interview';
import { CandidateStartPageSchema } from '../types/candidateStartPage.ts';
import { startInterview } from '../services/startInterview/startInterview.ts';
import { fetchInterviewSolutionInfo } from '../services/fetchInterviewSolutionInfo/fetchInterviewSolutionInfo.ts';

const initialState: CandidateStartPageSchema = {
    isLoading: false,
    pageLoading: false,
    error: undefined,
    solutionInfo: undefined,
};

export const candidateStartPageSlice = createSlice({
    name: 'candidateStartPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(startInterview.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(startInterview.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(startInterview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchInterviewSolutionInfo.pending, (state) => {
                state.error = undefined;
                state.pageLoading = true;
            })
            .addCase(
                fetchInterviewSolutionInfo.fulfilled,
                (state, action: PayloadAction<InterviewSolutionInfo>) => {
                    state.pageLoading = false;
                    state.solutionInfo = action.payload;
                },
            )
            .addCase(fetchInterviewSolutionInfo.rejected, (state, action) => {
                state.pageLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: candidateStartPageActions } = candidateStartPageSlice;
export const { reducer: candidateStartPageReducer } = candidateStartPageSlice;
