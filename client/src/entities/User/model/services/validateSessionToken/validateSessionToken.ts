import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { JWTSession } from '../../types/JWTSession.ts';
import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { getUserSession } from '../../selectors/userSelectors.ts';
import { getJWTInfo } from 'shared/lib/parseJwt/parseJwt.ts';
import { UserSession } from '../../types/userSession.ts';

interface ValidateSessionTokenResponse {
    config: AxiosRequestConfig;
    data: JWTSession;
    headers: AxiosHeaders;
    request: XMLHttpRequest;
    status: number;
    statusText: string;
}

export const validateSessionToken = createAsyncThunk<UserSession, void, ThunkConfig<string>>(
    'user/validateSessionToken',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState } = thunkApi;
        const sessionToken = getUserSession(getState());

        try {
            const response = await extra.api.get<void, ValidateSessionTokenResponse>(
                `auth/validate?token=${sessionToken.accessToken}`,
            );
            if (response.status !== 200) {
                throw new Error();
            }

            const userSession = getJWTInfo();

            return userSession || {};
        } catch (e) {
            console.log(e);
            return rejectWithValue('error');
        }
    },
);
