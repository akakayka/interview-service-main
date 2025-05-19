import { CreateInterviewForm } from '/pages/CreateInterviewPage';
import { TaskInfo } from 'entities/Task';

export interface VacancyEditPageSchema {
    isLoading: boolean;
    error?: string;
    vacancyEditForm: CreateInterviewForm;
    tasks: TaskInfo[];
    newInterviewId?: string;
}
