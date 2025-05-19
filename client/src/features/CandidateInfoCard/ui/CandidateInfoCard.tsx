import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
import cls from './CandidateInfoCard.module.scss';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { PhoneCard } from 'shared/ui/PhoneCard/PhoneCard.tsx';
import { EmailCard } from 'shared/ui/EmailCard/EmailCard.tsx';
import { SelectOption } from 'shared/ui/Select/ui/SelectOption/SelectOption.tsx';
import { Select } from 'shared/ui/Select/ui/Select/Select.tsx';
import { UserRole } from 'entities/User';
import type { InterviewResult } from 'pages/InterviewInfoPage';
import { mapInterviewResultToString } from 'pages/InterviewInfoPage';

export type Grade = 1 | 2 | 3 | 4 | 5;

function convertInterviewResultToString(interviewResult?: InterviewResult) {
    if (interviewResult === 0) return 'Отклонен';
    if (interviewResult === 1) return 'Подумать';
    if (interviewResult === 2) return 'Принят';
    return 'Нет';
}

const interviewResultOptions: SelectOption[] = [
    {
        value: 0,
        title: convertInterviewResultToString(0),
    },
    {
        value: 1,
        title: convertInterviewResultToString(1),
    },
    {
        value: 2,
        title: convertInterviewResultToString(2),
    },
];

const gradeOptions: SelectOption[] = [
    {
        value: 1,
        title: '1',
    },
    {
        value: 2,
        title: '2',
    },
    {
        value: 3,
        title: '3',
    },
    {
        value: 4,
        title: '4',
    },
    {
        value: 5,
        title: '5',
    },
];

interface CandidateInfoCardProps {
    className?: string;
    name?: string;
    phone?: string;
    email?: string;
    vertical?: boolean;
    onGrade?: (grade: Grade) => void;
    grade?: Grade;
    role?: UserRole;
    onResult?: (result: InterviewResult) => void;
    result?: InterviewResult;
}

export const CandidateInfoCard = memo((props: CandidateInfoCardProps) => {
    const {
        className,
        name,
        phone,
        email,
        vertical = false,
        onGrade,
        grade,
        role,
        result,
        onResult,
    } = props;

    const Stack = vertical ? VStack : HStack;

    const onChangeGrade = useCallback(
        (value: SelectOption) => {
            onGrade?.(value.value as Grade);
        },
        [onGrade],
    );

    const onChangeInterviewResult = useCallback(
        (value: SelectOption) => {
            onResult?.(value.value as InterviewResult);
        },
        [onResult],
    );

    return (
        <VStack
            max
            gap={'16'}
            className={classNames(cls.card, {}, [
                cls.candidateInfo,
                cls.CandidateInfoCard,
                className,
            ])}
        >
            <HStack
                max
                gap={'8'}
            >
                <Text
                    size={'display_xs'}
                    weight={'medium'}
                    text={'ФИО:'}
                    variant={'accent'}
                />
                <Text
                    size={'display_xs'}
                    weight={'semibold'}
                    text={name}
                />
            </HStack>
            <Stack
                max
                gap={'16'}
            >
                <PhoneCard phone={phone} />
                <EmailCard email={email} />
                {role === UserRole.hrManager && onResult && (
                    <HStack gap={'8'}>
                        <Text text={'Результат интервью'} />
                        <Select
                            selected={
                                result !== undefined
                                    ? {
                                          value: result,
                                          title: mapInterviewResultToString[result],
                                      }
                                    : null
                            }
                            options={interviewResultOptions}
                            onChange={onChangeInterviewResult}
                            placeholder={'Результат'}
                        />
                        <Text text={'Оценка:'} />
                        <Text
                            text={grade ? `${grade}` : 'нет'}
                            weight={'medium'}
                            variant={'accent'}
                        />
                    </HStack>
                )}
                {(role === UserRole.interviewer || role === UserRole.admin) && onGrade && (
                    <HStack
                        gap={'8'}
                        max
                    >
                        <HStack gap={'8'}>
                            <Text text={'Оценка:'} />
                            <Select
                                selected={
                                    grade
                                        ? {
                                              value: grade,
                                              title: `${grade}`,
                                          }
                                        : null
                                }
                                onChange={onChangeGrade}
                                options={gradeOptions}
                                placeholder={'Оценка'}
                            />
                        </HStack>
                        <HStack
                            gap={'8'}
                            max
                        >
                            <Text
                                text={'Результат интервью:'}
                                size={'lg'}
                            />
                            <Text
                                text={convertInterviewResultToString(result)}
                                weight={'semibold'}
                                variant={'accent'}
                                size={'lg'}
                            />
                        </HStack>
                    </HStack>
                )}
                {role === UserRole.candidate && (
                    <HStack gap={'8'}>
                        <Text
                            text={'Оценка:'}
                            size={'lg'}
                        />
                        <Text
                            text={grade ? `${grade}` : 'Нет'}
                            weight={'semibold'}
                            variant={'accent'}
                            size={'lg'}
                        />
                        <Text
                            text={'Результат интервью:'}
                            size={'lg'}
                        />
                        <Text
                            text={convertInterviewResultToString(result)}
                            weight={'semibold'}
                            variant={'accent'}
                            size={'lg'}
                        />
                    </HStack>
                )}
            </Stack>
        </VStack>
    );
});
