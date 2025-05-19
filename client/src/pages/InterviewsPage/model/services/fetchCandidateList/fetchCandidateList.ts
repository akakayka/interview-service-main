import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { userActions } from 'entities/User';
import { AxiosError } from 'axios';
import { CandidateInfo } from '../../types/interviewsSchema.ts';

export const fetchCandidateList = createAsyncThunk<CandidateInfo[], void, ThunkConfig<string>>(
    'interviewsPage/fetchCandidateList',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        try {
            const response = await extra.api.get('/cards');

            if (!response.data) {
                rejectWithValue('no response data');
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
