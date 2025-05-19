import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './VacanciesListHeader.module.scss';
import { Search } from 'features/Search';
import { Button } from 'shared/ui/Button/Button.tsx';
import { HStack, VStack } from 'shared/ui/Stack';
import AddIcon from 'shared/assets/icons/add.svg';
import { Text } from 'shared/ui/Text/Text.tsx';

interface VacanciesListHeaderProps {
    className?: string;
    query?: string;
    onChangeQuery?: (query: string) => void;
    addVacancy?: () => void;
}

export const VacanciesListHeader = memo((props: VacanciesListHeaderProps) => {
    const { className, onChangeQuery, query, addVacancy } = props;

    return (
        <VStack
            max
            gap={'16'}
            className={classNames(cls.VacanciesListHeader, {}, [className])}
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
                <Button onClick={addVacancy}>
                    <HStack gap={'4'}>
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
