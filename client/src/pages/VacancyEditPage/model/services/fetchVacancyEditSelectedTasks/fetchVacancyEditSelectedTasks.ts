import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';

export const fetchVacancyEditSelectedTasks = createAsyncThunk<
    string[],
    string | undefined,
    ThunkConfig<string>
>('vacancyEditPage/fetchVacancyEditSelectedTasks', async (vacancyId, thunkApi) => {
    const { extra, rejectWithValue } = thunkApi;

    if (!vacancyId) {
        return rejectWithValue('Нет айди вакансии');
    }

    try {
        const response = await extra.api.get(
            `${UrlRoutes.user}interviews/get-interview-tasksId?id=${vacancyId}`,
        );
        if (!response.data) {
            throw new Error();
        }

        return response.data;
    } catch (e) {
        const error = e as AxiosError;
        return rejectWithValue(error.code + ' ' + error.message);
    }
});
