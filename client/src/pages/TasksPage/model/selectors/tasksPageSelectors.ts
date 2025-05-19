import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getTasksPageTasks = (state: StateSchema) => state.tasksPage?.tasks;
export const getTasksPageIsLoading = (state: StateSchema) => state.tasksPage?.isLoading;
export const getTasksPageError = (state: StateSchema) => state.tasksPage?.error || '';
