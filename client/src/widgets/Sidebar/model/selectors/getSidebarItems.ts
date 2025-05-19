import { SidebarItemType } from '../types/sidebar.ts';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
// import TaskIcon from 'shared/assets/icons/task.svg';
// import VacanciesIcon from 'shared/assets/icons/vac.svg';
// import MeetingsIcon from 'shared/assets/icons/vacancies.svg';
// import InterviewsIcon from 'shared/assets/icons/interviews.svg';
// import TasksIcon from 'shared/assets/icons/tasks.svg';
import { createSelector } from '@reduxjs/toolkit';
import { getUserRole, UserRole } from 'entities/User';

export const getSidebarItems = createSelector(getUserRole, (role) => {
    let sidebarItemsList: SidebarItemType[] = [];

    if (role === UserRole.candidate) {
        sidebarItemsList = [
            {
                path: RoutePath.start,
                Icon: "https://storage.yandexcloud.net/project-static/task.svg",
                text: 'Текущее задание',
            },
            {
                path: RoutePath.candidate_interviews,
                Icon: "https://storage.yandexcloud.net/project-static/tasks.svg",
                text: 'Интервью',
            },
        ];
    }

    if (role && [UserRole.hrManager, UserRole.admin, UserRole.interviewer].includes(role)) {
        sidebarItemsList = [
            {
                path: RoutePath.interviews,
                Icon: "https://storage.yandexcloud.net/project-static/interviews.svg",
                text: 'Интервью',
            },
            {
                path: RoutePath.meetings,
                Icon: "https://storage.yandexcloud.net/project-static/vacancies.svg",
                text: 'Встречи',
            },
            {
                path: RoutePath.vacancies,
                Icon: "https://storage.yandexcloud.net/project-static/vac.svg",
                text: 'Вакансии',
            },
            {
                path: RoutePath.tasks,
                Icon: "https://storage.yandexcloud.net/project-static/tasks.svg",
                text: 'Задачи',
            },
        ];
    }

    return sidebarItemsList;
});
