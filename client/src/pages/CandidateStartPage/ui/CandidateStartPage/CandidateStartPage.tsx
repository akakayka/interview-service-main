import { classNames } from 'shared/lib/classNames/classNames.ts';
import { memo } from 'react';
import cls from './CandidateStartPage.module.scss';
import { Page } from 'widgets/Page';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { candidateStartPageReducer } from '../../model/slice/candidateStartPageSlice.ts';
import { StartPageCard } from '../StartPageCard/StartPageCard.tsx';
import { useSelector } from 'react-redux';
import { getCandidateStartPageLoading } from '../../model/selectors/candidateStartPageSelectors.ts';
import { fetchInterviewSolutionInfo } from '../../model/services/fetchInterviewSolutionInfo/fetchInterviewSolutionInfo.ts';
import { PageLoader } from 'widgets/PageLoader';

interface StartPageProps {
    className?: string;
}

const reducers: ReducersList = {
    candidateStartPage: candidateStartPageReducer,
};

const CandidateStartPage = memo((props: StartPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchInterviewSolutionInfo());
    });
    const pageLoading = useSelector(getCandidateStartPageLoading);

    return (
        <DynamicModuleLoader
            reducers={reducers}
            removeAfterUnmount
        >
            <Page
                className={classNames(cls.StartPage, {}, [className])}
                justify={'center'}
                align={'center'}
            >
                {pageLoading ? <PageLoader /> : <StartPageCard />}
            </Page>
        </DynamicModuleLoader>
    );
});

export default CandidateStartPage;
