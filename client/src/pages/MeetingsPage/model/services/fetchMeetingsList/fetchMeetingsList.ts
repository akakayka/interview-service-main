import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { MeetingInfo } from '../../../model/types/meetings.ts';

export const fetchMeetingsList = createAsyncThunk<MeetingInfo[], void, ThunkConfig<string>>(
    'meetingsPage/fetchMeetings',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        try {
            const response = await extra.api.get('/meets');
            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
                dispatch(userActions.clearToken());
            }
            return rejectWithValue(error.message + ' ' + error.code);
        }
    },
);
