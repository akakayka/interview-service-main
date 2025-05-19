import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
import cls from './TaskTabs.module.scss';
import { VStack } from 'shared/ui/Stack';
import { TaskTabsItem } from '../TaskTabsItem/TaskTabsItem.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { TaskSolutionInfo } from 'entities/Task';

interface TaskTabsProps {
    className?: string;
    tasks?: TaskSolutionInfo[];
    onSelect?: (task: TaskSolutionInfo) => void;
    selectedTaskId?: string;
    readonly?: boolean;
    saveSelectedTaskId?: (taskId: string) => void;
}

export const TaskTabs = memo((props: TaskTabsProps) => {
    const { className, tasks, selectedTaskId, onSelect, readonly, saveSelectedTaskId } = props;

    const onChangeTask = useCallback(
        (task: TaskSolutionInfo) => {
            onSelect?.(task);
            saveSelectedTaskId?.(task.id);
        },
        [onSelect, saveSelectedTaskId],
    );

    if (!tasks) {
        return null;
    }

    const tasksList = tasks.map((item) => (
        <TaskTabsItem
            key={item.id}
            selected={item.id === selectedTaskId}
            task={{
                number: item.taskOrder,
                task: item,
            }}
            onClick={() => onChangeTask(item)}
            readonly={readonly}
        />
    ));

    return (
        <VStack
            gap={'16'}
            className={classNames(cls.TaskTabs, {}, [className])}
            align={'center'}
        >
            <Text
                text={'Задачи'}
                weight={'semibold'}
            />
            {tasksList}
        </VStack>
    );
});
