import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewInfoPageSchema } from '../types/interviewInfoPage.ts';
import { fetchInterviewInfo } from '../services/fetchInterviewInfo/fetchInterviewInfo.ts';
import { ReviewInfo } from 'pages/SyncReviewPage';
import { sendComment } from '../services/sendComment/sendComment.ts';

const initialState: InterviewInfoPageSchema = {
    isLoading: false,
    error: undefined,
    interviewInfo: {},
    comment: '',
};

export const interviewInfoPageSlice = createSlice({
    name: 'interviewInfoPage',
    initialState,
    reducers: {
        setComment: (state, action: PayloadAction<string>) => {
            state.comment = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchInterviewInfo.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchInterviewInfo.fulfilled, (state, action: PayloadAction<ReviewInfo>) => {
                state.isLoading = false;
                state.interviewInfo = action.payload;
                state.comment = action.payload.reviewerComment ?? '';
            })
            .addCase(fetchInterviewInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(sendComment.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(sendComment.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(sendComment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: interviewInfoPageActions } = interviewInfoPageSlice;
export const { reducer: interviewInfoPageReducer } = interviewInfoPageSlice;
