import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getCandidateInterviewInfoPageIsLoading = (state: StateSchema) =>
    state.candidateInterviewInfoPage?.isLoading;
export const getCandidateInterviewInfoPageError = (state: StateSchema) =>
    state.candidateInterviewInfoPage?.error;
export const getCandidateInterviewInfoPageInterviewInfo = (state: StateSchema) =>
    state.candidateInterviewInfoPage?.interviewInfo;
