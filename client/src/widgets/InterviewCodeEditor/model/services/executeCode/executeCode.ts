import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { ExecutionResult } from 'entities/CodeEditor';
import { EntryPoint } from '../../types/interviewCodeEditor.ts';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

interface ExecuteCodeProps {
    code: string;
    entryPoint: EntryPoint;
    language: ProgrammingLanguage;
}

export const executeCode = createAsyncThunk<ExecutionResult, ExecuteCodeProps, ThunkConfig<string>>(
    'interviewCodeEditor/executeReviewCode',
    async (props, thunkApi) => {
        const { code, language, entryPoint } = props;
        const { extra, rejectWithValue } = thunkApi;

        try {
            const response = await extra.api.put(`${UrlRoutes.compiler}/compile/execute`, {
                code,
                programmingLanguage: language,
                entryPoint,
            });

            if (response.status !== 200) {
                return rejectWithValue('не удалось получить последний код задачи');
            }

            return response.data;
        } catch (e) {
            return rejectWithValue(e as string);
        }
    },
);
