import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getInterviewPageInfo = (state: StateSchema) => state.interviewPage?.interview;
export const getInterviewPageSolutionID = (state: StateSchema) =>
    state.interviewPage?.interview?.id;
export const getInterviewPageTasks = (state: StateSchema) => state.interviewPage?.tasks;
export const getInterviewPageIsLoading = (state: StateSchema) => state.interviewPage?.isLoading;
export const getInterviewPageLoading = (state: StateSchema) => state.interviewPage?.pageLoading;
export const getInterviewPageError = (state: StateSchema) => state.interviewPage?.error;
