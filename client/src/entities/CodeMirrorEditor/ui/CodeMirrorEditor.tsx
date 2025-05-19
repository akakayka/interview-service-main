import { memo } from 'react';
import cls from './CodeMirrorEditor.module.scss';
import { Text } from 'shared/ui/Text/Text.tsx';
import CodeIcon from 'shared/assets/icons/code-icon.svg';
import { HStack } from 'shared/ui/Stack';
import { Button } from 'shared/ui/Button/Button.tsx';
import StartIcon from 'shared/assets/icons/start-icon.svg';
import SaveIcon from 'shared/assets/icons/tasks.svg';
import { RecordService } from 'shared/lib/services/RecordService.ts';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { classNames } from 'shared/lib/classNames/classNames.ts';
import { Editor, EditorChange } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/clike/clike';
import { mapLanguageToString } from 'pages/CreateTaskPage';

const mapLanguageToMode: Record<string, string> = {
    [mapLanguageToString[ProgrammingLanguage.unknown]]: '',
    [mapLanguageToString[ProgrammingLanguage.csharp]]: 'text/x-csharp',
    [mapLanguageToString[ProgrammingLanguage.javaScript]]: 'javascript',
};

interface CodeMirrorEditorProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    language?: string;
    defaultValue?: string;
    readonly?: boolean;
    label?: string;
    onStart?: () => void;
    onSave?: () => void;
    isLoading?: boolean;
    recordService?: RecordService;
}

export const CodeMirrorEditor = memo((props: CodeMirrorEditorProps) => {
    const {
        className,
        value,
        onChange,
        language = mapLanguageToString[ProgrammingLanguage.unknown],
        readonly,
        label,
        isLoading,
        onStart,
        onSave,
        recordService,
    } = props;

    return (
        <div className={classNames(cls.wrapper, {}, [className])}>
            <header className={cls.header}>
                <HStack gap={'16'}>
                    <CodeIcon />
                    {label && <Text text={label} />}
                </HStack>
                <HStack gap={'16'}>
                    {onSave && (
                        <Button
                            className={cls.button}
                            onClick={onSave}
                            variant={'white'}
                            size={'small'}
                            disabled={isLoading}
                        >
                            <SaveIcon />
                            <Text
                                text={'Сохранить'}
                                size={'sm'}
                            />
                        </Button>
                    )}
                    {onStart && (
                        <Button
                            className={cls.button}
                            onClick={onStart}
                            variant={'white'}
                            size={'small'}
                            disabled={isLoading}
                        >
                            <StartIcon />
                            <Text
                                text={'Запустить'}
                                size={'sm'}
                            />
                        </Button>
                    )}
                </HStack>
            </header>
            <CodeMirror
                editorDidMount={(editor) => {
                    recordService?.bindEditor(editor);
                }}
                onBeforeChange={(__: Editor, _: EditorChange, value: string) => {
                    onChange?.(value);
                }}
                onChange={(_, __, ___) => {}}
                value={value ?? ''}
                autoCursor={true}
                autoScroll={true}
                className={cls.editor}
                options={{
                    autofocus: false,
                    tabSize: 4,
                    indentUnit: 4,
                    smartIndent: true,
                    autocorrect: true,
                    readOnly: readonly,
                    lineNumbers: true,
                    mode: mapLanguageToMode[language],
                }}
            />
        </div>
    );
});
