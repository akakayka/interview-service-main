import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export interface InterviewInfo {
    vacancy: string;
    interviewText: string;
    interviewDurationMs: number;
    id: string;
    interviewLanguages?: ProgrammingLanguage[];
}

export interface AddCandidateForm {
    role: string;
    interviewId: string;
    isSynchronous: boolean;
}

export interface AddCandidateSchema {
    isLoading: boolean;
    error?: string;
    link: string;
    form: AddCandidateForm;
    interviews: InterviewInfo[];
}
