import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './TaskEditPage.module.scss';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { taskEditPageActions, taskEditPageReducer } from '../../model/slice/taskEditPageSlice.ts';
import { Page } from 'widgets/Page';
import { Input } from 'shared/ui/Input/Input.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Select } from 'shared/ui/Select/ui/Select/Select.tsx';
import {
    createTaskOptions,
    createTaskPageActions,
    mapLanguageToString,
} from 'pages/CreateTaskPage';
import { Button } from 'shared/ui/Button/Button.tsx';
import { HStack } from 'shared/ui/Stack';
import { TextArea } from 'shared/ui/TextArea/TextArea.tsx';
import { CodeMirrorEditor } from 'entities/CodeMirrorEditor';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { fetchTaskEditInfo } from '../../model/services/fetchTaskEditInfo/fetchTaskEditInfo.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    getTaskEditPageError,
    getTaskEditPageForm,
    getTaskEditPageIsLoading,
} from '../../model/selectors/taskEditPageSelectors.ts';
import { createNewTask } from '../../model/services/createNewTask/createNewTask.ts';
import { SelectOption } from 'shared/ui/Select/ui/SelectOption/SelectOption.tsx';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { deleteOldTask } from '../../model/services/deleteOldTask/deleteOldTask.ts';
import { toast } from 'react-toastify';
import { convertProgrammingLanguageToString } from 'shared/lib/programmingLanguages/programmingLanguages.ts';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';

interface TaskEditPageProps {
    className?: string;
}

const reducers: ReducersList = {
    taskEditPage: taskEditPageReducer,
};

