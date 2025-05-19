import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { ExecutionResult } from 'entities/CodeEditor';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { EntryPoint } from 'widgets/InterviewCodeEditor';

interface ExecuteCodeProps {
    code: string;
    entryPoint: EntryPoint;
    language: ProgrammingLanguage;
}

export const executeReviewCode = createAsyncThunk<
    ExecutionResult,
    ExecuteCodeProps,
    ThunkConfig<string>
>('asyncReviewPage/executeReviewCode', async (props, thunkApi) => {
    const { code, language, entryPoint } = props;
    const { extra, rejectWithValue } = thunkApi;

    try {
        const response = await extra.api.put(`${UrlRoutes.compiler}/compile/execute`, {
            code,
            programmingLanguage: language,
            entryPoint,
        });

        if (response.status !== 200) {
            return rejectWithValue('не удалось выполнить запрос');
        }

        return response.data;
    } catch (e) {
        return rejectWithValue(e as string);
    }
});
