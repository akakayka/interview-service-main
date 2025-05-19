import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const endTaskSolution = createAsyncThunk<void, string, ThunkConfig<string>>(
    'interviewPage/endTaskSolution',
    async (taskId, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        if (!taskId) {
            return rejectWithValue('no task id');
        }

        try {
            const response = await extra.api.put(`contest/end-task-sln?id=${taskId}`);
            if (response.status !== 200) {
                return rejectWithValue('не удалось сдать задачу');
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
