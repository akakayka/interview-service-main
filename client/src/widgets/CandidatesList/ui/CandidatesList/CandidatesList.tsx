import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './CandidatesList.module.scss';
import { CandidatesListItem } from 'features/CandidatesListItem';
import { CandidatesListHeader } from '../CandidatesListHeader/CandidatesListHeader.tsx';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Loader } from 'shared/ui/Loader/Loader.tsx';
import { useSelector } from 'react-redux';
import { CandidateInfo, getInterviewsPageIsLoading } from 'pages/InterviewsPage';

interface CandidatesListProps {
    className?: string;
    enableSearch?: boolean;
    items: CandidateInfo[];
    header?: ReactNode;
    forCandidate?: boolean;
}

export const CandidatesList = memo((props: CandidatesListProps) => {
    const { className, enableSearch = false, items, header, forCandidate = false } = props;
    let content: ReactNode;
    const isLoading = useSelector(getInterviewsPageIsLoading);
    const [query, setQuery] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<CandidateInfo[]>(items);

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
                return (
                    item.firstName.toLowerCase().includes(value.toLowerCase()) ||
                    item.vacancy.toLowerCase().includes(value.toLowerCase()) ||
                    item.surname.toLowerCase().includes(value.toLowerCase())
                );
            });
            setFilteredItems(newItems);
        },
        [items],
    );

    const itemsList = useMemo(
        () =>
            filteredItems?.map((item) => (
                <CandidatesListItem
                    candidate={item}
                    className={cls.item}
                    key={item.interviewSolutionId}
                    forCandidate={forCandidate}
                />
            )),
        [filteredItems, forCandidate],
    );

    if (!isLoading && !items?.length) {
        content = (
            <Text
                text={'Пока что нет никаких интервью =('}
                size={'md'}
            />
        );
    } else {
        content = <div className={cls.CandidatesList}>{itemsList}</div>;
    }

    if (isLoading) {
        content = (
            <>
                {header && header}
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
            {header && header}
            {enableSearch && (
                <CandidatesListHeader
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
