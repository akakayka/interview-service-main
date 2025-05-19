import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useMemo } from 'react';
import cls from './TasksListItem.module.scss';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Tab } from 'shared/ui/Tab/Tab.tsx';
import { convertProgrammingLanguageToString } from 'shared/lib/programmingLanguages/programmingLanguages.ts';
import { TaskInfo } from 'entities/Task';
import { AppLink } from 'shared/ui/AppLink/AppLink.tsx';

interface TasksListItemProps {
    className?: string;
    task: TaskInfo;
}

export const TasksListItem = memo((props: TasksListItemProps) => {
    const { className, task } = props;

    const language = useMemo(
        () => convertProgrammingLanguageToString(task.programmingLanguage),
        [task.programmingLanguage],
    );

    return (
        <AppLink
            to={`/tasks/${task.id}`}
            theme={'clear'}
            max
        >
            <Tab className={classNames(cls.TasksListItem, {}, [className])}>
                <VStack gap={'32'}>
                    <Text
                        variant={'accent'}
                        text={task.isDeleted ? task.name + ' (до ред.)' : task.name}
                        weight={'semibold'}
                        size={'lg'}
                    />
                    <div className={cls.language}>
                        <Text
                            text={language}
                            variant={'green'}
                        />
                    </div>
                </VStack>
            </Tab>
        </AppLink>
    );
});
