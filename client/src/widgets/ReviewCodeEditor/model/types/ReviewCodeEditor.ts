import { TaskSolutionInfo } from 'entities/Task';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';

export interface ReviewCodeEditorSchema {
    isLoading: boolean;
    error?: string;
    currentTask?: TaskSolutionInfo;
    currentTaskCode?: string;
    result?: ExecutionResult;
    tests?: TestsRunResponse;
}
