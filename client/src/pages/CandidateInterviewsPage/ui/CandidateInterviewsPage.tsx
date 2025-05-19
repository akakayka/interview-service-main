import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useEffect } from 'react';
import cls from './CandidateInterviewsPage.module.scss';
import { Page } from 'widgets/Page';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { fetchCandidateCards } from '../model/services/fetchCandidateCards/fetchCandidateCards.ts';
import { useSelector } from 'react-redux';
import {
    getCandidateInterviewsCards,
    getCandidateInterviewsError,
    getCandidateInterviewsMeets,
} from '../model/selectors/candidateInterviewsSelectors.ts';
import { CandidatesList } from 'widgets/CandidatesList';
import { MeetingsList } from 'widgets/MeetingsList';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { candidateInterviewsPageReducer } from '../model/slice/candidateInterviewsSlice.ts';
import { fetchCandidateMeets } from '../model/services/fetchCandidateMeets/fetchCandidateMeets.ts';
import { HStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { toast } from 'react-toastify';

interface CandidateInterviewsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    candidateInterviewsPage: candidateInterviewsPageReducer,
};

const CandidateInterviewsPage = memo((props: CandidateInterviewsPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const error = useSelector(getCandidateInterviewsError);

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchCandidateCards());
        dispatch(fetchCandidateMeets());
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const cards = useSelector(getCandidateInterviewsCards);
    const meets = useSelector(getCandidateInterviewsMeets);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                className={classNames(cls.CandidateInterviewsPage, {}, [className])}
                title={'Интервью'}
            >
                <HStack className={cls.wrapperMeetings}>
                    <MeetingsList
                        items={meets ?? []}
                        className={cls.meetings}
                        header={
                            <Text
                                text={'Приглашения на интервью'}
                                size={'display_xs'}
                                weight={'bold'}
                            />
                        }
                        forCandidate
                    />
                </HStack>
                <HStack className={cls.wrapperCandidates}>
                    <CandidatesList
                        items={cards ?? []}
                        className={cls.candidates}
                        forCandidate
                        header={
                            <Text
                                text={'Пройденные интервью'}
                                size={'display_xs'}
                                weight={'bold'}
                            />
                        }
                    />
                </HStack>
            </Page>
        </DynamicModuleLoader>
    );
});

export default CandidateInterviewsPage;
