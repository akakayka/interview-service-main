import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { InterviewInfo } from '../../types/addCandidate.ts';

export const fetchInterviewsList = createAsyncThunk<InterviewInfo[], void, ThunkConfig<string>>(
    'addCandidateForm/fetchInterviews',
    async (_, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.get('/interviews');
            if (!response.data) {
                throw new Error();
            }

            return response.data;
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);
