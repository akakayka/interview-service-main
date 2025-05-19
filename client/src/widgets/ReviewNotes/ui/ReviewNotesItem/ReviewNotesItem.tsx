import { ChangeEvent, memo, useCallback } from 'react';
import { NoteCheckBox } from '../../model/types/notes.ts';
import { HStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import RemoveIcon from 'shared/assets/icons/remove.svg';

import cls from './ReviewNotesItem.module.scss';
import { Button } from 'shared/ui/Button/Button.tsx';

interface ReviewNotesItemProps {
    className?: string;
    note: NoteCheckBox;
    onChange: (value: boolean) => void;
    removeNote?: () => void;
}

export const ReviewNotesItem = memo((props: ReviewNotesItemProps) => {
    const { className, note, onChange, removeNote } = props;

    const onChangeHandler = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.checked);
        },
        [onChange],
    );

    return (
        <HStack
            max
            className={className}
            align={'center'}
            justify={'between'}
        >
            <HStack gap={'8'}>
                <input
                    type={'checkbox'}
                    onChange={onChangeHandler}
                    checked={note.isChecked}
                    className={cls.checkbox}
                />
                <Text
                    text={note.value}
                    size={'md'}
                />
            </HStack>
            {removeNote && (
                <Button
                    variant={'clear'}
                    className={cls.removeButton}
                    onClick={removeNote}
                >
                    <RemoveIcon />
                </Button>
            )}
        </HStack>
    );
});
