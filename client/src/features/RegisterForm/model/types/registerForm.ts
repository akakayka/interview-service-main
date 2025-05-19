export interface RegisterForm {
    email: string;
    firstName: string;
    surname: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterFormSchema {
    isLoading: boolean;
    error?: string;
    data: RegisterForm;
}
