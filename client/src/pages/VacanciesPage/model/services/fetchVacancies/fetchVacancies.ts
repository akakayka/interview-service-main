import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { InterviewInfo } from 'widgets/MeetingsList';

export const fetchVacancies = createAsyncThunk<InterviewInfo[], void, ThunkConfig<string>>(
    'vacanciesPage/fetchVacancies',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get('/interviews');
            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            const error = e as AxiosError;
            return rejectWithValue(error.code + ' ' + error.message);
        }
    },
);
