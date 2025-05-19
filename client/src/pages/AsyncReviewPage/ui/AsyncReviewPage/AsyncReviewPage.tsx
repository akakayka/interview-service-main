import { classNames, Mods } from 'shared/lib/classNames/classNames';
import { memo, useEffect, useState } from 'react';
import cls from './AsyncReviewPage.module.scss';
import { Page } from 'widgets/Page';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ReviewTaskDescription } from 'widgets/ReviewTaskDescription';
import { reviewNotesReducer } from 'widgets/ReviewNotes';
import {
    getAsyncReviewPageCurrentTask,
    getAsyncReviewPageError,
    getAsyncReviewPageSolutionInfo,
} from '../../model/selectors/asyncReviewPageSelectors.ts';
import { fetchReviewData } from '../../model/services/fetchReviewData/fetchReviewData.ts';
import { fetchTaskSolutionsInfo } from '../../model/services/fetchTaskSolutionsInfo/fetchTaskSolutionsInfo.ts';
import { fetchLastSolutionSavedCode } from '../../model/services/fetchLastSolutionSavedCode/fetchLastSolutionSavedCode.ts';
import { CandidateInfoCard } from 'features/CandidateInfoCard';
import { asyncReviewPageReducer } from '../../model/slice/asyncReviewPageSlice.ts';
import { AsyncReviewPageEditor } from '../AsyncReviewPageEditor/AsyncReviewPageEditor.tsx';
import { toast } from 'react-toastify';

interface AsyncReviewPageProps {
    className?: string;
}

const reducers: ReducersList = {
    asyncReviewPage: asyncReviewPageReducer,
    reviewNotes: reviewNotesReducer,
};

const AsyncReviewPage = memo((props: AsyncReviewPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const { interviewId } = useParams<{ interviewId: string }>();
    const interview = useSelector(getAsyncReviewPageSolutionInfo);
    const error = useSelector(getAsyncReviewPageError);
    const [collapsed, setCollapsed] = useState(false);
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useInitialEffect(async () => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(true));
        await dispatch(fetchReviewData(interviewId));
        await dispatch(fetchTaskSolutionsInfo(interviewId!));
    });

    const currentTask = useSelector(getAsyncReviewPageCurrentTask);

    useEffect(() => {
        dispatch(fetchLastSolutionSavedCode(currentTask?.id ?? ''));
    }, [currentTask, dispatch]);

    const mods: Mods = {
        [cls.collapsed]: collapsed,
    };

    return (
        <DynamicModuleLoader
            reducers={reducers}
            removeAfterUnmount
        >
            <Page
                className={classNames(cls.SyncReviewPage, mods, [className])}
                title={`Кандидаты/${interview?.fullName}`}
                withBackButton
                backButtonAction={() => {
                    console.log('work');
                    navigate(`/interview_info/${interview?.interviewSolutionId}`);
                }}
            >
                <CandidateInfoCard
                    className={cls.candidateInfo}
                    phone={interview?.phoneNumber}
                    name={interview?.fullName}
                    email={interview?.email}
                    vertical
                />
                <ReviewTaskDescription
                    task={currentTask}
                    collapsed={collapsed}
                    className={cls.description}
                    toggleCollapsed={() => {
                        setCollapsed((prev) => !prev);
                    }}
                    interviewSolutionId={interviewId}
                />
                <AsyncReviewPageEditor
                    className={cls.editor}
                    taskId={params.get('taskId') ?? ''}
                    setParams={setParams}
                />
            </Page>
        </DynamicModuleLoader>
    );
});

export default AsyncReviewPage;
