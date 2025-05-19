import { classNames } from 'shared/lib/classNames/classNames';
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './VacancyEditPage.module.scss';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { fetchVacancyEditInfo } from '../../model/services/fetchVacancyEditInfo/fetchVacancyEditInfo.ts';
import { fetchVacancyEditAllTasks } from '../../model/services/fetchVacancyEditAllTasks/fetchVacancyEditAllTasks.ts';
import { fetchVacancyEditSelectedTasks } from '../../model/services/fetchVacancyEditSelectedTasks/fetchVacancyEditSelectedTasks.ts';
import { useSelector } from 'react-redux';
import { TaskInfo } from 'entities/Task';
import { toast } from 'react-toastify';
import {
    getVacancyEditPageError,
    getVacancyEditPageForm,
    getVacancyEditPageIsLoading,
    getVacancyEditPageTasks,
} from '../../model/selectors/vacancyEditPageSelectors.ts';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { TasksListItem } from 'features/TasksListItem';
import { convertTimeToMs } from 'shared/lib/time/convertTimeToMs.ts';
import {
    vacancyEditPageActions,
    vacancyEditPageReducer,
} from '../../model/slice/vacancyEditPageSlice.ts';
import { Page } from 'widgets/Page';
import { Input } from 'shared/ui/Input/Input.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { HStack, VStack } from 'shared/ui/Stack';
import { TextArea } from 'shared/ui/TextArea/TextArea.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { Search } from 'features/Search';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { deleteOldVacancy } from '../../model/services/deleteOldVacancy/deleteOldVacancy.ts';
import { createNewInterview } from '../../model/services/createNewInterview/createNewInterview.ts';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';

interface VacancyEditPageProps {
    className?: string;
}

const reducers: ReducersList = {
    vacancyEditPage: vacancyEditPageReducer,
};

const VacancyEditPage = memo((props: VacancyEditPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const [time, setTime] = useState('');
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    useInitialEffect(() => {
        setTime('01:00');
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchVacancyEditInfo(id));
        dispatch(fetchVacancyEditSelectedTasks(id));
        dispatch(fetchVacancyEditAllTasks(id));
    });

    const form = useSelector(getVacancyEditPageForm);
    const tasks = useSelector(getVacancyEditPageTasks);
    const error = useSelector(getVacancyEditPageError);
    const isLoading = useSelector(getVacancyEditPageIsLoading);
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

    const { isEmptyError: isEmptyVacancyError } = useValidation(form?.vacancy ?? '', {
        isEmpty: true,
    });
    const { isEmptyError: isEmptyInterviewError } = useValidation(form?.interviewText ?? '', {
        isEmpty: true,
    });
    const [isInterviewTextDirty, setIsInterviewTextDirty] = useState(false);

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

    const onChangeTask = useCallback(
        (id: string) => (e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                dispatch(vacancyEditPageActions.pushTaskId(id));
            } else {
                dispatch(vacancyEditPageActions.removeTaskId(id));
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
                        checked={form?.taskIds?.includes(task.id)}
                        onChange={onChangeTask(task.id)}
                    />
                    <TasksListItem task={task} />
                </div>
            )),
        [filteredItems, onChangeTask, form?.taskIds],
    );

    const onChangeTime = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const timeString = e.target.value;
            setTime(timeString);
            const timeMs = convertTimeToMs(timeString);
            dispatch(vacancyEditPageActions.setTime(timeMs));
        },
        [dispatch],
    );

    const onChangeText = useCallback(
        (value: string) => {
            dispatch(vacancyEditPageActions.setInterviewText(value));
        },
        [dispatch],
    );

    const onChangeVacancy = useCallback(
        (value: string) => {
            dispatch(vacancyEditPageActions.setVacancy(value));
        },
        [dispatch],
    );

    const onCreate = useCallback(async () => {
        if (id) {
            await dispatch(deleteOldVacancy(id));
            dispatch(createNewInterview()).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toast.success('сохранено');
                    // @ts-ignore
                    navigate(RoutePath.vacancy_details + res.payload!.interviewId);
                }
            });
        }
    }, [dispatch, id, navigate]);

    const validationSuccess = useMemo(
        () => form?.taskIds?.length && !isEmptyInterviewError && !isEmptyVacancyError,
        [isEmptyInterviewError, isEmptyVacancyError, form?.taskIds?.length],
    );

    const onBlurHandler = useCallback(() => {
        setIsInterviewTextDirty(true);
    }, []);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                withBackButton
                title={'Редактировать интервью'}
                className={classNames(cls.VacancyEditPage, {}, [className])}
            >
                <div className={cls.form}>
                    <div className={cls.inputs}>
                        <Input
                            label={'Название вакансии'}
                            placeholder={'Javascript разработчик'}
                            value={form?.vacancy}
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
                            value={form?.interviewText ?? ''}
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
                            text={'Сохранить'}
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

export default VacancyEditPage;
