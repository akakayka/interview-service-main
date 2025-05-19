import { UserRole } from './userRole.ts';

export interface UserSession {
    aud?: string;
    email?: string;
    exp?: string;
    role?: UserRole;
    iss?: string;
    nbf?: string;
    sub?: string;
}
