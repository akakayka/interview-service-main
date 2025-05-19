import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { getCreateInterviewPageForm } from '../../selectors/createInterviewPageSelectors.ts';
import { CreateInterviewForm } from '../../types/createInterviewPage.ts';

export const createInterview = createAsyncThunk<void, void, ThunkConfig<string>>(
    'createInterviewPage/createInterview',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState, dispatch } = thunkApi;

        const data = getCreateInterviewPageForm(getState());

        if (!data) {
            return rejectWithValue('Переданы неверные данные');
        }

        try {
            const response = await extra.api.post<void, CreateInterviewForm>('/Interviews', data);
            if (!response) {
                throw new Error();
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
