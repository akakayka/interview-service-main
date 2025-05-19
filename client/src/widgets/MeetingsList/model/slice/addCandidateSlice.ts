import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AddCandidateSchema, InterviewInfo } from '../types/addCandidate.ts';
import { createInvite } from '../services/createInvite/createInvite.ts';
import { fetchInterviewsList } from '../services/fetchinterviewsList/fetchInterviewsList.ts';

const initialState: AddCandidateSchema = {
    isLoading: false,
    error: undefined,
    link: '',
    form: {
        role: '',
        isSynchronous: false,
        interviewId: '0',
    },
    interviews: [],
};

export const addCandidateSlice = createSlice({
    name: 'addCandidate',
    initialState,
    reducers: {
        setLink: (state, action: PayloadAction<string>) => {
            state.link = action.payload;
        },
        setIsSynchronous: (state, action: PayloadAction<boolean>) => {
            state.form.isSynchronous = action.payload;
        },
        setInterviewId: (state, action: PayloadAction<string>) => {
            state.form.interviewId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createInvite.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(createInvite.fulfilled, (state, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.link = action.payload;
            })
            .addCase(createInvite.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchInterviewsList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(
                fetchInterviewsList.fulfilled,
                (state, action: PayloadAction<InterviewInfo[]>) => {
                    state.isLoading = false;
                    state.interviews = action.payload;
                },
            )
            .addCase(fetchInterviewsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: addCandidateActions } = addCandidateSlice;
export const { reducer: addCandidateReducer } = addCandidateSlice;
