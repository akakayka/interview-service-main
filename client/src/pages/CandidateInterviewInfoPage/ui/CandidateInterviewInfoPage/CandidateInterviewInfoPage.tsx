import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useEffect } from 'react';
import cls from './CandidateInterviewInfoPage.module.scss';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useSelector } from 'react-redux';
import { sidebarActions } from 'widgets/Sidebar';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import {
    getCandidateInterviewInfoPageError,
    getCandidateInterviewInfoPageInterviewInfo,
} from '../../model/selectors/candidateInterviewInfoPageSelectors.ts';
import { Text } from 'shared/ui/Text/Text.tsx';
import { useParams } from 'react-router-dom';
import { fetchCandidateInterviewInfo } from '../../model/services/fetchCandidateInterviewInfo/fetchCandidateInterviewInfo.ts';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { candidateInterviewInfoPageReducer } from '../../model/slice/candidateInterviewInfoPageSlice.ts';
import { Page } from 'widgets/Page';
import { CandidateInfoCard, Grade } from 'features/CandidateInfoCard';
import { HStack, VStack } from 'shared/ui/Stack';
import { convertTimeMsToString } from 'shared/lib/time/convertTimeMsToString.ts';
import { TextArea } from 'shared/ui/TextArea/TextArea.tsx';
import { getUserRole } from 'entities/User';
import { InterviewResult } from 'pages/InterviewInfoPage';
import { toast } from 'react-toastify';

interface CandidateInterviewInfoProps {
    className?: string;
}

const reducers: ReducersList = {
    candidateInterviewInfoPage: candidateInterviewInfoPageReducer,
};

const CandidateInterviewInfoPage = memo((props: CandidateInterviewInfoProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const error = useSelector(getCandidateInterviewInfoPageError);
    const role = useSelector(getUserRole);

    const { interviewSolutionId } = useParams<{ interviewSolutionId: string }>();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchCandidateInterviewInfo(interviewSolutionId));
    });

    const interviewInfo = useSelector(getCandidateInterviewInfoPageInterviewInfo);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                className={classNames(cls.InterviewInfoPage, {}, [className])}
                title={`Интервью/${interviewInfo?.vacancy}`}
                withBackButton
            >
                <CandidateInfoCard
                    className={cls.candidateInfo}
                    email={interviewInfo?.email}
                    name={interviewInfo?.fullName}
                    phone={interviewInfo?.phoneNumber}
                    grade={(interviewInfo?.averageGrade as Grade) ?? (1 as Grade)}
                    role={role}
                    onResult={() => {}}
                    onGrade={() => {}}
                    result={
                        (interviewInfo?.interviewResult as InterviewResult) ??
                        (0 as InterviewResult)
                    }
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
                                size={'lg'}
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
                                    size={'lg'}
                                    weight={'semibold'}
                                    text={'Дата начала'}
                                />
                                <Text
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
                                    size={'lg'}
                                    weight={'semibold'}
                                    text={'Дата окончания'}
                                />
                                <Text
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
                                value={interviewInfo?.reviewerComment ?? ''}
                                placeholder={'Комментария пока нет.'}
                            />
                        </VStack>
                    </VStack>
                </HStack>
            </Page>
        </DynamicModuleLoader>
    );
});

export default CandidateInterviewInfoPage;
