import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidateInterviewsPageSchema } from '../../model/types/candidateInterviewsPage.ts';
import { fetchCandidateCards } from '../services/fetchCandidateCards/fetchCandidateCards.ts';
import { CandidateInfo } from 'pages/InterviewsPage';
import { fetchCandidateMeets } from '../services/fetchCandidateMeets/fetchCandidateMeets.ts';
import { MeetingInfo } from 'pages/MeetingsPage';

const initialState: CandidateInterviewsPageSchema = {
    isLoading: false,
    error: undefined,
    cards: [],
    meets: [],
};

export const candidateInterviewsPageSlice = createSlice({
    name: 'asyncReviewPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidateCards.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchCandidateCards.fulfilled,
                (state, action: PayloadAction<CandidateInfo[]>) => {
                    state.isLoading = false;
                    state.cards = action.payload;
                },
            )
            .addCase(fetchCandidateCards.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchCandidateMeets.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchCandidateMeets.fulfilled,
                (state, action: PayloadAction<MeetingInfo[]>) => {
                    state.isLoading = false;
                    state.meets = action.payload;
                },
            )
            .addCase(fetchCandidateMeets.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: candidateInterviewsPageActions } = candidateInterviewsPageSlice;
export const { reducer: candidateInterviewsPageReducer } = candidateInterviewsPageSlice;
