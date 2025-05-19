export enum UserRole {
    candidate = 'Candidate',
    interviewer = 'Interviewer',
    hrManager = 'HrManager',
    admin = 'Admin',
}

export const ReviewRoles: UserRole[] = [UserRole.admin, UserRole.hrManager, UserRole.interviewer];

export const ContestRoles: UserRole[] = [UserRole.candidate];
