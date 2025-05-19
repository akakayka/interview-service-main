import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useState } from 'react';
import cls from './CandidatesListHeader.module.scss';
import { HStack, VStack } from 'shared/ui/Stack';
import { Search } from 'features/Search';
import { Button } from 'shared/ui/Button/Button.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import AddIcon from 'shared/assets/icons/add.svg';
import { Navigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';

interface CandidatesListHeaderProps {
    className?: string;
    query?: string;
    onChangeQuery?: (query: string) => void;
}

export const CandidatesListHeader = memo((props: CandidatesListHeaderProps) => {
    const { className, query, onChangeQuery } = props;
    const [redirect, setRedirect] = useState(false);

    if (redirect) {
        return <Navigate to={RoutePath.interview_create} />;
    }

    return (
        <VStack
            max
            gap={'16'}
            className={classNames(cls.CandidatesListHeader, {}, [className])}
        >
            <Text
                text={'Поиск'}
                size={'xl'}
                weight={'semibold'}
            />
            <HStack
                max
                gap={'16'}
            >
                <Search
                    query={query}
                    onChangeQuery={onChangeQuery}
                    placeholder={'Поиск...'}
                />
                <Button onClick={() => setRedirect(true)}>
                    <HStack
                        gap={'4'}
                        justify={'center'}
                    >
                        <AddIcon />
                        <Text
                            text={'Создать вакансию'}
                            variant={'white'}
                            weight={'medium'}
                        />
                    </HStack>
                </Button>
            </HStack>
        </VStack>
    );
});
