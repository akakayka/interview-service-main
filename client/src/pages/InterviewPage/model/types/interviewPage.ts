import { InterviewSolutionInfo } from 'entities/Interview';
import { ICodeRecord, RecordInfo } from 'entities/CodeRecord';
import { TaskSolutionInfo } from 'entities/Task';

export interface InterviewPageSchema {
    isLoading: boolean;
    pageLoading: boolean;
    error?: string;
    interview?: InterviewSolutionInfo;
    tasks: TaskSolutionInfo[];
}

export interface LastSavedCodeResponse {
    code?: string | null;
}

export interface SaveChunk {
    taskId: string;
    saveTime: number;
    code: string;
    recordInfo: RecordInfo;
}

export interface SaveChunkRequest {
    taskSolutionId: string;
    saveTime: number;
    code: string;
    records: ICodeRecord[];
}

export interface SaveChunkResponse {
    saveTime?: number;
    code?: string;
    records?: ICodeRecord[];
}
