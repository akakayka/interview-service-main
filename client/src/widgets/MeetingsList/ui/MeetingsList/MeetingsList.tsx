import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './MeetingsList.module.scss';
import { VStack } from 'shared/ui/Stack';
import { MeetingsListItem } from 'features/MeetingsListItem';
import { MeetingsListHeader } from '../MeetingsListHeader/MeetingsListHeader.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { useSelector } from 'react-redux';
import { Loader } from 'shared/ui/Loader/Loader.tsx';
import { getMeetingsPageIsLoading, MeetingInfo } from 'pages/MeetingsPage';
import { toast } from 'react-toastify';
import { getAddCandidateError } from '../../model/selectors/addCandidateSelectors.ts';

interface MeetingsListProps {
    className?: string;
    items: MeetingInfo[];
    enableSearch?: boolean;
    header?: ReactNode;
    forCandidate?: boolean;
}

export const MeetingsList = memo((props: MeetingsListProps) => {
    const { className, items, enableSearch = false, header, forCandidate = false } = props;
    let content: ReactNode;
    const isLoading = useSelector(getMeetingsPageIsLoading);
    const [query, setQuery] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<MeetingInfo[]>(items);
    const error = useSelector(getAddCandidateError);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

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
                <MeetingsListItem
                    meeting={item}
                    className={cls.item}
                    key={item.interviewSolutionId}
                    forCandidate={forCandidate}
                />
            )),
        [filteredItems],
    );

    if (!items?.length) {
        content = <Text text={'Пока что нет никаких встреч =('} />;
    } else {
        content = <div className={cls.MeetingsList}>{itemsList}</div>;
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
                <MeetingsListHeader
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
