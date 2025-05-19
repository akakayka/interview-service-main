import { classNames, Mods } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect, useState } from 'react';
import cls from './SyncReviewPage.module.scss';
import { Page } from 'widgets/Page';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { useSelector } from 'react-redux';
import { VStack } from 'shared/ui/Stack';
import { useParams } from 'react-router-dom';
import { ReviewCodeEditor } from 'widgets/ReviewCodeEditor';
import { useSignalR } from 'shared/lib/hooks/useSignalR/useSignalR.ts';
import { ReviewTaskDescription } from 'widgets/ReviewTaskDescription';
import { reviewNotesReducer } from 'widgets/ReviewNotes';
import { reviewPageActions, reviewPageReducer } from '../../model/slice/reviewPageSlice.ts';
import {
    getSyncReviewPageCurrentTask,
    getSyncReviewPageCurrentTaskFromUser,
    getSyncReviewPageError,
    getSyncReviewPageSolutionInfo,
} from '../../model/selectors/reviewPageSelectors.ts';
import { fetchReviewData } from '../../model/services/fetchReviewData/fetchReviewData.ts';
import { fetchTaskSolutionsInfo } from '../../model/services/fetchTaskSolutionsInfo/fetchTaskSolutionsInfo.ts';
import { CandidateInfoCard } from 'features/CandidateInfoCard';
import { useSyncReviewLogic } from '../../model/lib/hooks/useSyncReviewLogic.ts';
import { toast } from 'react-toastify';
import { Text } from 'shared/ui/Text/Text.tsx';
import { AppLink } from 'shared/ui/AppLink/AppLink.tsx';
import { Message, uuidv4 } from 'shared/lib/hooks/useSignalR/types.ts';
import { Chat, chatReducer } from 'widgets/Chat';
import { getUserSession } from 'entities/User';

interface ReviewPageProps {
    className?: string;
}

const reducers: ReducersList = {
    syncReviewPage: reviewPageReducer,
    reviewNotes: reviewNotesReducer,
    chat: chatReducer,
};

const SyncReviewPage = memo((props: ReviewPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const { interviewId } = useParams<{ interviewId: string }>();
    const interview = useSelector(getSyncReviewPageSolutionInfo);
    const [collapsed, setCollapsed] = useState(false);
    const { fullName } = useSelector(getUserSession);
    const error = useSelector(getSyncReviewPageError);

    useInitialEffect(async () => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(true));
        await dispatch(fetchReviewData(interviewId));
        await dispatch(fetchTaskSolutionsInfo(interviewId!));
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        const now = new Date().getTime();
        if (interview?.endTimeMs && interview?.endTimeMs < now) {
            toast.warn(
                <VStack>
                    <Text
                        variant={'dark_red'}
                        text={'Интервью окончено'}
                    />
                    <AppLink to={`/review/async/${interview.interviewSolutionId}/task`}>
                        <Text
                            text={'Перейти к проверке'}
                            size={'sm'}
                        />
                    </AppLink>
                </VStack>,
                { autoClose: false, closeOnClick: true },
            );
        }
    }, [interview?.endTimeMs, interview?.interviewSolutionId]);

    const currentTask = useSelector(getSyncReviewPageCurrentTask);
    const currentTaskFromUser = useSelector(getSyncReviewPageCurrentTaskFromUser);

    const { data, messages, sendDataToOther } = useSignalR({
        username: 'reviewer',
        interviewId: interview?.interviewSolutionId ?? interviewId!,
    });

    useEffect(() => {
        if (!data) return;
        if (data.data.codeUpdate) {
            dispatch(reviewPageActions.setCurrentTaskCode(data.data.codeUpdate));
        }
        if (data.data.taskIdUpdate) {
            dispatch(reviewPageActions.setCurrentTaskId(data.data.taskIdUpdate));
        }
        if (data.data.testsUpdate) {
            dispatch(reviewPageActions.setTestsResult(data.data.testsUpdate));
        }
        if (data.data.consoleUpdate) {
            dispatch(reviewPageActions.setExecutionResult(data.data.consoleUpdate));
        }
    }, [data, dispatch, messages]);

    const onSendMessage = useCallback(
        (mess?: string) => {
            sendDataToOther(
                JSON.stringify({
                    id: uuidv4(),
                    owner: fullName,
                    message: mess,
                    date: new Date().getTime(),
                } as Message),
            );
        },
        [fullName, sendDataToOther],
    );

    const mods: Mods = {
        [cls.collapsed]: collapsed,
    };

    const editorProps = useSyncReviewLogic();

    return (
        <DynamicModuleLoader
            reducers={reducers}
            removeAfterUnmount
        >
            <Page
                className={classNames(cls.SyncReviewPage, mods, [className])}
                title={`Тестовое задание на вакансию ${interview?.vacancy}`}
                withBackButton
            >
                <Chat
                    messages={messages}
                    sendMessage={onSendMessage}
                />
                <CandidateInfoCard
                    className={cls.candidateInfo}
                    phone={interview?.phoneNumber}
                    name={interview?.fullName}
                    email={interview?.email}
                    vertical
                />
                <ReviewTaskDescription
                    endTimeMs={interview?.endTimeMs}
                    task={currentTaskFromUser ?? currentTask}
                    collapsed={collapsed}
                    className={cls.description}
                    toggleCollapsed={() => {
                        setCollapsed((prev) => !prev);
                    }}
                    interviewSolutionId={interviewId}
                />
                <ReviewCodeEditor
                    className={cls.editor}
                    isSync={true}
                    {...editorProps}
                />
            </Page>
        </DynamicModuleLoader>
    );
});

export default SyncReviewPage;
