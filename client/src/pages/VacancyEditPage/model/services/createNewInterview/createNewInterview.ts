import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { getVacancyEditPageForm } from '../../selectors/vacancyEditPageSelectors.ts';

export const createNewInterview = createAsyncThunk<
    { interviewId: string },
    void,
    ThunkConfig<string>
>('vacancyEditPage/createNewInterview', async (_, thunkApi) => {
    const { extra, rejectWithValue, getState, dispatch } = thunkApi;

    const data = getVacancyEditPageForm(getState());

    if (!data) {
        return rejectWithValue('Переданы неверные данные');
    }

    try {
        const response = await extra.api.post('/Interviews', data);
        if (!response) {
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
