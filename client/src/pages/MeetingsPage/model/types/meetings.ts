import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export interface MeetingInfo {
    userId: string;
    interviewSolutionId: string;
    interviewId: string;
    firstName: string;
    surname: string;
    vacancy: string;
    tasksCount: number;
    programmingLanguages: ProgrammingLanguage[];
    isOwnerMeet: boolean;
}

export interface MeetingSchema {
    isLoading: boolean;
    error?: string;
    meetings: MeetingInfo[];
}
