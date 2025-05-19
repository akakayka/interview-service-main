import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { TaskSolutionInfo } from 'entities/Task';
import { interviewCodeEditorActions } from 'widgets/InterviewCodeEditor';

export const fetchTaskSolutionsInfo = createAsyncThunk<
    TaskSolutionInfo[],
    string,
    ThunkConfig<string>
>('reviewPage/fetchTaskSolutionsInfo', async (interviewSolutionId, thunkApi) => {
    const { extra, rejectWithValue, dispatch } = thunkApi;

    try {
        const response = await extra.api.get(`contest/task-slns-info?id=${interviewSolutionId}`);
        if (response.status !== 200) {
            return rejectWithValue('не удалось получить список задач');
        }

        const tasks = response.data.sort((a: TaskSolutionInfo, b: TaskSolutionInfo) =>
            a.taskOrder > b.taskOrder ? 1 : -1,
        );

        dispatch(interviewCodeEditorActions.setCurrentTask(tasks[0]));

        return tasks;
    } catch (e) {
        return rejectWithValue(e as string);
    }
});
