import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getTaskEditPageIsLoading = (state: StateSchema) => state.taskEditPage?.isLoading;
export const getTaskEditPageError = (state: StateSchema) => state.taskEditPage?.error;
export const getTaskEditPageForm = (state: StateSchema) => state.taskEditPage?.taskEditForm;
