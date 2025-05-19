import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getUserRole, UserRole } from 'entities/User';
import { Navigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';

export const RedirectToDefaultPage = memo(() => {
    const mapRoleToPath: Record<UserRole, string> = useMemo(
        () => ({
            [UserRole.admin]: RoutePath.interviews,
            [UserRole.hrManager]: RoutePath.interviews,
            [UserRole.interviewer]: RoutePath.interviews,
            [UserRole.candidate]: RoutePath.start,
        }),
        [],
    );

    const role = useSelector(getUserRole);
    const path = role ? mapRoleToPath[role] : RoutePath.login;

    return <Navigate to={path} />;
});
