import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { InterviewSolutionInfo } from 'entities/Interview';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const fetchInterviewData = createAsyncThunk<
    InterviewSolutionInfo,
    void,
    ThunkConfig<string>
>('interviewPage/fetchInterviewData', async (_, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    try {
        const response = await extra.api.get(`contest/i-sln-info`);
        return response.data;
    } catch (e) {
        const error = e as AxiosError;
        if (error.response?.status === 401) {
            console.log('401');
            dispatch(userActions.clearToken());
        }
        return rejectWithValue(error.message + ' ' + error.code);
    }
});
