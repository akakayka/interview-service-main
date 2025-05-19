import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getInterviewSolutionInfo = (state: StateSchema) =>
    state.candidateStartPage?.solutionInfo;
export const getCandidateStartPageIsLoading = (state: StateSchema) =>
    state.candidateStartPage?.isLoading;
export const getCandidateStartPageLoading = (state: StateSchema) =>
    state.candidateStartPage?.isLoading;
export const getCandidateStartPageError = (state: StateSchema) => state.candidateStartPage?.error;
