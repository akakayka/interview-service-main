import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { LastSavedCodeResponse } from 'pages/InterviewPage';

export const fetchLastSolutionSavedCode = createAsyncThunk<
    LastSavedCodeResponse,
    string,
    ThunkConfig<string>
>('reviewPage/fetchLastSolutionSavedCode', async (taskId, thunkApi) => {
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

        return response.data;
    } catch (e) {
        return rejectWithValue(e as string);
    }
});
