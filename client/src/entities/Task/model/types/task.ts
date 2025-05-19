import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export interface TaskSolutionInfo {
    id: string;
    taskOrder: string;
    taskName: string;
    taskText: string;
    startCode: string;
    isDone: boolean;
    runAttemptsLeft: number;
    programmingLanguage: ProgrammingLanguage;
}

export interface TaskInfo {
    id: string;
    name: string;
    taskText: string;
    programmingLanguage: ProgrammingLanguage;
    startCode: string;
    testsCode: string;
    runAttempts: number;
    isDeleted?: boolean;
}
