import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { ReviewInfo } from '../../types/reviewPage.ts';

export const fetchReviewData = createAsyncThunk<
    ReviewInfo,
    string | undefined,
    ThunkConfig<string>
>('reviewPage/fetchReviewData', async (interviewSolutionId, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    if (!interviewSolutionId) {
        return rejectWithValue('no interview id');
    }

    try {
        const response = await extra.api.get(`interviews/solution?id=${interviewSolutionId}`);
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
