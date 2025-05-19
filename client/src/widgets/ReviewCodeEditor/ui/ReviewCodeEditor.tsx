import cls from './ReviewCodeEditor.module.scss';
import { EditorWrapperProps } from 'features/EditorWrapper';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { reviewCodeEditorReducer } from '../model/slice/ReviewCodeEditorSlice.ts';
import { TaskSolutionInfo } from 'entities/Task';
import { classNames } from 'shared/lib/classNames/classNames.ts';
import { CodeMirrorEditor } from 'entities/CodeMirrorEditor';
import { mapLanguageToString } from 'pages/CreateTaskPage';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { TaskTabs } from 'features/TaskTabs';
import { ExecutionResultComponent } from 'features/ExecutionResult';
import { VStack } from 'shared/ui/Stack';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { getReviewCodeEditorError } from '../model/selectors/interviewCodeEditorSelectors.ts';

interface ReviewCodeEditorProps extends EditorWrapperProps {
    className?: string;
    isSync?: boolean;
    tasks: TaskSolutionInfo[] | undefined;
    currentTask: TaskSolutionInfo | undefined;
    currentTaskCode: string | undefined;
    currentTaskId: string | undefined;
    result: ExecutionResult | undefined;
    tests: TestsRunResponse | undefined;
    isLoading?: boolean;
    onChangeTask: (task: TaskSolutionInfo) => void;
}

const reducers: ReducersList = {
    reviewCodeEditor: reviewCodeEditorReducer,
};

export const ReviewCodeEditor = (props: ReviewCodeEditorProps) => {
    const {
        className,
        isSync,
        currentTask,
        tasks,
        currentTaskId,
        currentTaskCode,
        onChangeTask,
        result,
        tests,
        isLoading,
        onStart,
    } = props;

    const error = useSelector(getReviewCodeEditorError);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <VStack
                max
                gap={'16'}
                className={classNames(cls.ReviewCodeEditor, {}, [className])}
            >
                <CodeMirrorEditor
                    className={cls.editor}
                    value={currentTaskCode}
                    label={'Код'}
                    readonly
                    onStart={onStart}
                    language={
                        mapLanguageToString[
                            currentTask?.programmingLanguage ?? ProgrammingLanguage.unknown
                        ]
                    }
                />
                <TaskTabs
                    selectedTaskId={currentTaskId ?? currentTask?.id}
                    tasks={tasks}
                    className={cls.tasks}
                    readonly={isSync}
                    onSelect={onChangeTask}
                />
                <ExecutionResultComponent
                    className={cls.result}
                    result={result}
                    tests={tests}
                    isLoading={isLoading ?? false}
                />
            </VStack>
        </DynamicModuleLoader>
    );
};
