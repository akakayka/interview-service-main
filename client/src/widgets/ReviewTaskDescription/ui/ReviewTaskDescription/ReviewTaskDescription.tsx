import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useMemo, useState } from 'react';
import cls from './ReviewTaskDescription.module.scss';
import TaskDescriptionIcon from 'shared/assets/icons/task-description.svg';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { TaskSolutionInfo } from 'entities/Task';
import { ReviewNotes } from 'widgets/ReviewNotes';
import { convertProgrammingLanguageToString } from 'shared/lib/programmingLanguages/programmingLanguages.ts';
import { convertTimeMsToString } from 'shared/lib/time/convertTimeMsToString.ts';

interface TaskDescriptionProps {
    className?: string;
    task?: TaskSolutionInfo;
    collapsed?: boolean;
    toggleCollapsed?: () => void;
    interviewSolutionId?: string;
    endTimeMs?: number;
}

export const ReviewTaskDescription = memo((props: TaskDescriptionProps) => {
    const { className, task, collapsed, toggleCollapsed, interviewSolutionId, endTimeMs } = props;
    const [isDescription, setIsDescription] = useState(true);

    const onClickDescription = useCallback(() => {
        setIsDescription(true);
    }, []);

    const onClickNotes = useCallback(() => {
        setIsDescription(false);
    }, []);

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
        <VStack className={classNames(cls.ReviewTaskDescription, {}, [className])}>
            <header className={cls.header}>
                <HStack gap={'16'}>
                    <TaskDescriptionIcon />
                    <button
                        onClick={onClickDescription}
                        className={classNames(cls.tab, { [cls.selected]: isDescription }, [])}
                    >
                        <Text
                            text={'Описание'}
                            size={'md'}
                        />
                    </button>
                    <button
                        onClick={onClickNotes}
                        className={classNames(cls.tab, { [cls.selected]: !isDescription }, [])}
                    >
                        <Text
                            text={'Заметки'}
                            size={'md'}
                        />
                    </button>
                </HStack>
                {toggleCollapsed && (
                    <Button
                        variant={'clear'}
                        className={cls.button}
                        onClick={toggleCollapsed}
                    >
                        <Text
                            text={'Скрыть условие'}
                            className={cls.buttonText}
                            size={'md'}
                            variant={'accent'}
                        />
                    </Button>
                )}
            </header>
            {isDescription ? (
                <VStack
                    gap={'16'}
                    max
                    className={cls.content}
                >
                    {!task && (
                        <Text
                            text={'Выберите задачу'}
                            variant={'error'}
                            size={'display_xs'}
                            weight={'semibold'}
                        />
                    )}
                    {endTimeMs && (
                        <Text
                            size={'lg'}
                            variant={'accent'}
                            text={`Интервью закончится в ${convertTimeMsToString(endTimeMs)}`}
                        />
                    )}
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
            ) : (
                <ReviewNotes interviewSolutionId={interviewSolutionId} />
            )}
        </VStack>
    );
});
