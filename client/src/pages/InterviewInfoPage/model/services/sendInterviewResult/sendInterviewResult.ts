import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';
import { InterviewResult } from '../../../ui/InterviewInfoPage/InterviewInfoPage.tsx';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';

interface SendInterviewResultProps {
    interviewSolutionId: string | undefined;
    result: InterviewResult;
}

export const sendInterviewResult = createAsyncThunk<
    void,
    SendInterviewResultProps,
    ThunkConfig<string>
>('interviewInfoPage/sendInterviewResult', async (props, thunkApi) => {
    const { result, interviewSolutionId } = props;
    const { extra, rejectWithValue, dispatch } = thunkApi;

    if (!interviewSolutionId) {
        return rejectWithValue('no interview id');
    }

    try {
        const response = await extra.api.put(
            `${UrlRoutes.user}interviews/solution/result?id=${interviewSolutionId}&result=${result}`,
        );
        if (response.status !== 200) {
            return rejectWithValue('не удалось отправить результат');
        }

        return;
    } catch (e) {
        const error = e as AxiosError;
        if (error.response?.status === 401) {
            dispatch(userActions.clearToken());
        }
        return rejectWithValue(error.message + ' ' + error.code);
    }
});
