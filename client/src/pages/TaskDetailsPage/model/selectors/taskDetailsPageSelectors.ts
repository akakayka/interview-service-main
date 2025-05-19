import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getTaskDetailsPageIsLoading = (state: StateSchema) => state.taskDetailsPage?.isLoading;
export const getTaskDetailsPageError = (state: StateSchema) => state.taskDetailsPage?.error;
export const getTaskDetailsPageTaskDetails = (state: StateSchema) =>
    state.taskDetailsPage?.taskDetails;
