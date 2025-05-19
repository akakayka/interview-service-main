import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { LastSavedCodeResponse } from 'pages/InterviewPage';
import { saveCodeLocal } from '../../lib/savingService.ts';
import { AxiosError } from 'axios';

export const fetchLastSavedCode = createAsyncThunk<
    LastSavedCodeResponse,
    string,
    ThunkConfig<string>
>('interviewCodeEditor/fetchLastSavedCode', async (taskId, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    if (!taskId) {
        return rejectWithValue('no task id');
    }

    try {
        const response = await extra.api.get(
            `${UrlRoutes.tracker}get-last-code?taskSolutionId=${taskId}`,
        );

        if (response.status !== 200) {
            return rejectWithValue('не удалось получить последний код задачи');
        }

        if (response.data.code) {
            saveCodeLocal(taskId, response.data.code);
        }

        return response.data;
    } catch (e) {
        const error = e as AxiosError;
        return rejectWithValue(error.code + ' ' + error.message);
    }
});
