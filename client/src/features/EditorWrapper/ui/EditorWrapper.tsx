import { classNames } from 'shared/lib/classNames/classNames.ts';
import { memo } from 'react';
import cls from './EditorWrapper.module.scss';
import { Button } from 'shared/ui/Button/Button.tsx';
import CodeIcon from 'shared/assets/icons/code-icon.svg';
import StartIcon from 'shared/assets/icons/start-icon.svg';
import { Text } from 'shared/ui/Text/Text.tsx';
import { HStack } from 'shared/ui/Stack';
import { CodeEditor, CodeEditorProps } from 'entities/CodeEditor';

export interface EditorWrapperProps extends CodeEditorProps {
    className?: string;
    onStart?: () => void;
    label?: string;
    isLoading?: boolean;
}

export const EditorWrapper = memo((props: EditorWrapperProps) => {
    const { className, onStart, label, isLoading, ...otherProps } = props;

    return (
        <div className={classNames(cls.EditorWrapper, {}, [className])}>
            <header className={cls.header}>
                <HStack gap={'16'}>
                    <CodeIcon />
                    {label && <Text text={label} />}
                </HStack>
                {onStart && (
                    <Button
                        className={cls.button}
                        onClick={onStart}
                        variant={'white'}
                        size={'small'}
                        disabled={isLoading}
                    >
                        <StartIcon />
                        <Text text={'Запустить'} />
                    </Button>
                )}
            </header>
            <CodeEditor {...otherProps} />
        </div>
    );
});