const TaskEditPage = memo((props: TaskEditPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const [taskTextIsDirty, setTaskTextIsDirty] = useState(false);
    const navigate = useNavigate();

    const { taskId } = useParams<{ taskId: string }>();

    const defaultCodeValue = useCallback((language: ProgrammingLanguage) => {
        if (language === ProgrammingLanguage.csharp) {
            return `namespace CodeRev
{
    class Program
    {
        public static void Main()
        {
            System.Console.WriteLine("Hello, world!");
        }
    }
}`;
        }
        return '// put your code here.';
    }, []);

    const defaultTestsValue = useCallback((language: ProgrammingLanguage) => {
        if (language === ProgrammingLanguage.csharp) {
            return `using NUnit.Framework;

namespace CodeRev;

[TestFixture]
public class SomeTestCode
{
    [Test]
    public void Should_return_129()
    {
        var instance = new Program();
        var result = instance.Main();
        
        Assert.AreEqual(result, "Hello, world!");
    }
}`;
        }
        return '// put your code here.';
    }, []);

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchTaskEditInfo(taskId));
    });

    const task = useSelector(getTaskEditPageForm);
    const isLoading = useSelector(getTaskEditPageIsLoading);
    const error = useSelector(getTaskEditPageError);
    const newTaskId = useSelector(getTaskEditPageError);
    const [currentLanguage, setCurrentLanguage] = useState<SelectOption | null>(null);

    useEffect(() => {
        if (task?.isDeleted) {
            navigate(RoutePath.tasks);
        }
    }, [navigate, task?.isDeleted]);

    const navigateToNewTask = useCallback(() => {
        if (newTaskId) {
            navigate(RoutePath.task_details + newTaskId);
        } else {
            navigate(RoutePath.task_details + taskId);
        }
    }, [navigate, newTaskId, taskId]);

    useEffect(() => {
        if (task?.programmingLanguage !== undefined) {
            setCurrentLanguage({
                value: task?.programmingLanguage,
                title: convertProgrammingLanguageToString(task?.programmingLanguage),
            });
        }
    }, [task?.programmingLanguage]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onChangeName = useCallback(
        (value: string) => {
            dispatch(taskEditPageActions.setName(value));
        },
        [dispatch],
    );

    const onCreateTask = useCallback(async () => {
        if (taskId) {
            await dispatch(deleteOldTask(taskId));
            dispatch(createNewTask()).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    toast.success('сохранено');
                    // @ts-ignore
                    navigate(RoutePath.task_details + res.payload!.taskId);
                }
            });
        }
    }, [dispatch, navigate, taskId]);

    const onChangeTaskText = useCallback(
        (value: string) => {
            dispatch(taskEditPageActions.setTaskText(value));
        },
        [dispatch],
    );

    const onChangeCode = useCallback(
        (value: string) => {
            dispatch(taskEditPageActions.setStartCode(value));
        },
        [dispatch],
    );

    const onChangeTestsCode = useCallback(
        (value: string) => {
            dispatch(taskEditPageActions.setTestsCode(value));
        },
        [dispatch],
    );

    const onChangeLanguage = useCallback(
        (selected: SelectOption) => {
            setCurrentLanguage(selected);
            dispatch(
                taskEditPageActions.setProgrammingLanguage(selected.value as ProgrammingLanguage),
            );
            dispatch(
                createTaskPageActions.setTestsCode(
                    defaultTestsValue(selected.value as ProgrammingLanguage),
                ),
            );
            dispatch(
                createTaskPageActions.setStartCode(
                    defaultCodeValue(selected.value as ProgrammingLanguage),
                ),
            );
        },
        [defaultCodeValue, defaultTestsValue, dispatch],
    );

    const { isEmptyError: isEmptyTaskTextError } = useValidation(task?.taskText ?? '', {
        isEmpty: true,
    });
    const { isEmptyError: isEmptyTaskNameError } = useValidation(task?.name ?? '', {
        isEmpty: true,
    });

    const onBlurHandler = useCallback(() => {
        setTaskTextIsDirty(true);
    }, []);

    const validationSuccess = useMemo(
        () => task?.taskText && task?.startCode && task?.testsCode && currentLanguage && task?.name,
        [currentLanguage, task?.name, task?.startCode, task?.taskText, task?.testsCode],
    );

    const rollbackChanges = useCallback(() => {
        dispatch(fetchTaskEditInfo(taskId));
    }, [dispatch, taskId]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                className={classNames(cls.TaskEditPage, {}, [className])}
                title={'Редактировать задачу'}
                withBackButton
                backButtonAction={navigateToNewTask}
            >
                <div className={cls.form}>
                    <Input
                        label={'Название задачи'}
                        placeholder={'Введите название задачи...'}
                        value={task?.name}
                        onChange={onChangeName}
                        error={{
                            isEmpty: isEmptyTaskNameError
                                ? 'Поле не должно быть пустым.'
                                : undefined,
                        }}
                    />
                    <div className={cls.select}>
                        <Text
                            text={'Язык программирования'}
                            size={'lg'}
                            weight={'semibold'}
                            className={cls.label}
                        />
                        <Select
                            selected={currentLanguage}
                            options={createTaskOptions}
                            placeholder={'Выберите...'}
                            onChange={onChangeLanguage}
                        />
                    </div>
                    <Button
                        className={cls.btn}
                        onClick={rollbackChanges}
                        variant={'secondary'}
                        disabled={isLoading || !validationSuccess}
                    >
                        <Text
                            text={'Отменить'}
                            align={'center'}
                            variant={'accent'}
                            weight={'medium'}
                        />
                    </Button>
                    <Button
                        className={cls.btn}
                        onClick={onCreateTask}
                        disabled={isLoading || !validationSuccess}
                    >
                        <Text
                            text={'Сохранить'}
                            align={'center'}
                            variant={'white'}
                            weight={'medium'}
                        />
                    </Button>
                    <div className={cls.textarea}>
                        <HStack
                            gap={'8'}
                            max
                        >
                            <Text
                                text={'Условие задачи'}
                                size={'lg'}
                                weight={'semibold'}
                            />
                            {isEmptyTaskTextError && taskTextIsDirty && (
                                <Text
                                    variant={'error'}
                                    text={'Поле не должно быть пустым.'}
                                />
                            )}
                        </HStack>
                        <TextArea
                            value={task?.taskText ?? ''}
                            onChange={onChangeTaskText}
                            onBlur={onBlurHandler}
                            placeholder={'Введите условие задачи...'}
                        />
                    </div>
                </div>
                <div className={cls.codeEditor}>
                    <CodeMirrorEditor
                        label={'Стартовый код'}
                        value={task?.startCode}
                        onChange={onChangeCode}
                        language={
                            mapLanguageToString[
                                (currentLanguage?.value as ProgrammingLanguage) ??
                                    ProgrammingLanguage.unknown
                            ]
                        }
                    />
                </div>
                <div className={cls.testsEditor}>
                    <CodeMirrorEditor
                        label={'Код для тестов'}
                        value={task?.testsCode}
                        onChange={onChangeTestsCode}
                        language={
                            mapLanguageToString[
                                (currentLanguage?.value as ProgrammingLanguage) ??
                                    ProgrammingLanguage.unknown
                            ]
                        }
                    />
                </div>
            </Page>
        </DynamicModuleLoader>
    );
});

export default TaskEditPage;
