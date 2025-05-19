import { TaskInfo } from 'entities/Task';

export interface TasksSchema {
    isLoading: boolean;
    error?: string;
    tasks?: TaskInfo[];
}
