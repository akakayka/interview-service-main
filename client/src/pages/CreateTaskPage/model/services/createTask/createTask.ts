import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { getCreateTaskPageForm } from '../../selectors/createTaskPageSelectors.ts';
import { CreateTaskForm } from '../../types/createTask.ts';
import { ErrorMessage, mapErrorToString } from 'shared/consts/error.ts';

export const createTask = createAsyncThunk<void, void, ThunkConfig<string>>(
    'createTaskPage/createNewTask',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState, dispatch } = thunkApi;

        const data = getCreateTaskPageForm(getState());

        if (!data) {
            return rejectWithValue('Переданы неверные данные');
        }

        try {
            const response = await extra.api.post<void, CreateTaskForm>('/Tasks', data);
            if (!response) {
                throw new Error();
            }

            return;
        } catch (e: unknown) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
                dispatch(userActions.clearToken());
            }
            return rejectWithValue(mapErrorToString[error.response?.data as ErrorMessage]);
        }
    },
);
