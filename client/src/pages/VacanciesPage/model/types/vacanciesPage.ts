import { InterviewInfo } from 'widgets/MeetingsList';

export interface VacanciesPageSchema {
    isLoading: boolean;
    error?: string;
    interviews?: InterviewInfo[];
}
