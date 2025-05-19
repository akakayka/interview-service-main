import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useState } from 'react';
import cls from './ExecutionResult.module.scss';
import { HStack, VStack } from 'shared/ui/Stack';
import { ExecutionResult, TestsRunResponse } from 'entities/CodeEditor';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Loader } from 'shared/ui/Loader/Loader.tsx';

interface ExecutionResultProps {
    className?: string;
    result?: ExecutionResult;
    tests?: TestsRunResponse;
    isLoading: boolean;
}

export const ExecutionResultComponent = memo((props: ExecutionResultProps) => {
    const { className, result, tests, isLoading } = props;
    const [isConsole, setIsConsole] = useState(true);

    const onClickConsole = useCallback(() => {
        setIsConsole(true);
    }, []);

    const onClickTests = useCallback(() => {
        setIsConsole(false);
    }, []);

    if (isLoading) {
        return (
            <VStack
                max
                className={classNames(cls.ExecutionResult, {}, [className, cls.loading])}
            >
                <Loader />
            </VStack>
        );
    }

    return (
        <VStack
            max
            className={classNames(cls.ExecutionResult, {}, [className])}
        >
            <HStack
                gap={'16'}
                className={cls.tabs}
                max
            >
                <button
                    onClick={onClickConsole}
                    className={classNames(cls.tab, { [cls.selected]: isConsole }, [])}
                >
                    Консоль
                </button>
                <button
                    onClick={onClickTests}
                    className={classNames(cls.tab, { [cls.selected]: !isConsole }, [])}
                >
                    Тесты
                </button>
            </HStack>
            <div className={cls.output}>
                {isConsole ? (
                    <>
                        {result?.output?.map((text) => (
                            <Text
                                text={text}
                                key={text}
                            />
                        ))}
                        {result?.errors?.map((error) => (
                            <>
                                <Text
                                    text={error.errorCode}
                                    key={error.errorCode}
                                    size={'xl'}
                                    weight={'medium'}
                                />
                                <Text
                                    text={error.message}
                                    key={error.message}
                                />
                            </>
                        ))}
                    </>
                ) : (
                    <>
                        {tests && tests.isCompiledSuccessfully ? (
                            <Text text={'Успешно'} />
                        ) : (
                            <Text
                                text={'Тесты провалены'}
                                variant={'error'}
                            />
                        )}
                    </>
                )}
            </div>
        </VStack>
    );
});
