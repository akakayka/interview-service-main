import { Route, Routes } from 'react-router-dom';
import { RequireAuth } from 'app/providers/router/ui/RequireAuth';
import { memo, Suspense, useCallback } from 'react';
import { AppRoutesProps, routeConfig } from 'app/providers/router/routeConfig.tsx';
import { PageLoader } from 'widgets/PageLoader';

const AppRouter = () => {
    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const element = <Suspense fallback={<PageLoader />}>{route.element}</Suspense>;

        return (
            <Route
                key={route.path}
                path={route.path}
                element={
                    route.authOnly ? (
                        <RequireAuth roles={route.roles}>{element}</RequireAuth>
                    ) : (
                        element
                    )
                }
            />
        );
    }, []);

    return <Routes>{Object.values(routeConfig).map(renderWithWrapper)}</Routes>;
};

export default memo(AppRouter);
