import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { getInterviewPageSolutionID } from '../../selectors/interviewPageSelectors.ts';
import { TaskSolutionInfo } from 'entities/Task';
import { getLocalSaves, interviewCodeEditorActions } from 'widgets/InterviewCodeEditor';
import { AxiosError } from 'axios';
import { userActions } from 'entities/User';

export const fetchTasksData = createAsyncThunk<TaskSolutionInfo[], void, ThunkConfig<string>>(
    'interviewPage/fetchTasksData',
    async (_, thunkApi) => {
        const { extra, rejectWithValue, getState, dispatch } = thunkApi;
        const interviewSolutionId = getInterviewPageSolutionID(getState());

        if (!interviewSolutionId) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.get(
                `contest/task-slns-info?id=${interviewSolutionId}`,
            );
            if (response.status !== 200) {
                return rejectWithValue('не удалось получить список задач');
            }

            const tasks = response.data.sort((a: TaskSolutionInfo, b: TaskSolutionInfo) =>
                a.taskOrder > b.taskOrder ? 1 : -1,
            );

            const firstTask: TaskSolutionInfo = tasks[0];
            dispatch(interviewCodeEditorActions.setCurrentTask(firstTask));
            const lastCode = getLocalSaves(firstTask.id) ?? firstTask.startCode;
            dispatch(interviewCodeEditorActions.setCurrentTaskCode(lastCode));

            return tasks;
        } catch (e) {
            const error = e as AxiosError;
            if (error.response?.status === 401) {
                dispatch(userActions.clearToken());
            }
            return rejectWithValue(error.message + ' ' + error.code);
        }
    },
);
