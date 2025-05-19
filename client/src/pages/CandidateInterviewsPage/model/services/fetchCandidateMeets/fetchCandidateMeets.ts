import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { MeetingInfo } from 'pages/MeetingsPage';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const fetchCandidateMeets = createAsyncThunk<MeetingInfo[], void, ThunkConfig<string>>(
    'asyncReviewPage/fetchCandidateMeets',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        try {
            const response = await extra.api.get(`${UrlRoutes.user}meets/get-user-meets`);

            if (response.status !== 200) {
                return rejectWithValue('не удалось получить последний код задачи');
            }

            return response.data;
        } catch (e) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
                dispatch(userActions.clearToken());
            }
            return rejectWithValue(error.message + ' ' + error.code);
        }
    },
);
