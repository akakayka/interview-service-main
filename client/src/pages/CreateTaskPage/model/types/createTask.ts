import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export interface CreateTaskForm {
    taskText: string;
    startCode: string;
    name: string;
    testsCode: string;
    runAttempts: number;
    programmingLanguage: ProgrammingLanguage;
    isDeleted?: boolean;
}

export interface CreateTaskPageSchema {
    isLoading: boolean;
    error?: string;
    createTaskForm: CreateTaskForm;
    success: boolean;
}
