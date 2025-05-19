import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useState } from 'react';
import cls from './MeetingsListHeader.module.scss';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Search } from 'features/Search';
import { Button } from 'shared/ui/Button/Button.tsx';
import AddIcon from 'shared/assets/icons/add.svg';
import { AddCandidateForm } from '../AddCandidateForm/AddCandidateForm.tsx';
import { Modal } from 'shared/ui/Modal/Modal.tsx';

interface MeetingsListHeaderProps {
    className?: string;
    query?: string;
    onChangeQuery?: (query: string) => void;
}

export const MeetingsListHeader = memo((props: MeetingsListHeaderProps) => {
    const { className, query, onChangeQuery } = props;
    const [isOpen, setIsOpen] = useState(false);

    return (
        <VStack
            max
            gap={'16'}
            className={classNames(cls.MeetingsListHeader, {}, [className])}
        >
            <Modal
                className={cls.modal}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                lazy
            >
                <AddCandidateForm onClose={() => setIsOpen(false)} />
            </Modal>
            <Text
                text={'Поиск'}
                weight={'semibold'}
                size={'xl'}
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
                <Button onClick={() => setIsOpen(true)}>
                    <HStack
                        gap={'4'}
                        justify={'center'}
                    >
                        <AddIcon />
                        <Text
                            text={'Пригласить кандидата'}
                            size={'md'}
                            variant={'white'}
                            weight={'medium'}
                        />
                    </HStack>
                </Button>
            </HStack>
        </VStack>
    );
});
