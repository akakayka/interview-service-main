import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useEffect } from 'react';
import cls from './TasksPage.module.scss';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { Page } from 'widgets/Page';
import { TasksList } from 'widgets/TasksList';
import { useSelector } from 'react-redux';
import { tasksPageReducer } from '../../model/slice/tasksPageSlice.ts';
import { fetchCandidateList } from 'pages/InterviewsPage';
import { fetchTasksList } from '../../model/services/fetchTasksList/fetchTasksList.ts';
import { getTasksPageError, getTasksPageTasks } from '../../model/selectors/tasksPageSelectors.ts';
import { toast } from 'react-toastify';

interface TasksPageProps {
    className?: string;
}

const reducers: ReducersList = {
    tasksPage: tasksPageReducer,
};

const TasksPage = (props: TasksPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const error = useSelector(getTasksPageError);

    useInitialEffect(() => {
        dispatch(fetchCandidateList());
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchTasksList());
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const tasks = useSelector(getTasksPageTasks);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                title="Задачи"
                className={classNames(cls.TasksPage, {}, [className])}
            >
                <div className={cls.content}>
                    <TasksList
                        items={tasks}
                        enableSearch
                    />
                </div>
            </Page>
        </DynamicModuleLoader>
    );
};

export default memo(TasksPage);
