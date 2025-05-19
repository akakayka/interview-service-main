import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useEffect } from 'react';
import cls from './InterviewsPage.module.scss';
import { Page } from 'widgets/Page';
import { CandidatesList } from 'widgets/CandidatesList';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { useSelector } from 'react-redux';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { interviewsPageReducer } from '../../model/slice/interviewsPageSlice.ts';
import { fetchCandidateList } from '../../model/services/fetchCandidateList/fetchCandidateList.ts';
import {
    getInterviewsPageCandidates,
    getInterviewsPageError,
} from '../../model/selectors/interviewsPageSelectors.ts';
import { toast } from 'react-toastify';

interface CandidatesPageProps {
    className?: string;
}

const reducers: ReducersList = {
    interviewsPage: interviewsPageReducer,
};

const InterviewsPage = memo((props: CandidatesPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const error = useSelector(getInterviewsPageError);

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchCandidateList());
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const candidates = useSelector(getInterviewsPageCandidates);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                title="Интервью"
                className={classNames(cls.CandidatesPage, {}, [className])}
            >
                <div className={cls.content}>
                    <CandidatesList
                        items={candidates ?? []}
                        enableSearch
                    />
                </div>
            </Page>
        </DynamicModuleLoader>
    );
});

export default InterviewsPage;
