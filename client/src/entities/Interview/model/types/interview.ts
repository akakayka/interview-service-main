import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export interface InterviewSolutionInfo {
    id: string;
    vacancy: string;
    interviewText: string;
    interviewDurationMs: number;
    isStarted: boolean;
    startTimeMs: number;
    endTimeMs: number;
    isSubmittedByCandidate: boolean;
    programmingLanguages: ProgrammingLanguage[];
    isSynchronous: boolean;
}
