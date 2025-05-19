import { memo, useCallback, useEffect } from 'react';
import { ReviewCodeEditor } from 'widgets/ReviewCodeEditor';
import { useSelector } from 'react-redux';
import {
    getAsyncReviewPageCurrentTask,
    getAsyncReviewPageCurrentTaskCode,
    getAsyncReviewPageExecutionResult,
    getAsyncReviewPageTasks,
    getAsyncReviewPageTestsResult,
} from '../../model/selectors/asyncReviewPageSelectors.ts';
import { TaskSolutionInfo } from 'entities/Task';
import { fetchLastSolutionSavedCode } from '../../model/services/fetchLastSolutionSavedCode/fetchLastSolutionSavedCode.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { executeReviewCode } from '../../model/services/executeReviewCode/executeReviewCode.ts';
import { asyncReviewPageActions } from '../../model/slice/asyncReviewPageSlice.ts';
import { SetURLSearchParams } from 'react-router-dom';

interface AsyncReviewPageEditorProps {
    className?: string;
    taskId?: string;
    setParams?: SetURLSearchParams;
}

export const AsyncReviewPageEditor = memo((props: AsyncReviewPageEditorProps) => {
    const { className, taskId, setParams } = props;

    const dispatch = useAppDispatch();
    const currentTask = useSelector(getAsyncReviewPageCurrentTask);
    const currentTaskCode = useSelector(getAsyncReviewPageCurrentTaskCode);
    const tasks = useSelector(getAsyncReviewPageTasks);
    const result = useSelector(getAsyncReviewPageExecutionResult);
    const tests = useSelector(getAsyncReviewPageTestsResult);

    const onChangeTask = useCallback(
        (task: TaskSolutionInfo) => {
            dispatch(fetchLastSolutionSavedCode(task.id));
            dispatch(asyncReviewPageActions.setCurrentTask(task));
            setParams?.({ taskId: task.id });
        },
        [dispatch, setParams],
    );

    useEffect(() => {
        if (!tasks?.length) return;
        const queryTask = tasks?.find((task: TaskSolutionInfo) => task.id === taskId);
        onChangeTask(queryTask ?? tasks?.[0]);
    }, [onChangeTask, taskId, tasks]);

    const onStart = useCallback(() => {
        if (currentTask && currentTaskCode) {
            dispatch(
                executeReviewCode({
                    code: currentTaskCode,
                    entryPoint: {
                        namespaceName: 'CodeRev',
                        className: 'Program',
                        methodName: 'Main',
                    },
                    language: currentTask.programmingLanguage,
                }),
            );
        }
    }, [currentTask, currentTaskCode, dispatch]);

    return (
        <ReviewCodeEditor
            className={className}
            isSync={false}
            tasks={tasks}
            onChangeTask={onChangeTask}
            currentTaskCode={currentTaskCode}
            currentTask={currentTask}
            onStart={onStart}
            tests={tests}
            result={result}
            currentTaskId={undefined}
        />
    );
});
