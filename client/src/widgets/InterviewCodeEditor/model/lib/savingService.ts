import { RecordInfo } from 'entities/CodeRecord';
import { SaveChunk, SaveChunkResponse } from 'pages/InterviewPage';

export const saveCodeLocal = (taskId: string, code: string) => {
    localStorage.setItem('code' + taskId, code);
};

export const getLocalSaves = (taskId: string) => {
    return localStorage.getItem('code' + taskId);
};

export function applySaves(taskId: string, saves: SaveChunkResponse[]): void {
    for (const save of saves) {
        const newSaveModel: SaveChunk = {
            taskId: taskId ?? '',
            saveTime: save.saveTime ?? 0,
            code: save.code ?? '',
            recordInfo: new RecordInfo(save.records ?? [], save.saveTime ?? 0),
        };
        localStorage.setItem('save' + taskId + save.saveTime, JSON.stringify(newSaveModel));
    }
}

export function getTaskSaves(taskId: string): SaveChunk[] {
    const res: SaveChunk[] = [];

    for (const key in localStorage) {
        if (key.includes(taskId) && key.includes('save')) {
            const save = localStorage.getItem(key);
            if (save) {
                res.push(JSON.parse(save) as SaveChunk);
            }
        }
    }

    return res.sort((a, b) => a.saveTime - b.saveTime);
}

export function clearSaves(): void {
    for (const key in localStorage) {
        if (key.includes('save')) {
            localStorage.removeItem(key);
        }
    }
}

export function clearCodes(): void {
    for (const key in localStorage) {
        if (key.includes('code')) {
            localStorage.removeItem(key);
        }
    }
}
