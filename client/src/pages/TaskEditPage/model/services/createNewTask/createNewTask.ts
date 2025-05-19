import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { ErrorMessage, mapErrorToString } from 'shared/consts/error.ts';
import { getTaskEditPageForm } from '../../selectors/taskEditPageSelectors.ts';

export const createNewTask = createAsyncThunk<{ taskId: string }, void, ThunkConfig<string>>(
    'taskEditPage/createNewTask',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState, dispatch } = thunkApi;

        const data = getTaskEditPageForm(getState());

        if (!data) {
            return rejectWithValue('Переданы неверные данные');
        }

        try {
            const response = await extra.api.post('/Tasks', data);
            if (!response) {
                throw new Error();
            }

            return response.data;
        } catch (e: unknown) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
                dispatch(userActions.clearToken());
            }
            return rejectWithValue(mapErrorToString[error.response?.data as ErrorMessage]);
        }
    },
);
