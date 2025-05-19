import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { Message } from 'shared/lib/hooks/useSignalR/types.ts';

export interface PeerData {
    id: string;
    data: any;
}

export interface UserInfo {
    userName: string;
    groupName: string;
    connectionId: string;
}

export interface SignalInfo {
    user: string;
    signal: any;
}

export interface ChatMessage {
    own: boolean;
    message: string;
}

export class UserVideo {
    video: Blob;

    constructor(video: Blob) {
        this.video = video;
    }
}

export type MeetPeerData = {
    taskIdUpdate?: string;
    codeUpdate?: string;
    consoleUpdate?: ExecutionResult;
    testsUpdate?: TestsRunResponse;
    message?: Message;
};
