import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getCreateInterviewPageForm = (state: StateSchema) =>
    state.createInterviewPage?.createInterviewForm;
export const getCreateInterviewPageIsLoading = (state: StateSchema) =>
    state.createInterviewPage?.isLoading;
export const getCreateInterviewPageError = (state: StateSchema) => state.createInterviewPage?.error;
export const getCreateInterviewPageSuccess = (state: StateSchema) =>
    state.createInterviewPage?.success || false;
export const getCreateInterviewPageTasks = (state: StateSchema) => state.createInterviewPage?.tasks;
export const getCreateInterviewPageFormVacancy = (state: StateSchema) =>
    state.createInterviewPage?.createInterviewForm.vacancy || '';
export const getCreateInterviewPageFormInterviewText = (state: StateSchema) =>
    state.createInterviewPage?.createInterviewForm.interviewText || '';
export const getCreateInterviewPageFormTaskIds = (state: StateSchema) =>
    state.createInterviewPage?.createInterviewForm.taskIds;
export const getCreateInterviewPageFormInterviewDuration = (state: StateSchema) =>
    state.createInterviewPage?.createInterviewForm.interviewDurationMs;
