import { InterviewInfo } from 'widgets/MeetingsList';
import { TaskInfo } from 'entities/Task';

export interface VacancyDetailsPageSchema {
    isLoading: boolean;
    error?: string;
    vacancy?: InterviewInfo;
    tasks: TaskInfo[];
}
