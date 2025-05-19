import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect, useState } from 'react';
import cls from './InterviewInfoPage.module.scss';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { Page } from 'widgets/Page';
import { useParams } from 'react-router-dom';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import {
    interviewInfoPageActions,
    interviewInfoPageReducer,
} from '../../model/slice/interviewInfoPageSlice.ts';
import { fetchInterviewInfo } from '../../model/services/fetchInterviewInfo/fetchInterviewInfo.ts';
import { useSelector } from 'react-redux';
import {
    getInterviewInfoPageComment,
    getInterviewInfoPageError,
    getInterviewInfoPageInterview,
    getInterviewInfoPageIsLoading,
} from '../../model/selectors/interviewInfoPageSelectors.ts';
import { HStack, VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { TextArea } from 'shared/ui/TextArea/TextArea.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { convertTimeMsToString } from 'shared/lib/time/convertTimeMsToString.ts';
import { TasksTable } from '../TasksTable/TasksTable.tsx';
import { sendComment } from '../../model/services/sendComment/sendComment.ts';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { CandidateInfoCard } from 'features/CandidateInfoCard';
import { Grade } from '/features/CandidateInfoCard';
import { toast } from 'react-toastify';
import { sendGrade } from '../../model/services/sendGrade/sendGrade.ts';
import { getUserRole } from 'entities/User';
import { sendInterviewResult } from '../../model/services/sendInterviewResult/sendInterviewResult.ts';

interface InterviewInfoPageProps {
    className?: string;
}

const reducers: ReducersList = {
    interviewInfoPage: interviewInfoPageReducer,
};

export type InterviewResult = 0 | 1 | 2;
export const mapInterviewResultToString: Record<InterviewResult, string> = {
    0: 'Отклонен',
    1: 'Подумать',
    2: 'Принят',
};

const InterviewInfoPage = memo((props: InterviewInfoPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const isLoading = useSelector(getInterviewInfoPageIsLoading);
    const comment = useSelector(getInterviewInfoPageComment);
    const error = useSelector(getInterviewInfoPageError);
    const role = useSelector(getUserRole);
    const { inputValid } = useValidation(comment ?? '', { isEmpty: true });
    const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>(undefined);
    const [interviewResult, setInterviewResult] = useState<InterviewResult | undefined>(undefined);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onChangeComment = useCallback(
        (value: string) => {
            dispatch(interviewInfoPageActions.setComment(value));
        },
        [dispatch],
    );

    const { interviewSolutionId } = useParams<{ interviewSolutionId: string }>();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchInterviewInfo(interviewSolutionId));
    });

    const saveComment = useCallback(() => {
        toast.promise(dispatch(sendComment(interviewSolutionId)), {
            pending: 'Комментарий отправляется...',
            success: 'Комментарий отправлен',
            error: 'Произошла ошибка, попробуйте еще раз',
        });
    }, [dispatch, interviewSolutionId]);

    const interviewInfo = useSelector(getInterviewInfoPageInterview);

    useEffect(() => {
        if (interviewInfo?.averageGrade) {
            setSelectedGrade(interviewInfo.averageGrade as Grade);
        }
        if (interviewInfo?.interviewResult) {
            setInterviewResult(interviewInfo.interviewResult as InterviewResult);
        }
    }, [interviewInfo?.averageGrade, interviewInfo?.interviewResult]);

    const onGrade = useCallback(
        (grade: Grade) => {
            setSelectedGrade(grade);
            toast.promise(dispatch(sendGrade({ interviewSolutionId, grade })), {
                pending: 'Оценка отправляется',
                success: `Кандидат ${interviewInfo?.fullName} оценен на ${grade}/5`,
                error: 'Произошла ошибка',
            });
        },
        [dispatch, interviewInfo?.fullName, interviewSolutionId],
    );

    const onSetInterviewResult = useCallback(
        (result: InterviewResult) => {
            setInterviewResult(result);
            toast.promise(dispatch(sendInterviewResult({ interviewSolutionId, result })), {
                pending: 'Решение отправляется',
                success: `Решение принято`,
                error: 'Произошла ошибка',
            });
        },
        [dispatch, interviewSolutionId],
    );

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                withBackButton
                className={classNames(cls.InterviewInfoPage, {}, [className])}
                title={`Интервью/${interviewInfo?.fullName}`}
            >
                <CandidateInfoCard
                    className={cls.candidateInfo}
                    email={interviewInfo?.email}
                    name={interviewInfo?.fullName}
                    phone={interviewInfo?.phoneNumber}
                    onGrade={onGrade}
                    grade={selectedGrade}
                    role={role}
                    result={interviewResult}
                    onResult={onSetInterviewResult}
                />
                <HStack
                    max
                    className={classNames(cls.card, {}, [cls.interviewInfo])}
                >
                    <VStack
                        className={cls.info}
                        gap={'16'}
                    >
                        <VStack
                            max
                            gap={'4'}
                            className={cls.title}
                        >
                            <Text
                                size={'md'}
                                weight={'regular'}
                                text={'Вакансия'}
                            />
                            <Text
                                size={'display_sm'}
                                weight={'semibold'}
                                text={interviewInfo?.vacancy}
                            />
                        </VStack>
                        <VStack
                            max
                            gap={'16'}
                            className={cls.dates}
                        >
                            <VStack
                                gap={'4'}
                                max
                            >
                                <Text
                                    size={'md'}
                                    weight={'semibold'}
                                    text={'Дата начала'}
                                />
                                <Text
                                    size={'sm'}
                                    weight={'regular'}
                                    className={cls.date}
                                    text={convertTimeMsToString(interviewInfo?.startTimeMs ?? 0)}
                                />
                            </VStack>
                            <VStack
                                gap={'4'}
                                max
                            >
                                <Text
                                    size={'md'}
                                    weight={'semibold'}
                                    text={'Дата окончания'}
                                />
                                <Text
                                    size={'sm'}
                                    weight={'regular'}
                                    className={cls.date}
                                    text={convertTimeMsToString(interviewInfo?.endTimeMs ?? 0)}
                                />
                            </VStack>
                        </VStack>
                        <VStack
                            max
                            gap={'16'}
                            className={cls.comments}
                        >
                            <Text
                                size={'lg'}
                                weight={'semibold'}
                                text={'Комментарий'}
                            />
                            <TextArea
                                value={comment ?? ''}
                                onChange={onChangeComment}
                                placeholder={'Комментарий...'}
                            />
                            <Button
                                disabled={isLoading || !inputValid}
                                onClick={saveComment}
                            >
                                <Text
                                    variant={'white'}
                                    weight={'medium'}
                                    text={'Отправить'}
                                />
                            </Button>
                        </VStack>
                    </VStack>
                    <VStack
                        className={cls.tasks}
                        max
                    >
                        <HStack
                            max
                            className={cls.tasksTitle}
                        >
                            <Text
                                text={'Задачи'}
                                size={'lg'}
                                weight={'semibold'}
                            />
                        </HStack>
                        <TasksTable
                            tasks={interviewInfo?.taskSolutionsInfos}
                            interviewSolutionId={interviewInfo?.interviewSolutionId}
                        />
                    </VStack>
                </HStack>
            </Page>
        </DynamicModuleLoader>
    );
});

export default InterviewInfoPage;
