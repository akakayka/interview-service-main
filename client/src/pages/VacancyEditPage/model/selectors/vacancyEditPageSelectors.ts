import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getVacancyEditPageIsLoading = (state: StateSchema) => state.vacancyEditPage?.isLoading;
export const getVacancyEditPageError = (state: StateSchema) => state.vacancyEditPage?.error;
export const getVacancyEditPageForm = (state: StateSchema) =>
    state.vacancyEditPage?.vacancyEditForm;
export const getVacancyEditPageTasks = (state: StateSchema) => state.vacancyEditPage?.tasks;
