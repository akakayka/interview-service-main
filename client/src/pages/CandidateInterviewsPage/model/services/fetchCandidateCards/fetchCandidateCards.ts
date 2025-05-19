import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { CandidateInfo } from 'pages/InterviewsPage';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const fetchCandidateCards = createAsyncThunk<CandidateInfo[], void, ThunkConfig<string>>(
    'asyncReviewPage/fetchCandidateCards',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, dispatch } = thunkApi;

        try {
            const response = await extra.api.get(`${UrlRoutes.user}cards/get-user-cards`);

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
