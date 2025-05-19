import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getAsyncReviewPageSolutionInfo = (state: StateSchema) =>
    state.asyncReviewPage?.interview;
export const getAsyncReviewPageExecutionResult = (state: StateSchema) =>
    state.asyncReviewPage?.executionResult;
export const getAsyncReviewPageTestsResult = (state: StateSchema) =>
    state.asyncReviewPage?.testsResult;
export const getAsyncReviewPageCurrentTaskCode = (state: StateSchema) =>
    state.asyncReviewPage?.currentTaskCode;
export const getAsyncReviewPageCurrentTask = (state: StateSchema) =>
    state.asyncReviewPage?.currentTask;
export const getAsyncReviewPageTasks = (state: StateSchema) => state.asyncReviewPage?.tasks;
export const getAsyncReviewPageIsLoading = (state: StateSchema) => state.asyncReviewPage?.isLoading;
export const getAsyncReviewPageError = (state: StateSchema) => state.asyncReviewPage?.error;
