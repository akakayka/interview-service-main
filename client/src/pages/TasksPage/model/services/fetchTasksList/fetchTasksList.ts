import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';

import { TaskInfo } from 'entities/Task';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const fetchTasksList = createAsyncThunk<TaskInfo[], void, ThunkConfig<string>>(
    'tasksPage/fetchVacancyEditAllTasks',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        try {
            const response = await extra.api.get('/Tasks');
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
