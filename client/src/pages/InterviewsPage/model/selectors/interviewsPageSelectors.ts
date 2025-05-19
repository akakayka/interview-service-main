import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema';

export const getInterviewsPageCandidates = (state: StateSchema) => state.interviewsPage?.candidates;
export const getInterviewsPageIsLoading = (state: StateSchema) => state.interviewsPage?.isLoading;
export const getInterviewsPageError = (state: StateSchema) => state.interviewsPage?.error;
