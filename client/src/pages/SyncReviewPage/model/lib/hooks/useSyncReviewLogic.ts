import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useSelector } from 'react-redux';
import {
    getSyncReviewPageCurrentTask,
    getSyncReviewPageCurrentTaskCode,
    getSyncReviewPageCurrentTaskId,
    getSyncReviewPageExecutionResult,
    getSyncReviewPageIsLoading,
    getSyncReviewPageTasks,
    getSyncReviewPageTestsResult,
} from '../../selectors/reviewPageSelectors.ts';
import { useCallback } from 'react';
import { TaskSolutionInfo } from 'entities/Task';
import { reviewPageActions } from '../../..';

export function useSyncReviewLogic() {
    const dispatch = useAppDispatch();

    const tasks = useSelector(getSyncReviewPageTasks);
    const currentTask = useSelector(getSyncReviewPageCurrentTask);
    const currentTaskId = useSelector(getSyncReviewPageCurrentTaskId);
    const currentTaskCode = useSelector(getSyncReviewPageCurrentTaskCode);
    const result = useSelector(getSyncReviewPageExecutionResult);
    const tests = useSelector(getSyncReviewPageTestsResult);
    const isLoading = useSelector(getSyncReviewPageIsLoading);

    const onChangeTask = useCallback(
        (task: TaskSolutionInfo) => {
            dispatch(reviewPageActions.setCurrentTask(task));
        },
        [dispatch],
    );

    return {
        tasks,
        currentTask,
        currentTaskCode,
        currentTaskId,
        result,
        tests,
        isLoading,
        onChangeTask,
    };
}
