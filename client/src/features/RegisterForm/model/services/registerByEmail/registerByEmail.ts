import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { User } from 'entities/User';
import { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';
import { loginByEmail } from 'features/LoginForm';
import { ErrorMessage, mapErrorToString } from 'shared/consts/error.ts';

export interface RegisterByEmailProps {
    email: string;
    passwordHash: string;
    firstName: string;
    surname: string;
    phone: string;
    invite: string;
}

interface RegisterByEmailResponse {
    config: AxiosRequestConfig;
    data: void;
    headers: AxiosHeaders;
    request: XMLHttpRequest;
    status: number;
    statusText: string;
}

export const registerByEmail = createAsyncThunk<void, RegisterByEmailProps, ThunkConfig<string>>(
    'registerForm/registerByEmail',
    async (authData, thunkApi) => {
        const { extra, dispatch, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.post<User, RegisterByEmailResponse>(
                `users/register?invite=${authData.invite}`,
                {
                    email: authData.email,
                    firstName: authData.firstName,
                    surname: authData.surname,
                    phoneNumber: authData.phone,
                    passwordHash: authData.passwordHash,
                },
            );

            if (response.status !== 200) {
                return rejectWithValue('Произошла ошибка');
            }
            const data = {
                email: authData.email,
                passwordHash: authData.passwordHash,
            };

            dispatch(loginByEmail(data));
            return;
        } catch (e) {
            const error = e as AxiosError;
            return rejectWithValue(mapErrorToString[error.response?.data as ErrorMessage]);
        }
    },
);
