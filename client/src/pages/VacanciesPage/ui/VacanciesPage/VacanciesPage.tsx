import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './VacanciesPage.module.scss';
import { Page } from 'widgets/Page';
import { VacanciesList } from 'widgets/VacanciesList';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { vacanciesPageReducer } from '../../model/slice/vacanciesPageSlice.ts';
import { fetchVacancies } from '../../model/services/fetchVacancies/fetchVacancies.ts';
import { useSelector } from 'react-redux';
import { getVacanciesPageInterviews } from '../../model/selectors/vacanciesPageSelectors.ts';

interface VacanciesPageProps {
    className?: string;
}

const reducers: ReducersList = {
    vacanciesPage: vacanciesPageReducer,
};

const VacanciesPage = memo((props: VacanciesPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchVacancies());
    });

    const vacancies = useSelector(getVacanciesPageInterviews);

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                title={'Вакансии'}
                className={classNames(cls.VacanciesPage, {}, [className])}
            >
                <div className={cls.content}>
                    <VacanciesList
                        items={vacancies ?? []}
                        enableSearch
                    />
                </div>
            </Page>
        </DynamicModuleLoader>
    );
});

export default VacanciesPage;
