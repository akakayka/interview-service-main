export interface LoginForm {
    email: string;
    password: string;
}

export interface LoginFormSchema {
    isLoading: boolean;
    error?: string;
    data: LoginForm;
}
