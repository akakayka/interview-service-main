// @ts-ignore
import { CodeRecord } from '../CodeRecord';
import { ExtraActions, ExtraActivity, ICodeRecord, RecordInfo } from 'entities/CodeRecord';
import { ExecutionResult } from 'entities/CodeEditor';
import { Editor } from 'codemirror';

export class RecordService {
    private _recordsStartTime: Map<string, number> = new Map();
    private _recorders: Map<string, any> = new Map();
    private _codeMirror!: Editor;
    private _currentTaskId?: string;
    private _bindedMethod?: () => void;

    constructor() {}

    public enablePageChangesCheck(): void {
        this._bindedMethod = this.onVisibilityChange.bind(this);

        document.addEventListener('visibilitychange', this._bindedMethod);
    }

    public clear(): void {
        if (this._bindedMethod) {
            document.removeEventListener('visibilitychange', this._bindedMethod);
        }
    }

    public bindEditor(editorComp: Editor): void {
        if (!editorComp) {
            return;
        }

        this._codeMirror = editorComp;
    }

    public initRecordersStream(tasksId: string[]): void {
        for (const task of tasksId) {
            this.startRecord(task);
        }
    }

    public startRecordingTask(taskId: string): void {
        for (const [key, recorder] of this._recorders) {
            if (recorder) {
                this.stopRecord(key);
            }
        }

        this._currentTaskId = taskId;

        this.startRecord(taskId);
    }

    public startRecord(taskId: string): void {
        if (!this._codeMirror) {
            console.log('Unable to load code mirror model');

            return;
        }

        const recorder = new CodeRecord(this._codeMirror);

        this._recordsStartTime.set(taskId, recorder.initTime);
        this._recorders.set(taskId, recorder);
        this._recorders.get(taskId).listen();
        this._codeMirror.setValue(this._codeMirror.getValue());
    }

    public stopRecord(taskId: string): void {
        if (!this._recorders || !this._recorders.get(taskId)) {
            console.log('Recording not started', taskId);

            return;
        }
        this.stopEditorListening(taskId);
    }

    public getTaskRecord(task: string): RecordInfo {
        const recorder = this._recorders.get(task);
        const startTime = this._recordsStartTime.get(task);

        if (!recorder || !startTime) {
            return new RecordInfo([], -1);
        }

        const record = recorder.getRecords() as string;
        const recordsModel = JSON.parse(record) as ICodeRecord[];
        this.aproximateRecordInfo(recordsModel);

        return new RecordInfo(recordsModel, startTime);
    }

    public recordExecute(executionResult: ExecutionResult): void {
        if (this._currentTaskId) {
            this._recorders
                .get(this._currentTaskId)
                .recordExtraActivity(
                    new ExtraActivity<ExecutionResult>(ExtraActions.execute, executionResult),
                );
        }
    }

    private stopEditorListening(recorder: any): void {
        this._codeMirror.off('changes', recorder.changesListener);
        this._codeMirror.off('swapDoc', recorder.swapDocListener);
        this._codeMirror.off('cursorActivity', recorder.cursorActivityListener);
    }

    private aproximateRecordInfo(records: ICodeRecord[]): void {
        // Апроксимация первой операции (операция выставления начального кода)
        if (records.length >= 1) {
            switch (typeof records[0].t) {
                case 'number':
                    records[0].t = -1;
                    break;
                default:
                    records[0].t = [-1, -1];
            }
        }
    }

    private onVisibilityChange(): void {
        if (document.hidden && this._currentTaskId) {
            this._recorders
                .get(this._currentTaskId)
                .recordExtraActivity(new ExtraActivity(ExtraActions.pageHidden));
        } else if (this._currentTaskId) {
            this._recorders
                .get(this._currentTaskId)
                .recordExtraActivity(new ExtraActivity(ExtraActions.pageOpened));
        }
    }
}
