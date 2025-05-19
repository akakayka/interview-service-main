import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const startInterview = createAsyncThunk<void, string, ThunkConfig<string>>(
    'candidateStartPage/startInterview',
    async (interviewSolutionId, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        if (!interviewSolutionId) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.put(`contest/start-i-sln?id=${interviewSolutionId}`);
            if (response.status !== 200) {
                return rejectWithValue('не удалось получить список задач');
            }

            return;
        } catch (e) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
                dispatch(userActions.clearToken());
            }
            return rejectWithValue(error.message + ' ' + error.code);
        }
    },
);
