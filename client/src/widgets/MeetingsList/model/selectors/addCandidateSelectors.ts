import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getAddCandidateLink = (state: StateSchema) => state.addCandidate?.link;
export const getAddCandidateInterviews = (state: StateSchema) => state.addCandidate?.interviews;
export const getAddCandidateIsLoading = (state: StateSchema) => state.addCandidate?.isLoading;
export const getAddCandidateError = (state: StateSchema) => state.addCandidate?.error || '';
export const getAddCandidateForm = (state: StateSchema) => state.addCandidate?.form;
export const getAddCandidateFormInterviewId = (state: StateSchema) =>
    state.addCandidate?.form.interviewId;
export const getAddCandidateFormIsSynchronous = (state: StateSchema) =>
    state.addCandidate?.form.isSynchronous || false;
export const getAddCandidateFormRole = (state: StateSchema) => state.addCandidate?.form.role;
