import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getInterviewCodeEditorCurrentTask = (state: StateSchema) =>
    state.interviewCodeEditor?.currentTask;
export const getInterviewCodeEditorCurrentTaskCode = (state: StateSchema) =>
    state.interviewCodeEditor?.currentTaskCode || '';
export const getInterviewCodeEditorIsLoading = (state: StateSchema) =>
    state.interviewCodeEditor?.isLoading;
export const getInterviewCodeEditorCodeLoading = (state: StateSchema) =>
    state.interviewCodeEditor?.codeLoading;
export const getInterviewCodeEditorError = (state: StateSchema) => state.interviewCodeEditor?.error;
export const getInterviewCodeEditorExecutionResult = (state: StateSchema) =>
    state.interviewCodeEditor?.result;
export const getInterviewCodeEditorTestsResult = (state: StateSchema) =>
    state.interviewCodeEditor?.tests;
