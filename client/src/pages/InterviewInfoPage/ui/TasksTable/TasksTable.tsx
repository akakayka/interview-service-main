import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useMemo } from 'react';
import cls from './TasksTable.module.scss';
import { TaskReviewResponse } from 'pages/SyncReviewPage';
import { VStack } from 'shared/ui/Stack';
import { TasksTableRow } from '../TasksTableRow/TasksTableRow.tsx';

interface TasksTableProps {
    className?: string;
    tasks?: TaskReviewResponse[];
    interviewSolutionId?: string;
}

export const TasksTable = memo((props: TasksTableProps) => {
    const { className, tasks, interviewSolutionId } = props;

    const itemsList = useMemo(
        () => (
            <>
                <TasksTableRow
                    isHeader
                    className={cls.header}
                />
                <VStack
                    max
                    className={cls.items}
                >
                    {tasks?.map((task) => (
                        <TasksTableRow
                            task={task}
                            key={task.taskSolutionId}
                            interviewSolutionId={interviewSolutionId}
                        />
                    ))}
                </VStack>
            </>
        ),
        [tasks],
    );

    return <VStack className={classNames(cls.TasksTable, {}, [className])}>{itemsList}</VStack>;
});
