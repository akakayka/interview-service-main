import { classNames, Mods } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './TaskTabsItem.module.scss';
import { Button, ButtonVariant } from 'shared/ui/Button/Button.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { TaskSolutionInfo } from 'entities/Task';

export interface TaskTabsItemType {
    number: string;
    task: TaskSolutionInfo;
}

interface TaskTabsItemProps {
    className?: string;
    selected?: boolean;
    task: TaskTabsItemType;
    onClick?: () => void;
    readonly?: boolean;
}

export const TaskTabsItem = memo((props: TaskTabsItemProps) => {
    const { className, task, selected, onClick, readonly } = props;

    const mods: Mods = {
        [cls.selected]: selected,
        [cls.readonly]: readonly,
    };

    const variant: ButtonVariant = task.task.isDone ? 'green' : selected ? 'disabled' : 'white';

    return (
        <Button
            variant={variant}
            onClick={!readonly ? onClick : () => {}}
            disabled={selected || readonly}
            square
            className={classNames(cls.TaskTabsItem, mods, [className])}
        >
            <Text
                text={task.number.toString()}
                weight={'medium'}
            />
        </Button>
    );
});
