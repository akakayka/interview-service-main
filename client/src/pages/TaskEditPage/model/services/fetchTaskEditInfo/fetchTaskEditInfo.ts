import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { TaskInfo } from 'entities/Task';

export const fetchTaskEditInfo = createAsyncThunk<
    TaskInfo,
    string | undefined,
    ThunkConfig<string>
>('taskEditPage/fetchTaskEditInfo', async (taskId, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    if (!taskId) {
        return rejectWithValue('no task id');
    }

    try {
        const response = await extra.api.get(`Tasks/task-id?id=${taskId}`);
        if (response.status !== 200) {
            return rejectWithValue('не удалось получить данные задачи');
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
