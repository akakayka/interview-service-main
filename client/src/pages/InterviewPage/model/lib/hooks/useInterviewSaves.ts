import { useCallback } from 'react';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { MeetPeerData } from 'shared/types/api.ts';

export function useInterviewSaves(sendDataToOther: (data: string) => void) {
    const saveExecutionResult = useCallback(
        (result: ExecutionResult) => {
            sendDataToOther(
                JSON.stringify({
                    consoleUpdate: result,
                }),
            );
        },
        [sendDataToOther],
    );

    const saveTestsResult = useCallback(
        (result: TestsRunResponse) => {
            sendDataToOther(
                JSON.stringify({
                    testsUpdate: result,
                }),
            );
        },
        [sendDataToOther],
    );

    const saveCodeUpdate = useCallback(
        (code: string) => {
            sendDataToOther(
                JSON.stringify({
                    codeUpdate: code,
                }),
            );
        },
        [sendDataToOther],
    );

    const saveTaskUpdate = useCallback(
        (taskId: string) => {
            sendDataToOther(
                JSON.stringify({
                    taskIdUpdate: taskId,
                } as MeetPeerData),
            );
        },
        [sendDataToOther],
    );

    return {
        saveCodeUpdate,
        saveExecutionResult,
        saveTestsResult,
        saveTaskUpdate,
    };
}
