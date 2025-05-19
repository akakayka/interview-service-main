import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import cls from './CreateTaskPage.module.scss';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { Page } from 'widgets/Page';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { Input } from 'shared/ui/Input/Input.tsx';
import { Select } from 'shared/ui/Select/ui/Select/Select.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { useSelector } from 'react-redux';
import { SelectOption } from 'shared/ui/Select/ui/SelectOption/SelectOption.tsx';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import { TextArea } from 'shared/ui/TextArea/TextArea.tsx';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { HStack } from 'shared/ui/Stack';
import { CodeMirrorEditor } from 'entities/CodeMirrorEditor';
import {
    getCreateTaskPageError,
    getCreateTaskPageFormName,
    getCreateTaskPageFormStartCode,
    getCreateTaskPageFormTaskText,
    getCreateTaskPageFormTestsCode,
    getCreateTaskPageIsLoading,
} from '../../model/selectors/createTaskPageSelectors.ts';
import { createTask } from '../../model/services/createTask/createTask.ts';
import { createTaskOptions } from '../../model/consts/createTaskOptions.ts';
import { mapLanguageToString } from '../../model/consts/mapLanguageToString.ts';
import {
    createTaskPageActions,
    createTaskPageReducer,
} from '../../model/slice/createTaskPageSlice.ts';
import { toast } from 'react-toastify';

interface CreateTaskPageProps {
    className?: string;
}

const reducers: ReducersList = {
    createTaskPage: createTaskPageReducer,
};

const CreateTaskPage = memo((props: CreateTaskPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const name = useSelector(getCreateTaskPageFormName);
    const taskText = useSelector(getCreateTaskPageFormTaskText);
    const code = useSelector(getCreateTaskPageFormStartCode);
    const testsCode = useSelector(getCreateTaskPageFormTestsCode);
    const [currentLanguage, setCurrentLanguage] = useState<SelectOption | null>(null);
    const error = useSelector(getCreateTaskPageError);
    const isLoading = useSelector(getCreateTaskPageIsLoading);
    const navigate = useNavigate();

    const [taskTextIsDirty, setTaskTextIsDirty] = useState(false);

    const { isEmptyError: isEmptyTaskTextError } = useValidation(taskText, {
        isEmpty: true,
    });
    const { isEmptyError: isEmptyTaskNameError } = useValidation(name, {
        isEmpty: true,
    });

    const validationSuccess = useMemo(
        () => taskText && code && testsCode && currentLanguage && name,
        [code, currentLanguage, name, taskText, testsCode],
    );

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
    });

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

    const onChangeName = useCallback(
        (value: string) => {
            dispatch(createTaskPageActions.setName(value));
        },
        [dispatch],
    );

    const onChangeTaskText = useCallback(
        (value: string) => {
            dispatch(createTaskPageActions.setTaskText(value));
        },
        [dispatch],
    );

    const onChangeLanguage = useCallback(
        (selected: SelectOption) => {
            setCurrentLanguage(selected);
            dispatch(
                createTaskPageActions.setProgrammingLanguage(selected.value as ProgrammingLanguage),
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

    const onChangeCode = useCallback(
        (value: string) => {
            dispatch(createTaskPageActions.setStartCode(value));
        },
        [dispatch],
    );

    const onChangeTestsCode = useCallback(
        (value: string) => {
            dispatch(createTaskPageActions.setTestsCode(value));
        },
        [dispatch],
    );

    const onCreateTask = useCallback(async () => {
        const result = await dispatch(createTask());
        if (result.meta.requestStatus === 'fulfilled') {
            navigate(RoutePath.tasks);
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const onBlurHandler = useCallback(() => {
        setTaskTextIsDirty(true);
    }, []);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                withBackButton
                title={'Создать задачу'}
                className={classNames(cls.CreateTaskPage, {}, [className])}
            >
                <div className={cls.form}>
                    <Input
                        label={'Название задачи'}
                        placeholder={'Введите название задачи...'}
                        value={name}
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
                        onClick={onCreateTask}
                        disabled={isLoading || !validationSuccess}
                    >
                        <Text
                            text={'Создать задачу'}
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
                            value={taskText}
                            onChange={onChangeTaskText}
                            onBlur={onBlurHandler}
                            placeholder={'Введите условие задачи...'}
                        />
                    </div>
                </div>
                <div className={cls.codeEditor}>
                    <CodeMirrorEditor
                        label={'Стартовый код'}
                        value={code}
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
                        value={testsCode}
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

export default CreateTaskPage;
