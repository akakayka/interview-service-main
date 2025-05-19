import { UserRole } from 'entities/User';

export const mapRoleToString: Record<UserRole, string> = {
    [UserRole.admin]: 'Администратор',
    [UserRole.candidate]: 'Кандидат',
    [UserRole.hrManager]: 'HR-менеджер',
    [UserRole.interviewer]: 'Интервьюер',
};
