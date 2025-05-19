import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidateInterviewInfoSchema } from '../..';
import { fetchCandidateInterviewInfo } from '../services/fetchCandidateInterviewInfo/fetchCandidateInterviewInfo.ts';
import { ReviewInfo } from 'pages/SyncReviewPage';

const initialState: CandidateInterviewInfoSchema = {
    isLoading: false,
    error: undefined,
    interviewInfo: undefined,
};

export const candidateInterviewInfoPageSlice = createSlice({
    name: 'candidateInterviewInfoPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCandidateInterviewInfo.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchCandidateInterviewInfo.fulfilled,
                (state, action: PayloadAction<ReviewInfo>) => {
                    state.isLoading = false;
                    state.interviewInfo = action.payload;
                },
            )
            .addCase(fetchCandidateInterviewInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: candidateInterviewInfoPageActions } = candidateInterviewInfoPageSlice;
export const { reducer: candidateInterviewInfoPageReducer } = candidateInterviewInfoPageSlice;
