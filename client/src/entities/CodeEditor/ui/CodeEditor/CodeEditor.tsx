import { classNames } from 'shared/lib/classNames/classNames.ts';
import { memo, useCallback } from 'react';
import cls from './CodeEditor.module.scss';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
import { Loader } from 'shared/ui/Loader/Loader.tsx';

export interface CodeEditorProps {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
    language?: string;
    defaultValue?: string;
    readonly?: boolean;
}

export const CodeEditor = memo((props: CodeEditorProps) => {
    const {
        className,
        value,
        onChange,
        language = 'javascript',
        defaultValue = ``,
        readonly = false,
    } = props;

    const onChangeHandler = useCallback(
        (value: string | undefined) => {
            onChange?.(value || '');
        },
        [onChange],
    );

    const editorOptions: editor.IStandaloneEditorConstructionOptions = {
        fontSize: 16,
        minimap: { enabled: false },
        scrollbar: {
            verticalSliderSize: 8,
        },
        ariaRequired: false,
        readOnly: readonly,
    };

    return (
        <Editor
            className={classNames(cls.CodeEditor, {}, [className])}
            onChange={onChangeHandler}
            value={value}
            defaultValue={defaultValue}
            options={editorOptions}
            language={language}
            theme={'light'}
            loading={<Loader />}
        />
    );
});
