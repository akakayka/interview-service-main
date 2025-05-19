import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback } from 'react';
import cls from './VacancyDetailsPage.module.scss';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { vacancyDetailsPageReducer } from '../../model/slice/vacancyDetailsSlice.ts';
import { Page } from 'widgets/Page';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { fetchVacancyDetails } from '../../model/services/fetchVacancyDetails/fetchVacancyDetails.ts';
import { fetchVacancyTasks } from '../../model/services/fetchVacancyTasks/fetchVacancyTasks.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    getVacancyDetailsPageTasks,
    getVacancyDetailsPageVacancy,
} from '../../model/selectors/vacancyDetailsPageSelectors.ts';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { convertTimeMsToHours } from 'shared/lib/time/convertTimeMsToString.ts';
import { TasksList } from 'widgets/TasksList';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { deleteVacancy } from '../../model/services/deleteVacancy/deleteVacancy.ts';

interface VacancyDetailsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    vacancyDetailsPage: vacancyDetailsPageReducer,
};

const VacancyDetailsPage = memo((props: VacancyDetailsPageProps) => {
    const { className } = props;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchVacancyDetails(id));
        dispatch(fetchVacancyTasks(id));
    });

    const vacancy = useSelector(getVacancyDetailsPageVacancy);
    const tasks = useSelector(getVacancyDetailsPageTasks);

    const navigateToEditPage = useCallback(() => {
        navigate(RoutePath.vacancy_edit + id);
    }, [id, navigate]);

    const deleteInterview = useCallback(() => {
        if (id && confirm('Вы действительно хотите удалить вакансию?')) {
            dispatch(deleteVacancy(id)).then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    navigate(RoutePath.vacancies);
                }
            });
        }
    }, [dispatch, id, navigate]);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                className={classNames(cls.VacancyDetailsPage, {}, [className])}
                title={`Вакансии/${vacancy?.vacancy}`}
                withBackButton
            >
                <VStack
                    className={cls.info}
                    gap={'24'}
                >
                    <VStack gap={'8'}>
                        <Text
                            size={'lg'}
                            weight={'semibold'}
                            text={'Название вакансии'}
                        />
                        <Text text={vacancy?.vacancy} />
                    </VStack>
                    <VStack gap={'8'}>
                        <Text
                            size={'lg'}
                            weight={'semibold'}
                            text={'Длительность интервью'}
                        />
                        <Text text={convertTimeMsToHours(vacancy?.interviewDurationMs ?? 0)} />
                    </VStack>
                    <VStack gap={'8'}>
                        <Text
                            size={'lg'}
                            weight={'semibold'}
                            text={'Текст приветствия'}
                        />
                        <Text text={vacancy?.interviewText} />
                    </VStack>
                    <Button
                        onClick={navigateToEditPage}
                        variant={'primary'}
                    >
                        <Text
                            variant={'white'}
                            text={'Редактировать'}
                            weight={'medium'}
                        />
                    </Button>
                    <Button
                        onClick={deleteInterview}
                        variant={'clear'}
                    >
                        <Text
                            variant={'error'}
                            text={'Удалить'}
                        />
                    </Button>
                </VStack>
                <VStack
                    className={cls.tasksContainer}
                    gap={'16'}
                >
                    <Text
                        size={'lg'}
                        weight={'semibold'}
                        text={'Задачи'}
                    />
                    <TasksList items={tasks} />
                </VStack>
            </Page>
        </DynamicModuleLoader>
    );
});

export default VacancyDetailsPage;
