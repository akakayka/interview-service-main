import { classNames } from 'shared/lib/classNames/classNames.ts';
import AppRouter from 'app/providers/router/ui/AppRouter.tsx';
import { Suspense } from 'react';
import { Sidebar } from 'widgets/Sidebar';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { getUserInited, userActions } from 'entities/User';
import { useSelector } from 'react-redux';
import { NotificationService } from 'shared/api/notificationService.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { PageLoader } from 'widgets/PageLoader';

function App() {
    const dispatch = useAppDispatch();
    const inited = useSelector(getUserInited);

    useInitialEffect(() => {
        dispatch(userActions.init());
        const connection = new NotificationService();
        connection.startConnection('notification');
    });

    return (
        <div
            className={classNames('app')}
            id={'app'}
        >
            <Suspense fallback={<PageLoader />}>
                <div className="content-page">
                    <Sidebar />
                    {inited && <AppRouter />}
                </div>
            </Suspense>
        </div>
    );
}

export default App;
