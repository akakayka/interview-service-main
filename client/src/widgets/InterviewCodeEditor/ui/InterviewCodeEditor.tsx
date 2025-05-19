import { useCallback, useEffect, useMemo } from 'react';
import cls from './InterviewCodeEditor.module.scss';
import { EditorWrapperProps } from 'features/EditorWrapper';
import { TaskSolutionInfo } from 'entities/Task';
import { TaskTabs } from 'features/TaskTabs';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { classNames } from 'shared/lib/classNames/classNames.ts';
import { useSelector } from 'react-redux';
import { getInterviewPageTasks } from 'pages/InterviewPage';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import {
    interviewCodeEditorActions,
    interviewCodeEditorReducer,
} from '../model/slice/InterviewCodeEditorSlice.ts';
import {
    getInterviewCodeEditorCodeLoading,
    getInterviewCodeEditorCurrentTask,
    getInterviewCodeEditorCurrentTaskCode,
    getInterviewCodeEditorError,
    getInterviewCodeEditorExecutionResult,
    getInterviewCodeEditorIsLoading,
    getInterviewCodeEditorTestsResult,
} from '../model/selectors/interviewCodeEditorSelectors.ts';
import { ExecutionResultComponent } from 'features/ExecutionResult';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { executeCode } from '../model/services/executeCode/executeCode.ts';
import { runTestsCode } from '../model/services/runTestsCode/runTestsCode.ts';
import { getLocalSaves, saveCodeLocal } from '../model/lib/savingService.ts';
import { PageLoader } from 'widgets/PageLoader';
import { saveTaskCode } from '../model/services/saveTaskCode/saveTaskCode.ts';
import { CodeMirrorEditor } from 'entities/CodeMirrorEditor';
import { RecordService } from 'shared/lib/services/RecordService.ts';
import { fetchLastSavedCode } from '../model/services/fetchLastSavedCode/fetchLastSavedCode.ts';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { mapLanguageToString } from 'pages/CreateTaskPage';
import { toast } from 'react-toastify';

interface InterviewCodeEditorProps extends EditorWrapperProps {
    className?: string;
    loading: boolean;
    saveExecutionResult?: (result: ExecutionResult) => void;
    saveTestsResult?: (result: TestsRunResponse) => void;
    saveCodeUpdate?: (code: string) => void;
    saveTaskUpdate?: (taskId: string) => void;
    expired?: boolean;
}

const reducers: ReducersList = {
    interviewCodeEditor: interviewCodeEditorReducer,
};

const recordService = new RecordService();

