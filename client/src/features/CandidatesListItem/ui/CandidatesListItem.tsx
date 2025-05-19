import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useMemo } from 'react';
import cls from './CandidatesListItem.module.scss';
import { CandidateStatus } from 'entities/Candidate';
import { Tab } from 'shared/ui/Tab/Tab.tsx';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { AppLink } from 'shared/ui/AppLink/AppLink.tsx';
import { CandidateInfo } from 'pages/InterviewsPage';
import type { InterviewResult } from 'pages/InterviewInfoPage';

interface CandidatesListItemProps {
    className?: string;
    candidate: CandidateInfo;
    forCandidate?: boolean;
}

function convertInterviewResultToString(interviewResult?: InterviewResult) {
    if (interviewResult === 0) return 'Отклонен';
    if (interviewResult === 1) return 'Подумать';
    if (interviewResult === 2) return 'Принят';
    return 'Нет';
}

const mapStatusToString: Record<CandidateStatus, string> = {
    [CandidateStatus.IN_PROGRESS]: 'В процессе',
    [CandidateStatus.CHECKED]: 'Проверен',
    [CandidateStatus.UNCHECKED]: 'Не проверен',
};

export const CandidatesListItem = memo((props: CandidatesListItemProps) => {
    const { className, candidate, forCandidate = false } = props;

    const resolvedTasks = useMemo(
        () => `Решено ${candidate.doneTasksCount}/${candidate.tasksCount} задач`,
        [candidate.doneTasksCount, candidate.tasksCount],
    );

    const fullName = useMemo(
        () => `${candidate.surname} ${candidate.firstName}`,
        [candidate.firstName, candidate.surname],
    );

    const verificationStatus = useMemo(() => {
        if (candidate.hasReviewerCheckResult && candidate.hasHrCheckResult) {
            return CandidateStatus.CHECKED;
        }
        if (candidate.hasReviewerCheckResult || candidate.hasHrCheckResult) {
            return CandidateStatus.IN_PROGRESS;
        } else {
            return CandidateStatus.UNCHECKED;
        }
    }, [candidate.hasHrCheckResult, candidate.hasReviewerCheckResult]);

    const address = useMemo(
        () =>
            forCandidate
                ? candidate.isSubmittedByCandidate || candidate.isSolutionTimeExpired
                    ? `/interview_details/${candidate.interviewSolutionId}`
                    : `/start`
                : `/interview_info/${candidate.interviewSolutionId}`,
        [
            candidate.interviewSolutionId,
            candidate.isSolutionTimeExpired,
            candidate.isSubmittedByCandidate,
            forCandidate,
        ],
    );

    return (
        <AppLink
            theme={'clear'}
            to={address}
        >
            <Tab className={classNames(cls.CandidatesListItem, {}, [className])}>
                <VStack
                    gap={'8'}
                    justify={'between'}
                    className={cls.container}
                >
                    <VStack>
                        <Text
                            variant={'accent'}
                            text={fullName}
                            weight={'semibold'}
                            size={'lg'}
                        />
                        <Text
                            variant={'accent'}
                            text={candidate.vacancy}
                        />
                    </VStack>
                    <VStack gap={'4'}>
                        <HStack gap={'8'}>
                            <Text
                                variant={'primary'}
                                text={'Оценка:'}
                            />
                            <Text
                                variant={'accent'}
                                text={`${candidate.averageGrade || 'Нет'}`}
                            />
                        </HStack>
                        <HStack gap={'8'}>
                            <Text
                                variant={'primary'}
                                text={'Результат:'}
                            />
                            <Text
                                variant={'accent'}
                                text={convertInterviewResultToString(
                                    candidate.interviewResult as InterviewResult,
                                )}
                            />
                        </HStack>
                    </VStack>
                    <HStack
                        max
                        justify={'between'}
                    >
                        <div
                            className={classNames(cls.status, {
                                [cls[verificationStatus]]: Boolean(verificationStatus),
                            })}
                        >
                            {mapStatusToString[verificationStatus]}
                        </div>
                        <Text
                            variant={'accent'}
                            text={resolvedTasks}
                        />
                    </HStack>
                </VStack>
            </Tab>
        </AppLink>
    );
});
