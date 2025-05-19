import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { JWTSession, User, userActions, validateSessionToken } from 'entities/User';
import { AxiosError, AxiosHeaders, AxiosRequestConfig } from 'axios';

interface LoginByEmailProps {
    email: string;
    passwordHash: string;
    invite?: string;
}

interface LoginByEmailResponse {
    config: AxiosRequestConfig;
    data: JWTSession;
    headers: AxiosHeaders;
    request: XMLHttpRequest;
    status: number;
    statusText: string;
}

export const loginByEmail = createAsyncThunk<JWTSession, LoginByEmailProps, ThunkConfig<string>>(
    'loginForm/loginByEmail',
    async (authData, thunkApi) => {
        const { extra, dispatch, rejectWithValue } = thunkApi;
        const { invite } = authData;
        const address = invite ? `/auth/login-candidate?invite=${invite}` : '/auth/login';

        try {
            const response = await extra.api.post<User, LoginByEmailResponse>(address, authData);
            if (!response.data.accessToken) {
                return rejectWithValue('Unauthorized');
            }

            dispatch(userActions.setToken(response.data));
            dispatch(validateSessionToken());
            return response.data;
        } catch (e) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
                return rejectWithValue('Не удалось войти. Проверьте свои данные.');
            }
            return rejectWithValue(error.code + ' ' + error.message);
        }
    },
);
