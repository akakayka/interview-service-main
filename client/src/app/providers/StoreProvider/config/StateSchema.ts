import { EnhancedStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { UserSchema } from 'entities/User';
import { SidebarSchema } from 'widgets/Sidebar';
import { LoginFormSchema } from 'features/LoginForm';
import { RegisterFormSchema } from 'features/RegisterForm';
import { CandidateStartPageSchema } from 'pages/CandidateStartPage';
import { AddCandidateSchema } from 'widgets/MeetingsList';
import { InterviewsSchema } from 'pages/InterviewsPage';
import { InterviewPageSchema } from 'pages/InterviewPage';
import { InterviewInfoPageSchema } from 'pages/InterviewInfoPage';
import { InterviewCodeEditorSchema } from 'widgets/InterviewCodeEditor';
import { CreateInterviewPageSchema } from 'pages/CreateInterviewPage';
import { ReviewPageSchema } from 'pages/SyncReviewPage';
import { ReviewCodeEditorSchema } from 'widgets/ReviewCodeEditor';
import { ReviewNotesSchema } from 'widgets/ReviewNotes';
import { TasksSchema } from 'pages/TasksPage';
import { CreateTaskPageSchema } from 'pages/CreateTaskPage';
import { MeetingSchema } from 'pages/MeetingsPage';
import { AsyncReviewPageSchema } from 'pages/AsyncReviewPage';
import { ChatSchema } from 'widgets/Chat';
import { CandidateInterviewsPageSchema } from 'pages/CandidateInterviewsPage';
import { TaskDetailsPageSchema } from 'pages/TaskDetailsPage';
import { CandidateInterviewInfoSchema } from 'pages/CandidateInterviewInfoPage';
import { VacanciesPageSchema } from '/pages/VacanciesPage';
import { VacancyDetailsPageSchema } from '/pages/VacancyDetailsPage';
import { TaskEditPageSchema } from 'pages/TaskEditPage';
import { VacancyEditPageSchema } from '/pages/VacancyEditPage';

export interface StateSchema {
    user: UserSchema;
    sidebar: SidebarSchema;

    loginForm?: LoginFormSchema;
    registerForm?: RegisterFormSchema;
    candidateStartPage?: CandidateStartPageSchema;
    candidateInterviewsPage?: CandidateInterviewsPageSchema;
    candidateInterviewInfoPage?: CandidateInterviewInfoSchema;
    addCandidate?: AddCandidateSchema;
    interviewsPage?: InterviewsSchema;
    interviewPage?: InterviewPageSchema;
    interviewInfoPage?: InterviewInfoPageSchema;
    interviewCodeEditor?: InterviewCodeEditorSchema;
    createInterviewPage?: CreateInterviewPageSchema;
    syncReviewPage?: ReviewPageSchema;
    asyncReviewPage?: AsyncReviewPageSchema;
    reviewCodeEditor?: ReviewCodeEditorSchema;
    reviewNotes?: ReviewNotesSchema;
    tasksPage?: TasksSchema;
    taskDetailsPage?: TaskDetailsPageSchema;
    taskEditPage?: TaskEditPageSchema;
    createTaskPage?: CreateTaskPageSchema;
    meetingsPage?: MeetingSchema;
    vacanciesPage?: VacanciesPageSchema;
    vacancyDetailsPage?: VacancyDetailsPageSchema;
    vacancyEditPage?: VacancyEditPageSchema;
    chat?: ChatSchema;
}

export type StateSchemaKey = keyof StateSchema;
export type MountedReducers = OptionalRecord<StateSchemaKey, boolean>;

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>;
    reduce: any;
    add: (key: StateSchemaKey, reducer: Reducer) => void;
    remove: (key: StateSchemaKey) => void;
}

export interface ReduxStoreWithManager extends EnhancedStore<StateSchema> {
    reducerManager: ReducerManager;
}

export interface ThunkExtraArg {
    api: AxiosInstance;
}

export interface ThunkConfig<T> {
    rejectValue: T;
    extra: ThunkExtraArg;
    state: StateSchema;
}
