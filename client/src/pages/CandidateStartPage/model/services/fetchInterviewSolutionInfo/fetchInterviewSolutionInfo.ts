import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { InterviewSolutionInfo } from 'entities/Interview';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const fetchInterviewSolutionInfo = createAsyncThunk<
    InterviewSolutionInfo,
    void,
    ThunkConfig<string>
>('candidateStartPage/fetchInterviewSolutionInfo', async (_, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    try {
        const response = await extra.api.get(`contest/i-sln-info`);
        if (response.status !== 200) {
            return rejectWithValue('не удалось получить данные интервью');
        }

        return response.data;
    } catch (e) {
        const error = e as AxiosError;
        if (error.response?.status === 401) {
            dispatch(userActions.clearToken());
        }
        return rejectWithValue(error.message + ' ' + error.code);
    }
});
