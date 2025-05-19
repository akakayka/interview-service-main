import { TaskSolutionInfo } from 'entities/Task';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';

export interface TaskReviewResponse {
    taskSolutionId?: string;
    taskId?: string;
    interviewSolutionId?: string;
    fullName?: string;
    isDone?: boolean;
    taskOrder?: string;
    grade?: number;
    runAttemptsLeft?: number;
    taskName?: string;
    programmingLanguage?: ProgrammingLanguage;
}

export interface ReviewInfo {
    interviewSolutionId?: string;
    userId?: string;
    interviewId?: string;
    fullName?: string;
    vacancy?: string;
    startTimeMs?: number;
    endTimeMs?: number;
    timeToCheckMs?: number;
    reviewerComment?: string;
    averageGrade?: number;
    interviewResult?: number;
    phoneNumber?: string;
    email?: string;
    taskSolutionsInfos?: TaskReviewResponse[];
    programmingLanguages?: ProgrammingLanguage[];
}

export interface ReviewPageSchema {
    isLoading: boolean;
    error?: string;
    interview?: ReviewInfo;
    tasks: TaskSolutionInfo[];
    currentTaskCode: string;
    currentTask?: TaskSolutionInfo;
    currentTaskId?: string;
    testsResult?: TestsRunResponse;
    executionResult?: ExecutionResult;
}
