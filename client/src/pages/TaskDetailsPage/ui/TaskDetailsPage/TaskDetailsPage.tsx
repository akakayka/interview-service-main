import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect } from 'react';
import cls from './TaskDetailsPage.module.scss';
import { Page } from 'widgets/Page';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { fetchTaskDetails } from '../../model/services/fetchTaskDetails/fetchTaskDetails.ts';
import {
    getTaskDetailsPageError,
    getTaskDetailsPageTaskDetails,
} from '../../model/selectors/taskDetailsPageSelectors.ts';
import { useSelector } from 'react-redux';
import { HStack, VStack } from 'shared/ui/Stack';
import { CodeMirrorEditor } from 'entities/CodeMirrorEditor';
import { mapLanguageToString } from 'pages/CreateTaskPage';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { convertProgrammingLanguageToString } from 'shared/lib/programmingLanguages/programmingLanguages.ts';
import { deleteTask } from '../../model/services/deleteTask/deleteTask.ts';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { toast } from 'react-toastify';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { taskDetailsPageReducer } from '../../model/slice/taskDetailsPageSlice.ts';

interface TaskDetailsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    taskDetailsPage: taskDetailsPageReducer,
};

const TaskDetailsPage = memo((props: TaskDetailsPageProps) => {
    const { className } = props;
    const { taskId } = useParams<{ taskId: string }>();

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const error = useSelector(getTaskDetailsPageError);

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchTaskDetails(taskId));
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const task = useSelector(getTaskDetailsPageTaskDetails);

    const deleteHandler = useCallback(() => {
        if (confirm('Вы уверены, что хотите удалить задачу?')) {
            dispatch(deleteTask(taskId)).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toast.success('Задача удалена');
                    navigate(RoutePath.tasks);
                } else {
                    toast.error('Произошла ошибка');
                }
            });
        }
    }, [dispatch, navigate, taskId]);

    const navigateToEditPage = useCallback(() => {
        navigate(RoutePath.task_edit + taskId);
    }, [navigate, taskId]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                className={classNames(cls.TaskDetailsPage, {}, [className])}
                title={'Задача'}
                withBackButton
            >
                <VStack
                    className={cls.info}
                    gap={'16'}
                    max
                    justify={'start'}
                >
                    <HStack
                        max
                        justify={'between'}
                        align={'start'}
                    >
                        <HStack
                            gap={'32'}
                            max
                            align={'start'}
                        >
                            <VStack gap={'16'}>
                                <VStack
                                    gap={'8'}
                                    max
                                >
                                    <Text
                                        size={'lg'}
                                        text={'Название задачи'}
                                        weight={'semibold'}
                                    />
                                    <Text text={task?.name ?? 'Миша считает окурки'} />
                                </VStack>
                                <VStack
                                    gap={'8'}
                                    max
                                >
                                    <Text
                                        size={'lg'}
                                        text={'Язык программирования'}
                                        weight={'semibold'}
                                    />
                                    <Text
                                        text={convertProgrammingLanguageToString(
                                            task?.programmingLanguage ??
                                                ProgrammingLanguage.unknown,
                                        )}
                                    />
                                </VStack>
                            </VStack>
                            <VStack
                                gap={'16'}
                                align={'start'}
                                className={cls.descriptionContainer}
                            >
                                <Text
                                    size={'lg'}
                                    text={'Описание задачи'}
                                    weight={'semibold'}
                                />
                                <Text text={task?.taskText} />
                            </VStack>
                        </HStack>
                        <HStack
                            max
                            justify={'end'}
                        >
                            <VStack
                                gap={'16'}
                                justify={'center'}
                                align={'center'}
                            >
                                {task?.isDeleted ? (
                                    <Text
                                        variant={'error'}
                                        text={'Задача удалена'}
                                        weight={'semibold'}
                                    />
                                ) : (
                                    <>
                                        <Button
                                            variant={'primary'}
                                            onClick={navigateToEditPage}
                                        >
                                            <Text
                                                variant={'white'}
                                                text={'Редактировать'}
                                                weight={'medium'}
                                            />
                                        </Button>
                                        <Button
                                            variant={'clear'}
                                            onClick={deleteHandler}
                                        >
                                            <Text
                                                variant={'error'}
                                                text={'Удалить задачу'}
                                            />
                                        </Button>
                                    </>
                                )}
                            </VStack>
                        </HStack>
                    </HStack>
                </VStack>
                <div className={cls.codeEditor}>
                    <CodeMirrorEditor
                        readonly
                        label={'Стартовый код'}
                        value={task?.startCode}
                        language={
                            mapLanguageToString[
                                (task?.programmingLanguage as ProgrammingLanguage) ??
                                    ProgrammingLanguage.unknown
                            ]
                        }
                    />
                </div>
                <div className={cls.testsEditor}>
                    <CodeMirrorEditor
                        readonly
                        label={'Код для тестов'}
                        value={task?.testsCode}
                        language={
                            mapLanguageToString[
                                (task?.programmingLanguage as ProgrammingLanguage) ??
                                    ProgrammingLanguage.unknown
                            ]
                        }
                    />
                </div>
            </Page>
        </DynamicModuleLoader>
    );
});

export default TaskDetailsPage;
