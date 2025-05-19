import { JWTSession } from './JWTSession.ts';
import { UserRole } from './userRole.ts';
import { UserSession } from './userSession.ts';

export interface User {
    email: string;
    passwordHash: string;
}

export interface UserSchema {
    session: JWTSession;
    role?: UserRole;
    userSession?: UserSession;
    _inited: boolean;
}
