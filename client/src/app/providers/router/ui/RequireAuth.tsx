import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { getUserRole, getUserSession, UserRole } from 'entities/User';
import { RedirectToDefaultPage } from 'features/RedirectToDefaultPage';

interface RequireAuthProps {
    children: JSX.Element;
    roles?: UserRole[];
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
    const auth = useSelector(getUserSession);
    const location = useLocation();
    const role = useSelector(getUserRole);

    const hasRequiredRoles = useMemo(() => {
        if (!roles) {
            return true;
        }

        return roles.some((requiredRole) => requiredRole === role);
    }, [role, roles]);

    if (!auth.accessToken) {
        return (
            <Navigate
                to={RoutePath.login}
                state={{ from: location }}
                replace
            />
        );
    }

    if (!hasRequiredRoles) {
        return <RedirectToDefaultPage />;
    }

    return children;
}
