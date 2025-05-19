import { TaskInfo } from 'entities/Task';

export interface TaskDetailsPageSchema {
    isLoading: boolean;
    error?: string;
    taskDetails?: TaskInfo;
}
