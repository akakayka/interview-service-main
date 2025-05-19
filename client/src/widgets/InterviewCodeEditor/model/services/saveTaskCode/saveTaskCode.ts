import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { RecordInfo } from 'entities/CodeRecord';
import { SaveChunkRequest } from 'pages/InterviewPage';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';

interface SaveTaskCodeProps {
    taskId: string;
    code: string;
    recordInfo: RecordInfo;
}

export const saveTaskCode = createAsyncThunk<void, SaveTaskCodeProps, ThunkConfig<string>>(
    'interviewCodeEditor/saveTaskCode',
    async (props, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;
        const { taskId, recordInfo, code } = props;

        if (!taskId) {
            return rejectWithValue('no task id');
        }

        const time = Date.now();

        try {
            const response = await extra.api.put<SaveChunkRequest, Response>(
                `${UrlRoutes.tracker}save?taskSolutionId=${taskId}`,
                {
                    taskSolutionId: taskId,
                    records: recordInfo.record,
                    code,
                    saveTime: time,
                },
            );
            if (response.status !== 200) {
                return rejectWithValue('ошибка сохранения на сервере');
            }

            return;
        } catch (e) {
            return rejectWithValue(e as string);
        }
    },
);
