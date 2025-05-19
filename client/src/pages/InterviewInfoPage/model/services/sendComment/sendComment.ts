import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { getInterviewInfoPageComment } from '../../selectors/interviewInfoPageSelectors.ts';

export const sendComment = createAsyncThunk<void, string | undefined, ThunkConfig<string>>(
    'interviewInfoPage/sendComment',
    async (interviewSolutionId, thunkApi) => {
        const { extra, rejectWithValue, dispatch, getState } = thunkApi;
        const comment = getInterviewInfoPageComment(getState());

        if (!interviewSolutionId || !comment) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.put(
                `interviews/solution/comment?id=${interviewSolutionId}`,
                {
                    reviewerComment: comment,
                },
            );
            if (response.status !== 200) {
                return rejectWithValue('не удалось отправить комментарий');
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
