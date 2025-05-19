import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getVacanciesPageIsLoading = (state: StateSchema) => state.vacanciesPage?.isLoading;
export const getVacanciesPageError = (state: StateSchema) => state.vacanciesPage?.error;
export const getVacanciesPageInterviews = (state: StateSchema) => state.vacanciesPage?.interviews;