export const InterviewCodeEditor = (props: InterviewCodeEditorProps) => {
    const {
        className,
        loading,
        saveExecutionResult,
        saveTestsResult,
        saveCodeUpdate,
        saveTaskUpdate,
        expired,
    } = props;

    const currentTask = useSelector(getInterviewCodeEditorCurrentTask);
    const currentTaskCode = useSelector(getInterviewCodeEditorCurrentTaskCode);
    const tasks = useSelector(getInterviewPageTasks);
    const result = useSelector(getInterviewCodeEditorExecutionResult);
    const tests = useSelector(getInterviewCodeEditorTestsResult);
    const isLoading = useSelector(getInterviewCodeEditorIsLoading);
    const codeLoading = useSelector(getInterviewCodeEditorCodeLoading);
    const error = useSelector(getInterviewCodeEditorError);
    const dispatch = useAppDispatch();

    const tasksIds = useMemo(() => tasks?.map((task) => task.id), [tasks]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        tasksIds?.forEach((taskId) => {
            dispatch(fetchLastSavedCode(taskId));
        });
    }, [dispatch, tasksIds]);

    useEffect(() => {
        recordService.initRecordersStream(tasksIds ?? []);
        recordService.enablePageChangesCheck();
        return () => {
            recordService.clear();
        };
    }, [tasksIds]);

    const saveCode = useCallback(() => {
        if (currentTask) {
            saveCodeLocal(currentTask.id, currentTaskCode);
            toast.promise(
                dispatch(
                    saveTaskCode({
                        taskId: currentTask.id,
                        code: currentTaskCode,
                        recordInfo: recordService.getTaskRecord(currentTask.id),
                    }),
                ),
                { success: 'Сохранено', error: 'Произошла ошибка', pending: 'Сохраняется...' },
            );
        }
    }, [currentTask, currentTaskCode, dispatch]);

    const onChangeTask = useCallback(
        (task: TaskSolutionInfo) => {
            if (currentTask) {
                saveCodeLocal(currentTask.id, currentTaskCode);
                dispatch(
                    saveTaskCode({
                        taskId: currentTask.id,
                        code: currentTaskCode,
                        recordInfo: recordService.getTaskRecord(currentTask.id),
                    }),
                );
                recordService.stopRecord(currentTask.id);
            }
            const newCode = getLocalSaves(task.id) ?? task.startCode;
            dispatch(interviewCodeEditorActions.setCurrentTaskCode(newCode));
            dispatch(interviewCodeEditorActions.setCurrentTask(task));
            saveTaskUpdate?.(task.id);
            saveCodeUpdate?.(newCode);
            recordService.stopRecord(task.id);
        },
        [currentTask, currentTaskCode, dispatch, saveCodeUpdate, saveTaskUpdate],
    );

    const onChangeCode = useCallback(
        (value: string) => {
            dispatch(interviewCodeEditorActions.setCurrentTaskCode(value));
            saveCodeUpdate?.(value);
        },
        [dispatch, saveCodeUpdate],
    );

    const onStartCode = useCallback(async () => {
        const executionResult = await dispatch(
            executeCode({
                code: currentTaskCode,
                entryPoint: {
                    namespaceName: 'CodeRev',
                    className: 'Program',
                    methodName: 'Main',
                },
                language: currentTask?.programmingLanguage ?? ProgrammingLanguage.unknown,
            }),
        );
        const testsResult = await dispatch(
            runTestsCode({
                code: currentTaskCode,
                taskSolutionId: currentTask?.id,
            }),
        );
        if (executionResult.meta.requestStatus === 'fulfilled') {
            recordService.recordExecute(executionResult.payload as ExecutionResult);
            saveExecutionResult?.(executionResult.payload as ExecutionResult);
        }
        if (testsResult.meta.requestStatus === 'fulfilled') {
            saveTestsResult?.(testsResult.payload as TestsRunResponse);
        }
    }, [
        currentTask?.id,
        currentTask?.programmingLanguage,
        currentTaskCode,
        dispatch,
        saveExecutionResult,
        saveTestsResult,
    ]);

    const content = useMemo(
        () => (
            <div className={classNames(cls.InterviewCodeEditor, {}, [className])}>
                <div className={cls.editorContainer}>
                    <CodeMirrorEditor
                        isLoading={isLoading}
                        className={cls.editor}
                        onStart={onStartCode}
                        value={currentTaskCode}
                        onChange={onChangeCode}
                        language={
                            mapLanguageToString[
                                currentTask?.programmingLanguage ?? ProgrammingLanguage.unknown
                            ]
                        }
                        label={'Код'}
                        recordService={recordService}
                        readonly={expired}
                        onSave={saveCode}
                    />
                </div>
                <TaskTabs
                    selectedTaskId={currentTask?.id}
                    onSelect={onChangeTask}
                    tasks={tasks}
                    className={cls.tasks}
                    readonly={expired}
                />
                <ExecutionResultComponent
                    className={cls.result}
                    result={result}
                    tests={tests}
                    isLoading={isLoading ?? true}
                />
            </div>
        ),
        [
            className,
            currentTask?.id,
            currentTask?.programmingLanguage,
            currentTaskCode,
            expired,
            isLoading,
            onChangeCode,
            onChangeTask,
            onStartCode,
            result,
            saveCode,
            tasks,
            tests,
        ],
    );

    return (
        <DynamicModuleLoader
            reducers={reducers}
            removeAfterUnmount={false}
        >
            {loading || codeLoading ? <PageLoader /> : content}
        </DynamicModuleLoader>
    );
};
