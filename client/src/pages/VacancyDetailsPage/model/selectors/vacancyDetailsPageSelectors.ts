import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getVacancyDetailsPageIsLoading = (state: StateSchema) =>
    state.vacancyDetailsPage?.isLoading;
export const getVacancyDetailsPageError = (state: StateSchema) => state.vacancyDetailsPage?.error;
export const getVacancyDetailsPageVacancy = (state: StateSchema) =>
    state.vacancyDetailsPage?.vacancy;
export const getVacancyDetailsPageTasks = (state: StateSchema) => state.vacancyDetailsPage?.tasks;
