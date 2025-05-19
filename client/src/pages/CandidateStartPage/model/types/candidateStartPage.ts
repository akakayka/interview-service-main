import { InterviewSolutionInfo } from 'entities/Interview';

export interface CandidateStartPageSchema {
    isLoading: boolean;
    pageLoading: boolean;
    error?: string;
    solutionInfo?: InterviewSolutionInfo;
}
