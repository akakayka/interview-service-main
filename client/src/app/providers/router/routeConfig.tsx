import { RouteProps } from 'react-router-dom';
import { UserRole } from 'entities/User';
import { CandidateStartPage } from 'pages/CandidateStartPage';
import { SettingsPage } from 'pages/SettingsPage';
import { InterviewsPage } from 'pages/InterviewsPage';
import { VacanciesPage } from 'pages/VacanciesPage';
import { TasksPage } from 'pages/TasksPage';
import { CreateTaskPage } from 'pages/CreateTaskPage';
import { MeetingsPage } from 'pages/MeetingsPage';
import { CreateInterviewPage } from 'pages/CreateInterviewPage';
import { InterviewPage } from 'pages/InterviewPage';
import { InterviewInfoPage } from 'pages/InterviewInfoPage';
import { AfterInterviewPage } from 'pages/AfterInterviewPage';
import { SyncReviewPage } from 'pages/SyncReviewPage';
import { LoginPage } from 'pages/LoginPage';
import { RegisterPage } from 'pages/RegisterPage';
import { RedirectToDefaultPage } from 'features/RedirectToDefaultPage';
import { TaskDetailsPage } from 'pages/TaskDetailsPage';
import { AsyncReviewPage } from 'pages/AsyncReviewPage';
import { CandidateInterviewsPage } from 'pages/CandidateInterviewsPage';
import { CandidateInterviewInfoPage } from 'pages/CandidateInterviewInfoPage';
import { VacancyDetailsPage } from 'pages/VacancyDetailsPage';
import { TaskEditPage } from 'pages/TaskEditPage';
import { VacancyEditPage } from 'pages/VacancyEditPage';

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    roles?: UserRole[];
};

export enum AppRoutes {
    START = 'start',
    CANDIDATE_INTERVIEWS = 'candidate_interviews',
    SETTINGS = 'settings',
    INTERVIEWS = 'interviews',
    VACANCIES = 'vacancies',
    VACANCY_DETAILS = 'vacancy_details',
    VACANCY_EDIT = 'vacancy_edit',
    LOGIN = 'login',
    REGISTER = 'register',
    TASKS = 'tasks',
    TASK_CREATE = 'task_create',
    TASK_DETAILS = 'task_details',
    TASK_EDIT = 'task_edit',
    MEETINGS = 'meetings',
    INTERVIEW_CREATE = 'interview_create',
    INTERVIEW = 'interview',
    INTERVIEW_INFO = 'interview_info',
    INTERVIEW_DETAILS = 'interview_details',
    REVIEW_SYNC = 'review_sync',
    REVIEW_ASYNC = 'review_async',
    AFTER_INTERVIEW = 'after_interview',
    DEFAULT = 'default',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.START]: '/start',
    [AppRoutes.CANDIDATE_INTERVIEWS]: '/my_interviews',
    [AppRoutes.SETTINGS]: '/settings',
    [AppRoutes.INTERVIEWS]: '/interviews',
    [AppRoutes.VACANCIES]: '/vacancies',
    [AppRoutes.VACANCY_DETAILS]: '/vacancies/',
    [AppRoutes.VACANCY_EDIT]: '/vacancies/edit/',
    [AppRoutes.LOGIN]: '/login',
    [AppRoutes.REGISTER]: '/auth/register/',
    [AppRoutes.TASKS]: '/tasks',
    [AppRoutes.TASK_CREATE]: '/tasks/create',
    [AppRoutes.TASK_DETAILS]: '/tasks/',
    [AppRoutes.TASK_EDIT]: '/tasks/edit/',
    [AppRoutes.MEETINGS]: '/meetings',
    [AppRoutes.INTERVIEW_CREATE]: '/interviews/create',
    [AppRoutes.INTERVIEW]: '/interview',
    [AppRoutes.INTERVIEW_INFO]: '/interview_info/',
    [AppRoutes.INTERVIEW_DETAILS]: '/interview_details/',
    [AppRoutes.REVIEW_SYNC]: '/review/sync',
    [AppRoutes.REVIEW_ASYNC]: '/review/async/:interviewId/task',
    [AppRoutes.AFTER_INTERVIEW]: '/after_interview',
    [AppRoutes.DEFAULT]: '*',
};

export const routeConfig: Record<AppRoutes, AppRoutesProps> = {
    [AppRoutes.START]: {
        path: RoutePath.start,
        element: <CandidateStartPage />,
        authOnly: true,
        roles: [UserRole.candidate],
    },
    [AppRoutes.CANDIDATE_INTERVIEWS]: {
        path: RoutePath.candidate_interviews,
        element: <CandidateInterviewsPage />,
        authOnly: true,
        roles: [UserRole.candidate],
    },
    [AppRoutes.SETTINGS]: {
        path: RoutePath.settings,
        element: <SettingsPage />,
        authOnly: true,
    },
    [AppRoutes.INTERVIEWS]: {
        path: RoutePath.interviews,
        element: <InterviewsPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.VACANCIES]: {
        path: RoutePath.vacancies,
        element: <VacanciesPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.VACANCY_DETAILS]: {
        path: RoutePath.vacancy_details + ':id',
        element: <VacancyDetailsPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.VACANCY_EDIT]: {
        path: RoutePath.vacancy_edit + ':id',
        element: <VacancyEditPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.TASKS]: {
        path: RoutePath.tasks,
        element: <TasksPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.TASK_CREATE]: {
        path: RoutePath.task_create,
        element: <CreateTaskPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.TASK_DETAILS]: {
        path: RoutePath.task_details + ':taskId',
        element: <TaskDetailsPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.TASK_EDIT]: {
        path: RoutePath.task_edit + ':taskId',
        element: <TaskEditPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.MEETINGS]: {
        path: RoutePath.meetings,
        element: <MeetingsPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.INTERVIEW_CREATE]: {
        path: RoutePath.interview_create,
        element: <CreateInterviewPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.INTERVIEW]: {
        path: RoutePath.interview + '/:interviewId',
        element: <InterviewPage />,
        authOnly: true,
    },
    [AppRoutes.INTERVIEW_INFO]: {
        path: RoutePath.interview_info + ':interviewSolutionId',
        element: <InterviewInfoPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.INTERVIEW_DETAILS]: {
        path: RoutePath.interview_details + ':interviewSolutionId',
        element: <CandidateInterviewInfoPage />,
        authOnly: true,
        roles: [UserRole.candidate],
    },
    [AppRoutes.AFTER_INTERVIEW]: {
        path: RoutePath.after_interview,
        element: <AfterInterviewPage />,
        authOnly: true,
    },
    [AppRoutes.REVIEW_SYNC]: {
        path: RoutePath.review_sync + '/:interviewId',
        element: <SyncReviewPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.REVIEW_ASYNC]: {
        path: RoutePath.review_async,
        element: <AsyncReviewPage />,
        authOnly: true,
        roles: [UserRole.admin, UserRole.interviewer, UserRole.hrManager],
    },
    [AppRoutes.LOGIN]: {
        path: RoutePath.login,
        element: <LoginPage />,
    },
    [AppRoutes.REGISTER]: {
        path: RoutePath.register + ':invite',
        element: <RegisterPage />,
    },
    [AppRoutes.DEFAULT]: {
        path: RoutePath.default,
        element: <RedirectToDefaultPage />,
    },
};
