import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getInterviewInfoPageIsLoading = (state: StateSchema) =>
    state.interviewInfoPage?.isLoading;
export const getInterviewInfoPageError = (state: StateSchema) => state.interviewInfoPage?.error;
export const getInterviewInfoPageComment = (state: StateSchema) => state.interviewInfoPage?.comment;
export const getInterviewInfoPageInterview = (state: StateSchema) =>
    state.interviewInfoPage?.interviewInfo;
