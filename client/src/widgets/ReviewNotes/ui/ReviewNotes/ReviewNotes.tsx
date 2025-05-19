import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect } from 'react';
import cls from './ReviewNotes.module.scss';
import { Text } from 'shared/ui/Text/Text.tsx';
import { HStack, VStack } from 'shared/ui/Stack';
import { Input } from 'shared/ui/Input/Input.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import AddIcon from 'shared/assets/icons/add.svg';
import { useSelector } from 'react-redux';
import {
    getReviewNotesError,
    getReviewNotesIsLoading,
    getReviewNotesNewNote,
    getReviewNotesNotes,
} from '../../model/selectors/reviewNotesSelectors.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { reviewNotesActions } from '../../model/slices/reviewNotesSlice.ts';
import { fetchReviewNotes } from '../../model/services/fetchReviewNotes/fetchReviewNotes.ts';
import { updateReviewNotes } from '../../model/services/updateReviewNotes/updateReviewNotes.ts';
import { useValidation } from 'shared/lib/hooks/useValidation/useValidation.ts';
import { ReviewNotesItem } from '../ReviewNotesItem/ReviewNotesItem.tsx';
import { toast } from 'react-toastify';

interface ReviewNotesProps {
    className?: string;
    interviewSolutionId?: string;
}

export const ReviewNotes = memo((props: ReviewNotesProps) => {
    const { className, interviewSolutionId } = props;

    const dispatch = useAppDispatch();

    const notes = useSelector(getReviewNotesNotes);
    const newNote = useSelector(getReviewNotesNewNote);
    const isLoading = useSelector(getReviewNotesIsLoading);
    const error = useSelector(getReviewNotesError);

    const { inputValid } = useValidation(newNote ?? '', { isEmpty: true });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (interviewSolutionId) {
            dispatch(fetchReviewNotes(interviewSolutionId));
        }
    }, [dispatch, interviewSolutionId]);

    const onChangeNewNote = useCallback(
        (value: string) => {
            dispatch(reviewNotesActions.setNewNote(value));
        },
        [dispatch],
    );

    const saveReviewNotes = useCallback(() => {
        if (interviewSolutionId && notes) {
            dispatch(updateReviewNotes(interviewSolutionId));
        }
    }, [dispatch, interviewSolutionId, notes]);

    const addNewNote = useCallback(() => {
        if (newNote) {
            dispatch(reviewNotesActions.addNewNote(newNote));
            dispatch(reviewNotesActions.setNewNote(''));
            saveReviewNotes();
        }
    }, [dispatch, newNote, saveReviewNotes]);

    const removeNote = useCallback(
        (index: number) => () => {
            dispatch(reviewNotesActions.removeNote(index));
            saveReviewNotes();
        },
        [dispatch, saveReviewNotes],
    );

    const onChangeCheckbox = useCallback(
        (index: number) => {
            return (value: boolean) => {
                dispatch(
                    reviewNotesActions.setIsChecked({
                        index,
                        value: value,
                    }),
                );
                saveReviewNotes();
            };
        },
        [dispatch, saveReviewNotes],
    );

    return (
        <VStack
            max
            gap={'16'}
            className={classNames(cls.ReviewNotes, {}, [className])}
        >
            <Text
                size={'display_sm'}
                text={'Заметки'}
                weight={'semibold'}
            />
            <HStack
                max
                gap={'8'}
            >
                <Input
                    placeholder={'Новая заметка...'}
                    className={cls.input}
                    value={newNote}
                    onChange={onChangeNewNote}
                />
                <Button
                    square
                    className={cls.button}
                    disabled={isLoading || !inputValid}
                    onClick={addNewNote}
                >
                    <AddIcon />
                </Button>
            </HStack>
            <VStack
                gap={'8'}
                max
            >
                {notes &&
                    notes.map((note, index) => (
                        <ReviewNotesItem
                            key={JSON.stringify({
                                note,
                                index,
                            })}
                            note={note}
                            onChange={onChangeCheckbox(index)}
                            removeNote={removeNote(index)}
                        />
                    ))}
            </VStack>
        </VStack>
    );
});
