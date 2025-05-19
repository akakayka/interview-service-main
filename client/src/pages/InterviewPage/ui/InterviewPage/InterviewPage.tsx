import { classNames, Mods } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './InterviewPage.module.scss';
import { Page } from 'widgets/Page';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import {
    interviewPageActions,
    interviewPageReducer,
} from '../../model/slice/interviewPageSlice.ts';
import { fetchInterviewData } from '../../model/services/fetchInterviewData/fetchInterviewData.ts';
import { fetchTasksData } from '../../model/services/fetchTasksData/fetchTasksData.ts';
import { useSelector } from 'react-redux';
import {
    clearCodes,
    clearSaves,
    getInterviewCodeEditorCurrentTask,
    getInterviewCodeEditorCurrentTaskCode,
    getInterviewCodeEditorExecutionResult,
    getInterviewCodeEditorTestsResult,
    InterviewCodeEditor,
} from 'widgets/InterviewCodeEditor';
import {
    getInterviewPageError,
    getInterviewPageInfo,
    getInterviewPageIsLoading,
    getInterviewPageLoading,
} from '../../model/selectors/interviewPageSelectors.ts';
import { endInterview } from '../../model/services/endInterview/endInterview.ts';
import { endTaskSolution } from '../../model/services/endTaskSolution/endTaskSolution.ts';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import { HStack } from 'shared/ui/Stack';
import { Button } from 'shared/ui/Button/Button.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { TaskDescription } from 'widgets/TaskDescription';
import { PageLoader } from 'widgets/PageLoader';
import { useSignalR } from 'shared/lib/hooks/useSignalR/useSignalR.ts';
import { toast } from 'react-toastify';
import { Message, uuidv4 } from 'shared/lib/hooks/useSignalR/types.ts';
import { Chat, chatReducer } from 'widgets/Chat';
import { getUserSession } from 'entities/User';
import { useInterviewSaves } from '../../model/lib/hooks/useInterviewSaves.ts';

interface InterviewPageProps {
    className?: string;
}

const reducers: ReducersList = {
    interviewPage: interviewPageReducer,
    chat: chatReducer,
};

const InterviewPage = memo((props: InterviewPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const [collapsed, setCollapsed] = useState(false);
    const [expired, setExpired] = useState(false);
    const navigate = useNavigate();
    const isLoading = useSelector(getInterviewPageIsLoading) ?? true;
    const pageLoading = useSelector(getInterviewPageLoading);
    const error = useSelector(getInterviewPageError);
    const { interviewId } = useParams<{ interviewId: string }>();
    const { fullName } = useSelector(getUserSession);

    useInitialEffect(async () => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(true));
        await dispatch(fetchInterviewData());
        await dispatch(fetchTasksData());
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        window.onbeforeunload = function () {
            return 'Есть несохранённые данные. Вы точно хотите покинуть страницу?';
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    const currentTask = useSelector(getInterviewCodeEditorCurrentTask);
    const interview = useSelector(getInterviewPageInfo);
    const currentTaskCode = useSelector(getInterviewCodeEditorCurrentTaskCode);
    const result = useSelector(getInterviewCodeEditorExecutionResult);
    const tests = useSelector(getInterviewCodeEditorTestsResult);

    useEffect(() => {
        const date = new Date().getTime();
        if (
            interview &&
            (interview?.isSubmittedByCandidate || (interview?.endTimeMs ?? 0) < date)
        ) {
            navigate(RoutePath.after_interview);
        }
    }, [interview, interview?.endTimeMs, interview?.isSubmittedByCandidate, navigate]);

    const { sendDataToOther, messages, data } = useSignalR({
        interviewId: interview?.id ?? interviewId!,
        username: 'candidate',
    });

    useEffect(() => {
        if (data.newPeer) {
            sendDataToOther(
                JSON.stringify({
                    consoleUpdate: result,
                    testsUpdate: tests,
                    codeUpdate: currentTaskCode,
                    taskIdUpdate: currentTask?.id,
                }),
            );
        }
    }, [currentTask?.id, currentTaskCode, data.newPeer, result, sendDataToOther, tests]);

    const { saveExecutionResult, saveTaskUpdate, saveTestsResult, saveCodeUpdate } =
        useInterviewSaves(sendDataToOther);

    const onEndInterview = useCallback(async () => {
        if (confirm('Вы действительно хотите завершить интервью?')) {
            const result = await dispatch(endInterview());
            clearCodes();
            clearSaves();
            if (result.meta.requestStatus === 'fulfilled') {
                toast.success('Интервью завершено');
                navigate(RoutePath.after_interview);
            }
        }
    }, [dispatch, navigate]);

    const onEndTaskSolution = useCallback(() => {
        if (currentTask) {
            toast.promise(dispatch(endTaskSolution(currentTask.id)), {
                pending: 'Отправляется',
                success: 'Отправлено',
                error: 'Произошла ошибка',
            });
            dispatch(interviewPageActions.setTaskDone(currentTask));
        }
    }, [currentTask, dispatch]);

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

    useEffect(() => {
        if (!interview) return;
        const timer = setInterval(() => {
            const date = new Date().getTime();
            if (date - (interview.endTimeMs ?? 0) > -2000) {
                toast.promise(dispatch(endInterview()), {
                    pending: 'Завершается',
                    success: 'Интервью завершено',
                    error: 'Произошла ошибка',
                });
                setExpired(true);
                clearInterval(timer);
            }
        }, 1000);
    }, [dispatch, interview]);

    const content = useMemo(
        () => (
            <>
                <HStack
                    max
                    className={cls.header}
                    gap={'16'}
                >
                    <Text
                        size={'display_md'}
                        weight={'semibold'}
                        text={`Тестовое задание на вакансию ${interview?.vacancy}`}
                    />
                    <Button
                        disabled={isLoading || expired}
                        variant={'green'}
                        onClick={onEndInterview}
                    >
                        <Text
                            variant={'white'}
                            text={'Завершить интервью'}
                            weight={'medium'}
                        />
                    </Button>
                </HStack>
                <TaskDescription
                    task={currentTask}
                    collapsed={collapsed}
                    className={cls.description}
                    endTaskSolution={onEndTaskSolution}
                    endTimeMs={interview?.endTimeMs}
                    toggleCollapsed={() => {
                        setCollapsed((prev) => !prev);
                    }}
                    expired={expired}
                    taskIsDone={currentTask?.isDone}
                />
                <div className={cls.editorContainer}>
                    <InterviewCodeEditor
                        className={cls.editor}
                        loading={isLoading}
                        saveExecutionResult={saveExecutionResult}
                        saveTestsResult={saveTestsResult}
                        saveCodeUpdate={saveCodeUpdate}
                        saveTaskUpdate={saveTaskUpdate}
                        expired={expired}
                    />
                </div>
            </>
        ),
        [
            collapsed,
            currentTask,
            expired,
            interview?.endTimeMs,
            interview?.vacancy,
            isLoading,
            onEndInterview,
            onEndTaskSolution,
            saveCodeUpdate,
            saveExecutionResult,
            saveTaskUpdate,
            saveTestsResult,
        ],
    );

    return (
        <DynamicModuleLoader
            reducers={reducers}
            removeAfterUnmount={false}
        >
            <Page className={classNames(cls.InterviewPage, mods, [className])}>
                {interview?.isSynchronous && (
                    <Chat
                        messages={messages}
                        sendMessage={onSendMessage}
                    />
                )}
                {pageLoading ? <PageLoader /> : content}
            </Page>
        </DynamicModuleLoader>
    );
});

export default InterviewPage;
