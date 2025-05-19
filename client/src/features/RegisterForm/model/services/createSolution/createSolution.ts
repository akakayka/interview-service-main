import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { ErrorMessage, mapErrorToString } from 'shared/consts/error.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { userActions } from 'entities/User';

export interface RegisterByEmailProps {
    email: string;
    passwordHash: string;
    firstName: string;
    surname: string;
    phone: string;
    invite: string;
}

export const createSolution = createAsyncThunk<void, string | undefined, ThunkConfig<string>>(
    'registerForm/createSolution',
    async (invite, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        if (!invite) {
            return rejectWithValue('Нет айди приглашения');
        }

        try {
            const response = await extra.api.post(
                `${UrlRoutes.user}auth/register-contest?invite=${invite}`,
            );

            if (response.status !== 200) {
                return rejectWithValue('Произошла ошибка');
            }

            return;
        } catch (e) {
            const error = e as AxiosError;
            if (error.status === 401) {
                dispatch(userActions.clearToken());
            }
            return rejectWithValue(mapErrorToString[error.response?.data as ErrorMessage]);
        }
    },
);
