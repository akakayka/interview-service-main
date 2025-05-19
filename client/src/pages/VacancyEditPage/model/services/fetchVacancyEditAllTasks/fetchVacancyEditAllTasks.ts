import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';

import { TaskInfo } from 'entities/Task';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const fetchVacancyEditAllTasks = createAsyncThunk<
    TaskInfo[],
    string | undefined,
    ThunkConfig<string>
>('vacancyEditPage/fetchVacancyEditAllTasks', async (interviewId, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    if (!interviewId) {
        return rejectWithValue('no interview id');
    }

    try {
        const response = await extra.api.get(
            `/interviews/get-tasks-for-interview?id=${interviewId}`,
        );
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
});
