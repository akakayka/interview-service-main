import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export interface CandidateInfo {
    userId: string;
    interviewSolutionId: string;
    firstName: string;
    surname: string;
    vacancy: string;
    startTimeMs: number;
    timeToCheckMs: number;
    averageGrade: number;
    reviewerComment: string;
    doneTasksCount: number;
    tasksCount: number;
    interviewResult: number;
    hasReviewerCheckResult: boolean;
    hasHrCheckResult: boolean;
    isSubmittedByCandidate: boolean;
    isSolutionTimeExpired: boolean;
    programmingLanguages: ProgrammingLanguage[];
    isSynchronous: boolean;
}

export interface InterviewsSchema {
    isLoading: boolean;
    error?: string;
    candidates: CandidateInfo[];
}
