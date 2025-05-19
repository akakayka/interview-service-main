import { TaskSolutionInfo } from 'entities/Task';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { ReviewInfo } from 'pages/SyncReviewPage';

export interface AsyncReviewPageSchema {
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
