import { CreateTaskForm } from '/pages/CreateTaskPage';

export interface TaskEditPageSchema {
    isLoading: boolean;
    error?: string;
    taskEditForm: CreateTaskForm;
    newTaskId?: string;
}
