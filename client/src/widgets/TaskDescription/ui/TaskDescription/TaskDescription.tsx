import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useMemo } from 'react';
import cls from './TaskDescription.module.scss';
import TaskDescriptionIcon from 'shared/assets/icons/task-description.svg';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { TaskSolutionInfo } from 'entities/Task';
import { convertTimeMsToString } from 'shared/lib/time/convertTimeMsToString.ts';
import { convertProgrammingLanguageToString } from 'shared/lib/programmingLanguages/programmingLanguages.ts';

interface TaskDescriptionProps {
    className?: string;
    task?: TaskSolutionInfo;
    collapsed?: boolean;
    toggleCollapsed?: () => void;
    endTaskSolution?: () => void;
    endTimeMs?: number;
    expired?: boolean;
    taskIsDone?: boolean;
}

export const TaskDescription = memo((props: TaskDescriptionProps) => {
    const {
        className,
        task,
        collapsed,
        toggleCollapsed,
        endTaskSolution,
        endTimeMs,
        expired,
        taskIsDone = false,
    } = props;

    const taskText = useMemo(() => {
        if (task) {
            return task.taskText.split('\n').map((paragraph: string) => (
                <Text
                    text={paragraph}
                    className={cls.paragraph}
                    key={paragraph}
                    size={'md'}
                />
            ));
        }
        return '';
    }, [task]);

    if (collapsed) {
        return (
            <Button
                className={cls.collapseButton}
                square
                variant={'white'}
                onClick={toggleCollapsed}
            >
                <TaskDescriptionIcon />
            </Button>
        );
    }

    return (
        <VStack
            className={classNames(cls.TaskDescription, {}, [className])}
            gap={'16'}
        >
            <header className={cls.header}>
                <HStack gap={'16'}>
                    <TaskDescriptionIcon />
                    <Text text={'Описание задачи'} />
                </HStack>
                {toggleCollapsed && (
                    <Button
                        variant={'clear'}
                        className={cls.button}
                        onClick={toggleCollapsed}
                    >
                        <Text
                            text={'Скрыть условие'}
                            size={'md'}
                            className={cls.buttonText}
                            variant={'accent'}
                        />
                    </Button>
                )}
            </header>
            {endTimeMs && (
                <Text
                    size={'lg'}
                    variant={'accent'}
                    text={`Интервью закончится в ${convertTimeMsToString(endTimeMs)}`}
                />
            )}
            <VStack
                justify={'between'}
                max
                className={cls.content}
                gap={'16'}
            >
                <VStack
                    gap={'16'}
                    max
                >
                    {task && (
                        <HStack
                            max
                            justify={'between'}
                        >
                            <Text
                                text={task.taskName}
                                weight={'semibold'}
                                size={'display_sm'}
                            />
                            <div className={cls.language}>
                                <Text
                                    text={convertProgrammingLanguageToString(
                                        task.programmingLanguage,
                                    )}
                                    variant={'green'}
                                />
                            </div>
                        </HStack>
                    )}
                    <VStack
                        gap={'16'}
                        className={cls.taskText}
                    >
                        {taskText}
                    </VStack>
                </VStack>
                <HStack
                    gap={'16'}
                    max
                >
                    {endTaskSolution && (
                        <Button
                            onClick={endTaskSolution}
                            disabled={taskIsDone || expired}
                        >
                            {task?.isDone ? (
                                <Text
                                    text={'Отправлено'}
                                    variant={'white'}
                                    weight={'medium'}
                                />
                            ) : (
                                <Text
                                    text={'Отправить решение'}
                                    variant={'white'}
                                    weight={'medium'}
                                />
                            )}
                        </Button>
                    )}
                </HStack>
            </VStack>
        </VStack>
    );
});
