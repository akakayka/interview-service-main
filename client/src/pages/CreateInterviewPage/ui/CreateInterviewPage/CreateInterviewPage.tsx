import { classNames } from 'shared/lib/classNames/classNames';
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './CreateInterviewPage.module.scss';
import { Page } from 'widgets/Page';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { Input } from 'shared/ui/Input/Input.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { convertTimeToMs } from 'shared/lib/time/convertTimeToMs.ts';
import { TextArea } from 'shared/ui/TextArea/TextArea.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TasksListItem } from 'features/TasksListItem';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { HStack, VStack } from 'shared/ui/Stack';
import {
    createInterviewPageActions,
    createInterviewPageReducer,
} from '../../model/slice/createInterviewSlice.ts';
import { fetchTasks } from '../../model/services/fetchTasks/fetchTasks.ts';
import {
    getCreateInterviewPageError,
    getCreateInterviewPageFormInterviewText,
    getCreateInterviewPageFormTaskIds,
    getCreateInterviewPageFormVacancy,
    getCreateInterviewPageIsLoading,
    getCreateInterviewPageTasks,
} from '../../model/selectors/createInterviewPageSelectors.ts';
import { createInterview } from '../../model/services/createInterview/createInterview.ts';
import { Search } from 'features/Search';
import { TaskInfo } from 'entities/Task';
import { toast } from 'react-toastify';

interface CreateInterviewPageProps {
    className?: string;
}

const reducers: ReducersList = {
    createInterviewPage: createInterviewPageReducer,
};

const CreateInterviewPage = memo((props: CreateInterviewPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const [time, setTime] = useState('');
    const navigate = useNavigate();

    useInitialEffect(() => {
        setTime('01:00');
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchTasks());
    });

    const interviewText = useSelector(getCreateInterviewPageFormInterviewText);
    const vacancy = useSelector(getCreateInterviewPageFormVacancy);
    const tasks = useSelector(getCreateInterviewPageTasks);
    const taskIds = useSelector(getCreateInterviewPageFormTaskIds);
    const error = useSelector(getCreateInterviewPageError);
    const isLoading = useSelector(getCreateInterviewPageIsLoading);
    const [query, setQuery] = useState<string>('');
    const [filteredItems, setFilteredItems] = useState<TaskInfo[]>(tasks ?? []);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (tasks) setFilteredItems(tasks);
    }, [tasks]);

    const onChangeQuery = useCallback(
        (value: string) => {
            if (!tasks) return;
            if (!value) {
                setQuery(value);
                setFilteredItems(tasks);
                return;
            }
            setQuery(value);
            const newItems = tasks.filter((item) => {
                return item.name.toLowerCase().includes(value.toLowerCase());
            });
            setFilteredItems(newItems);
        },
        [tasks],
    );
    const { isEmptyError: isEmptyVacancyError } = useValidation(vacancy, {
        isEmpty: true,
    });
    const { isEmptyError: isEmptyInterviewError } = useValidation(interviewText, {
        isEmpty: true,
    });
    const [isInterviewTextDirty, setIsInterviewTextDirty] = useState(false);

    const onChangeTask = useCallback(
        (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                dispatch(createInterviewPageActions.pushTaskId(id));
            } else {
                dispatch(createInterviewPageActions.removeTaskId(id));
            }
        },
        [dispatch],
    );

    const tasksList = useMemo(
        () =>
            filteredItems?.map((task) => (
                <div
                    className={cls.task}
                    key={task.id}
                >
                    <input
                        type={'checkbox'}
                        checked={taskIds?.includes(task.id)}
                        onChange={onChangeTask(task.id)}
                    />
                    <TasksListItem task={task} />
                </div>
            )),
        [filteredItems, onChangeTask, taskIds],
    );

    const onChangeTime = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const timeString = e.target.value;
            setTime(timeString);
            const timeMs = convertTimeToMs(timeString);
            dispatch(createInterviewPageActions.setTime(timeMs));
        },
        [dispatch],
    );

    const onChangeText = useCallback(
        (value: string) => {
            dispatch(createInterviewPageActions.setInterviewText(value));
        },
        [dispatch],
    );

    const onChangeVacancy = useCallback(
        (value: string) => {
            dispatch(createInterviewPageActions.setVacancy(value));
        },
        [dispatch],
    );

    const onCreate = useCallback(async () => {
        const result = await dispatch(createInterview());
        if (result.meta.requestStatus === 'fulfilled') {
            window.history.back();
        }
    }, [dispatch, navigate]);

    const validationSuccess = useMemo(
        () => taskIds?.length && !isEmptyInterviewError && !isEmptyVacancyError,
        [isEmptyInterviewError, isEmptyVacancyError, taskIds?.length],
    );

    const onBlurHandler = useCallback(() => {
        setIsInterviewTextDirty(true);
    }, []);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                withBackButton
                title={'Создать вакансию'}
                className={classNames(cls.CreateInterviewPage, {}, [className])}
            >
                <div className={cls.form}>
                    <div className={cls.inputs}>
                        <Input
                            label={'Название вакансии'}
                            placeholder={'Javascript разработчик'}
                            value={vacancy}
                            onChange={onChangeVacancy}
                            error={{
                                isEmpty: isEmptyVacancyError
                                    ? 'Поле не должно быть пустым.'
                                    : undefined,
                            }}
                        />
                        <Text
                            size={'lg'}
                            weight={'semibold'}
                            text={'Длительность интервью'}
                        />
                        <input
                            type="time"
                            className={cls.timeInput}
                            value={time}
                            onChange={onChangeTime}
                        />
                    </div>
                    <div className={cls.text}>
                        <HStack
                            gap={'8'}
                            max
                        >
                            <Text
                                text={'Текст приветствия'}
                                size={'lg'}
                                weight={'semibold'}
                            />
                            {isEmptyInterviewError && isInterviewTextDirty && (
                                <Text
                                    text={'Поле не должно быть пустым.'}
                                    variant={'error'}
                                />
                            )}
                        </HStack>
                        <TextArea
                            value={interviewText}
                            onChange={onChangeText}
                            onBlur={onBlurHandler}
                        />
                    </div>
                    <Button
                        className={cls.button}
                        onClick={onCreate}
                        disabled={isLoading || !validationSuccess}
                    >
                        <Text
                            text={'Создать вакансию'}
                            variant={'white'}
                            align={'center'}
                            weight={'medium'}
                        />
                    </Button>
                </div>
                <div className={cls.addTasks}>
                    <Text
                        text={'Добавить задачи'}
                        size={'xl'}
                        weight={'semibold'}
                    />
                    <Text
                        text={'Добавьте минимум одну задачу'}
                        variant={'gray'}
                    />
                    <VStack
                        max
                        gap={'8'}
                    >
                        <Text
                            size={'lg'}
                            weight={'semibold'}
                            text={'Поиск'}
                        />
                        <Search
                            query={query}
                            onChangeQuery={onChangeQuery}
                        />
                    </VStack>
                    <div className={cls.tasksList}>{tasksList}</div>
                </div>
            </Page>
        </DynamicModuleLoader>
    );
});

export default CreateInterviewPage;
