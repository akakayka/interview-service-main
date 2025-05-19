import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getCandidateInterviewsIsLoading = (state: StateSchema) =>
    state.candidateInterviewsPage?.isLoading;
export const getCandidateInterviewsError = (state: StateSchema) =>
    state.candidateInterviewsPage?.error;
export const getCandidateInterviewsCards = (state: StateSchema) =>
    state.candidateInterviewsPage?.cards;
export const getCandidateInterviewsMeets = (state: StateSchema) =>
    state.candidateInterviewsPage?.meets;
