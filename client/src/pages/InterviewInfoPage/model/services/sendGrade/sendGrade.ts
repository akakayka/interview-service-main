import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { Grade } from 'features/CandidateInfoCard';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';

interface SendGradeProps {
    interviewSolutionId: string | undefined;
    grade: Grade;
}

export const sendGrade = createAsyncThunk<void, SendGradeProps, ThunkConfig<string>>(
    'interviewInfoPage/sendGrade',
    async (props, thunkApi) => {
        const { grade, interviewSolutionId } = props;
        const { extra, rejectWithValue, dispatch } = thunkApi;

        if (!interviewSolutionId || !grade) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.put(
                `${UrlRoutes.user}interviews/solution/grade?id=${interviewSolutionId}&grade=${grade}`,
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
