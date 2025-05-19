import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { TestsRunResponse } from 'entities/CodeEditor';

interface RunTestsCodeProps {
    code: string;
    taskSolutionId?: string;
}

export const runTestsCode = createAsyncThunk<
    TestsRunResponse,
    RunTestsCodeProps,
    ThunkConfig<string>
>('interviewCodeEditor/runTestsCode', async (props, thunkApi) => {
    const { code, taskSolutionId } = props;
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.post(`${UrlRoutes.compiler}/tests/run`, {
            code,
            taskSolutionId,
        });

        if (response.status !== 200) {
            return rejectWithValue('не удалось получить последний код задачи');
        }

        return response.data;
    } catch (e) {
        return rejectWithValue(e as string);
    }
});
