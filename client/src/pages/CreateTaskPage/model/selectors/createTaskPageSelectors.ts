import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema.ts';

export const getCreateTaskPageIsLoading = (state: StateSchema) => state.createTaskPage?.isLoading;
export const getCreateTaskPageSuccess = (state: StateSchema) => state.createTaskPage?.success;
export const getCreateTaskPageError = (state: StateSchema) => state.createTaskPage?.error || '';
export const getCreateTaskPageForm = (state: StateSchema) => state.createTaskPage?.createTaskForm;
export const getCreateTaskPageFormTaskText = (state: StateSchema) =>
    state.createTaskPage?.createTaskForm.taskText || '';
export const getCreateTaskPageFormStartCode = (state: StateSchema) =>
    state.createTaskPage?.createTaskForm.startCode || '';
export const getCreateTaskPageFormName = (state: StateSchema) =>
    state.createTaskPage?.createTaskForm.name || '';
export const getCreateTaskPageFormTestsCode = (state: StateSchema) =>
    state.createTaskPage?.createTaskForm.testsCode || '';
export const getCreateTaskPageFormRunAttempts = (state: StateSchema) =>
    state.createTaskPage?.createTaskForm.runAttempts || '';
export const getCreateTaskPageFormLanguage = (state: StateSchema) =>
    state.createTaskPage?.createTaskForm.programmingLanguage || '';
