import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { TaskInfo } from 'entities/Task';

export const deleteOldVacancy = createAsyncThunk<TaskInfo, string | undefined, ThunkConfig<string>>(
    'vacancyEditPage/deleteVacancy',
    async (interviewId, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        if (!interviewId) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.post(`interviews/delete-interview?id=${interviewId}`);
            if (response.status !== 200) {
                return rejectWithValue('не удалось удалить интервью');
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
