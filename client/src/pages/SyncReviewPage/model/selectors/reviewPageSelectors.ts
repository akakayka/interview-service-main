import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';
import { createSelector } from '@reduxjs/toolkit';

export const getSyncReviewPageSolutionInfo = (state: StateSchema) =>
    state.syncReviewPage?.interview;
export const getSyncReviewPageExecutionResult = (state: StateSchema) =>
    state.syncReviewPage?.executionResult;
export const getSyncReviewPageTestsResult = (state: StateSchema) =>
    state.syncReviewPage?.testsResult;
export const getSyncReviewPageCurrentTaskCode = (state: StateSchema) =>
    state.syncReviewPage?.currentTaskCode;
export const getSyncReviewPageCurrentTaskId = (state: StateSchema) =>
    state.syncReviewPage?.currentTaskId;
export const getSyncReviewPageCurrentTask = (state: StateSchema) =>
    state.syncReviewPage?.currentTask;
export const getSyncReviewPageTasks = (state: StateSchema) => state.syncReviewPage?.tasks;
export const getSyncReviewPageIsLoading = (state: StateSchema) => state.syncReviewPage?.isLoading;
export const getSyncReviewPageError = (state: StateSchema) => state.syncReviewPage?.error;
export const getSyncReviewPageCurrentTaskFromUser = createSelector(
    getSyncReviewPageTasks,
    getSyncReviewPageCurrentTaskId,
    (tasks, taskId) => {
        return tasks?.find((task) => task.id === taskId);
    },
);
