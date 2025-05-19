import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { Notes } from '../../types/notes.ts';

export const fetchReviewNotes = createAsyncThunk<Notes, string, ThunkConfig<string>>(
    'reviewNotes/fetchReviewNotes',
    async (interviewSolutionId, thunkApi) => {
        const { extra, rejectWithValue } = thunkApi;

        if (!interviewSolutionId) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.get(
                `${UrlRoutes.user}interviews/solution/draft?id=${interviewSolutionId}`,
            );

            if (response.status !== 200) {
                return rejectWithValue('не удалось получить список заметок');
            }

            return response.data;
        } catch (e) {
            return rejectWithValue(e as string);
        }
    },
);
