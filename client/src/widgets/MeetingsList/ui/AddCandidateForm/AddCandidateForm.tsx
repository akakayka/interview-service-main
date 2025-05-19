import { classNames } from 'shared/lib/classNames/classNames.ts';
import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react';
import cls from './AddCandidateForm.module.scss';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Input } from 'shared/ui/Input/Input.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import CopyIcon from 'shared/assets/icons/copy.svg';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { addCandidateActions, addCandidateReducer } from '../../model/slice/addCandidateSlice.ts';
import { useSelector } from 'react-redux';
import {
    getAddCandidateFormIsSynchronous,
    getAddCandidateInterviews,
    getAddCandidateIsLoading,
    getAddCandidateLink,
} from '../../model/selectors/addCandidateSelectors.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { createInvite } from '../../model/services/createInvite/createInvite.ts';
import { Select } from 'shared/ui/Select/ui/Select/Select.tsx';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { fetchInterviewsList } from '../../model/services/fetchinterviewsList/fetchInterviewsList.ts';
import { SelectOption } from 'shared/ui/Select/ui/SelectOption/SelectOption.tsx';
import { toast } from 'react-toastify';

interface AddCandidateFormProps {
    className?: string;
    onClose?: () => void;
}

const reducers: ReducersList = {
    addCandidate: addCandidateReducer,
};

export const AddCandidateForm = memo((props: AddCandidateFormProps) => {
    const { className, onClose } = props;
    const isLoading = useSelector(getAddCandidateIsLoading);

    const link = useSelector(getAddCandidateLink);
    const dispatch = useAppDispatch();
    const isSynchronous = useSelector(getAddCandidateFormIsSynchronous);

    useInitialEffect(() => {
        dispatch(fetchInterviewsList());
    });

    const interviews = useSelector(getAddCandidateInterviews);
    const [selected, setSelected] = useState<SelectOption | null>(null);

    const optionsList = useMemo(
        () =>
            interviews?.map(
                (interview) =>
                    ({
                        title: interview.vacancy,
                        value: interview.id,
                    }) as SelectOption,
            ),
        [interviews],
    );

    const [option, setOption] = useState(isSynchronous);

    const createInviteLink = useCallback(() => {
        dispatch(createInvite());
    }, [dispatch]);

    const setIsSynchronous = useCallback(
        (value: boolean) => {
            dispatch(addCandidateActions.setIsSynchronous(value));
        },
        [dispatch],
    );

    const onChangeOption = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setOption(e.target.value === 'true');
            setIsSynchronous(!option);
        },
        [option, setIsSynchronous],
    );

    const onChangeInterview = useCallback(
        (selected: SelectOption) => {
            setSelected(selected);
            dispatch(addCandidateActions.setInterviewId(selected.value as string));
        },
        [dispatch],
    );

    const onCopy = useCallback(() => {
        if (link) {
            navigator.clipboard.writeText(link);
            toast.success('Скопировано!', {
                position: 'top-center',
            });
        }
        if (!link) {
            toast.warn('Для начала сгенерируйте ссылку', {
                position: 'top-center',
            });
        }
    }, [link]);

    return (
        <DynamicModuleLoader
            reducers={reducers}
            removeAfterUnmount
        >
            <VStack
                gap={'32'}
                className={classNames(cls.AddCandidateForm, {}, [className])}
            >
                <VStack gap={'24'}>
                    <Text
                        text={'Пригласить нового кандидата'}
                        size={'display_xs'}
                        weight={'semibold'}
                    />
                    <Text
                        size={'md'}
                        variant={'secondary'}
                        text={
                            'Для приглашения нового кандидата нужно создать ссылку, по которой он сможет зарегистрироваться на платформе'
                        }
                    />
                </VStack>
                <VStack gap={'8'}>
                    <Text
                        text={'Тип интервью'}
                        weight={'semibold'}
                    />
                    <HStack gap={'4'}>
                        <input
                            type="radio"
                            name="isSynchronous"
                            value="false"
                            id="nonSync"
                            checked={!option}
                            onChange={onChangeOption}
                        />
                        <label htmlFor="nonSync">Асинхронное</label>
                    </HStack>
                    <HStack gap={'4'}>
                        <input
                            type="radio"
                            name="isSynchronous"
                            value="true"
                            id="sync"
                            checked={option}
                            onChange={onChangeOption}
                        />
                        <label htmlFor="sync">Синхронное</label>
                    </HStack>
                </VStack>
                <VStack
                    gap={'8'}
                    className={cls.select}
                >
                    <Text
                        text={'Интервью'}
                        weight={'semibold'}
                    />
                    <Select
                        placeholder={'Выберите интервью...'}
                        selected={selected}
                        options={optionsList || []}
                        onChange={onChangeInterview}
                    />
                </VStack>
                <HStack
                    gap={'16'}
                    align={'end'}
                    max
                >
                    <Input
                        disabled
                        label={'Ссылка для регистрации'}
                        placeholder={'Ссылка...'}
                        value={link}
                    />
                    <Button
                        variant={'secondary'}
                        square
                        onClick={onCopy}
                    >
                        <CopyIcon />
                    </Button>
                </HStack>
                <HStack gap={'16'}>
                    <Button
                        onClick={createInviteLink}
                        disabled={!selected || isLoading}
                    >
                        <Text
                            text={'Создать ссылку'}
                            variant={'white'}
                        />
                    </Button>
                    <Button
                        variant={'secondary'}
                        onClick={onClose}
                    >
                        <Text
                            text={'Отменить'}
                            variant={'accent'}
                        />
                    </Button>
                </HStack>
            </VStack>
        </DynamicModuleLoader>
    );
});
