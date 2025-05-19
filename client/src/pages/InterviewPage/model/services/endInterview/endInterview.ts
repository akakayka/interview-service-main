import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { getInterviewPageSolutionID } from '../../selectors/interviewPageSelectors.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const endInterview = createAsyncThunk<void, void, ThunkConfig<string>>(
    'interviewPage/endInterview',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState, dispatch } = thunkApi;
        const interviewSolutionId = getInterviewPageSolutionID(getState());

        if (!interviewSolutionId) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.put(`contest/end-i-sln?id=${interviewSolutionId}`);
            if (response.status !== 200) {
                return rejectWithValue('не удалось завершить интервью');
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
