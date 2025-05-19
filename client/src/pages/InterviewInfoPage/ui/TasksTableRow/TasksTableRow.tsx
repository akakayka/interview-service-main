import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './TasksTableRow.module.scss';
import { TaskReviewResponse } from 'pages/SyncReviewPage';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';

interface TasksTableRowBase {
    className?: string;
    interviewSolutionId?: string;
}

interface TaskTableHeaderProps extends TasksTableRowBase {
    isHeader: true;
}

interface TasksTableTaskRowProps extends TasksTableRowBase {
    isHeader?: false;
    task: TaskReviewResponse;
}

type TasksTableRowProps = TaskTableHeaderProps | TasksTableTaskRowProps;

export const TasksTableRow = memo((props: TasksTableRowProps) => {
    const { className, isHeader, interviewSolutionId } = props;
    const navigate = useNavigate();

    const gotoTaskReview = () => {
        if (!isHeader) {
            navigate(
                `/review/async/${interviewSolutionId}/task?taskId=${props.task.taskSolutionId}`,
            );
        } else {
            navigate(`/review/async/${interviewSolutionId}/task`);
        }
    };

    if (isHeader) {
        return (
            <div className={classNames(cls.TasksTableRow, {}, [className, cls.header])}>
                <Text
                    size={'md'}
                    weight={'regular'}
                    text={'№'}
                    variant={'gray'}
                    className={cls.item}
                />
                <Text
                    size={'md'}
                    weight={'regular'}
                    text={'Название'}
                    variant={'gray'}
                    className={cls.item}
                />
                <Text
                    size={'md'}
                    weight={'regular'}
                    text={'Состояние'}
                    variant={'gray'}
                    className={cls.item}
                />
                <Text
                    size={'md'}
                    weight={'regular'}
                    text={'Просмотр'}
                    variant={'gray'}
                    className={cls.item}
                />
            </div>
        );
    }

    return (
        <div className={classNames(cls.TasksTableRow, {}, [className])}>
            <Text
                size={'md'}
                weight={'regular'}
                text={props.task.taskOrder}
                className={cls.item}
            />
            <Text
                size={'md'}
                weight={'regular'}
                text={props.task.taskName}
                className={cls.item}
            />
            <Text
                size={'md'}
                weight={'regular'}
                text={props.task.isDone ? 'Решена' : 'Не решена'}
                className={cls.item}
            />
            <Button
                size={'small'}
                className={cls.button}
                onClick={gotoTaskReview}
            >
                <Text
                    size={'sm'}
                    text={'Просмотр'}
                />
            </Button>
        </div>
    );
});
