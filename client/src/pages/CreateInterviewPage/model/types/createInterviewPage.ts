import { TaskInfo } from 'entities/Task';

export interface CreateInterviewForm {
    vacancy: string;
    interviewText: string;
    interviewDurationMs: number;
    taskIds: string[];
}

export interface CreateInterviewPageSchema {
    isLoading: boolean;
    error?: string;
    createInterviewForm: CreateInterviewForm;
    tasks: TaskInfo[];
    success: boolean;
}
