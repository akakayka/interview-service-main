import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './VacanciesList.module.scss';
import { VStack } from 'shared/ui/Stack';
import { VacancyListItem } from 'features/VacancyListItem';
import { VacanciesListHeader } from '../VacanciesListHeader/VacanciesListHeader.tsx';
import { InterviewInfo } from 'widgets/MeetingsList';
import { useSelector } from 'react-redux';
import { getVacanciesPageIsLoading } from 'pages/VacanciesPage';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Loader } from 'shared/ui/Loader/Loader.tsx';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';

interface VacanciesListProps {
    className?: string;
    items: InterviewInfo[];
    enableSearch?: boolean;
}

export const VacanciesList = memo((props: VacanciesListProps) => {
    const { className, items, enableSearch = false } = props;

    let content: ReactNode;
    const isLoading = useSelector(getVacanciesPageIsLoading);
    const [query, setQuery] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<InterviewInfo[]>(items);
    const navigate = useNavigate();

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    const addVacancy = useCallback(() => {
        navigate(RoutePath.interview_create);
    }, [navigate]);

    const onChangeQuery = useCallback(
        (value: string) => {
            if (!value) {
                setQuery(value);
                setFilteredItems(items);
                return;
            }
            setQuery(value);
            const newItems = items.filter((item) => {
                return item.vacancy.toLowerCase().includes(value.toLowerCase());
            });
            setFilteredItems(newItems);
        },
        [items],
    );

    const itemsList = useMemo(
        () =>
            filteredItems?.map((item) => (
                <VacancyListItem
                    className={cls.item}
                    item={item}
                    key={item.id}
                />
            )),
        [filteredItems],
    );

    if (!isLoading && !items?.length) {
        content = (
            <Text
                text={'Пока что нет никаких вакансий =('}
                size={'md'}
            />
        );
    } else {
        content = <div className={cls.VacanciesList}>{itemsList}</div>;
    }

    if (isLoading) {
        content = (
            <>
                <VStack
                    className={cls.loader}
                    max
                    align={'center'}
                    justify={'center'}
                >
                    <Loader />
                </VStack>
            </>
        );
    }

    return (
        <VStack
            max
            gap={'32'}
            className={classNames(cls.wrapper, {}, [className])}
        >
            {enableSearch && (
                <VacanciesListHeader
                    addVacancy={addVacancy}
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
