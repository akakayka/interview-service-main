import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './SettingsPage.module.scss';
import { Page } from 'widgets/Page';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';

interface SettingsPageProps {
    className?: string;
}

const SettingsPage = memo((props: SettingsPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
    });

    return (
        <Page className={classNames(cls.SettingsPage, {}, [className])}>
            CANDIDATE SETTINGS PAGE
        </Page>
    );
});

export default SettingsPage;
