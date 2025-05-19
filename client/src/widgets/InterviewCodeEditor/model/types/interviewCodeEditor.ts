import { TaskSolutionInfo } from 'entities/Task';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';

export interface InterviewCodeEditorSchema {
    isLoading: boolean;
    codeLoading: boolean;
    error?: string;
    currentTask?: TaskSolutionInfo;
    currentTaskCode?: string;
    result?: ExecutionResult;
    tests?: TestsRunResponse;
}

export interface EntryPoint {
    namespaceName: string;
    className: string;
    methodName: string;
}
