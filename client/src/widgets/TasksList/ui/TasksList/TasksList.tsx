import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './TasksList.module.scss';
import { VStack } from 'shared/ui/Stack';
import { TasksListHeader } from '../TasksListHeader/TasksListHeader.tsx';
import { TasksListItem } from 'features/TasksListItem';
import { Text } from 'shared/ui/Text/Text.tsx';
import { TaskInfo } from 'entities/Task';
import { useSelector } from 'react-redux';
import { Loader } from 'shared/ui/Loader/Loader.tsx';
import { getTasksPageIsLoading } from 'pages/TasksPage';

interface TasksListProps {
    className?: string;
    items?: TaskInfo[];
    enableSearch?: boolean;
}

export const TasksList = memo((props: TasksListProps) => {
    const { className, items = [], enableSearch = false } = props;
    let content: ReactNode;
    const isLoading = useSelector(getTasksPageIsLoading);
    const [query, setQuery] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<TaskInfo[]>(items);

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    const onChangeQuery = useCallback(
        (value: string) => {
            if (!value) {
                setQuery(value);
                setFilteredItems(items);
                return;
            }
            setQuery(value);
            const newItems = items.filter((item) => {
                return item.name.toLowerCase().includes(value.toLowerCase());
            });
            setFilteredItems(newItems);
        },
        [items],
    );

    const itemsList = useMemo(
        () =>
            filteredItems.map((item) => (
                <TasksListItem
                    task={item}
                    className={cls.item}
                    key={item.id}
                />
            )),
        [filteredItems],
    );

    if (!items?.length) {
        content = (
            <Text
                text={'Пока что нет никаких задачек =('}
                size={'md'}
            />
        );
    } else {
        content = <div className={cls.TasksList}>{itemsList}</div>;
    }

    if (isLoading) {
        content = (
            <VStack
                className={cls.loader}
                max
                align={'center'}
                justify={'center'}
            >
                <Loader />
            </VStack>
        );
    }

    return (
        <VStack
            max
            gap={'32'}
            className={classNames(cls.wrapper, {}, [className])}
        >
            {enableSearch && (
                <TasksListHeader
                    className={cls.header}
                    query={query}
                    onChangeQuery={onChangeQuery}
                />
            )}
            <VStack
                gap={'32'}
                className={cls.container}
            >
                {content}
            </VStack>
        </VStack>
    );
});
