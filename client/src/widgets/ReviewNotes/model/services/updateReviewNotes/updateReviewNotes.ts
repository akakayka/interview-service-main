import { createAsyncThunk } from '@reduxjs/toolkit';
import { ThunkConfig } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { UrlRoutes } from 'shared/consts/urlRoutes.ts';
import { getReviewNotesNotes } from '../../selectors/reviewNotesSelectors.ts';

export const updateReviewNotes = createAsyncThunk<void, string, ThunkConfig<string>>(
    'reviewNotes/updateReviewNotes',
    async (interviewSolutionId, thunkApi) => {
        const { extra, rejectWithValue, getState } = thunkApi;
        const notes = getReviewNotesNotes(getState());

        if (!interviewSolutionId) {
            return rejectWithValue('no interview id');
        }

        try {
            const response = await extra.api.post(`${UrlRoutes.user}interviews/solution/draft`, {
                interviewSolutionId: interviewSolutionId,
                draft: {
                    text: '',
                    checkboxes: notes,
                },
            });

            if (response.status !== 200) {
                return rejectWithValue('не удалось получить список заметок');
            }

            return;
        } catch (e) {
            return rejectWithValue(e as string);
        }
    },
);
