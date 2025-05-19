import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchMeetingsList } from '../services/fetchMeetingsList/fetchMeetingsList.ts';
import { MeetingInfo, MeetingSchema } from '../../model/types/meetings.ts';

const initialState: MeetingSchema = {
    isLoading: false,
    error: undefined,
    meetings: [],
};

export const meetingsPageSlice = createSlice({
    name: 'meetingsPage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeetingsList.pending, (state) => {
                state.error = undefined;
                state.isLoading = true;
            })
            .addCase(fetchMeetingsList.fulfilled, (state, action: PayloadAction<MeetingInfo[]>) => {
                state.isLoading = false;
                state.meetings = action.payload;
            })
            .addCase(fetchMeetingsList.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { actions: meetingsPageActions } = meetingsPageSlice;
export const { reducer: meetingsPageReducer } = meetingsPageSlice;
