import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getReviewCodeEditorCurrentTask = (state: StateSchema) =>
    state.interviewCodeEditor?.currentTask;
export const getReviewCodeEditorCurrentTaskCode = (state: StateSchema) =>
    state.interviewCodeEditor?.currentTaskCode || '';
export const getReviewCodeEditorIsLoading = (state: StateSchema) =>
    state.interviewCodeEditor?.isLoading;
export const getReviewCodeEditorError = (state: StateSchema) => state.interviewCodeEditor?.error;
