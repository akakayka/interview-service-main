import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useMemo } from 'react';
import cls from './Sidebar.module.scss';
import { getSidebarItems } from '../../model/selectors/getSidebarItems.ts';
import { SidebarItem } from '../SidebarItem/SidebarItem.tsx';
import { HStack, VStack } from 'shared/ui/Stack';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { getUserRole, getUserSession, userActions } from 'entities/User';
import { useSelector } from 'react-redux';
import { getSidebarCollapsed, getSidebarVisible } from '../../model/selectors/sidebarSelectors.ts';
import { Text } from 'shared/ui/Text/Text.tsx';
import LogoutIcon from 'shared/assets/icons/logout.svg';
import { SidebarItemType } from '../../model/types/sidebar.ts';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { mapRoleToString } from '../../consts/mapRoleToString.ts';

interface SidebarProps {
    className?: string;
}

export const Sidebar = memo((props: SidebarProps) => {
    const { className } = props;
    const sidebarItemsList = useSelector(getSidebarItems);
    const dispatch = useAppDispatch();
    const collapsed = useSelector(getSidebarCollapsed);
    const visible = useSelector(getSidebarVisible);
    const role = useSelector(getUserRole);
    const { fullName } = useSelector(getUserSession);

    const logout = useCallback(() => {
        if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
            dispatch(userActions.clearToken());
        }
    }, [dispatch]);

    const itemsList = useMemo(
        () =>
            sidebarItemsList.map((item) => (
                <SidebarItem
                    item={item}
                    key={item.path}
                    collapsed={collapsed}
                />
            )),
        [collapsed, sidebarItemsList],
    );

    const logoutButton: SidebarItemType = {
        path: RoutePath.login,
        Icon: LogoutIcon,
        text: 'Выход',
    };

    if (!visible) {
        return null;
    }

    return (
        <aside className={classNames(cls.Sidebar, { [cls.collapsed]: collapsed }, [className])}>
            <VStack className={cls.logo}>
                <Text
                    className={cls.title}
                    size={'display_xs'}
                    weight={'semibold'}
                    text={'66bit'}
                    variant={'accent'}
                />
                <Text
                    className={cls.subtitle}
                    size={'md'}
                    text={'code.rev'}
                    family={'montserrat'}
                    variant={'accent'}
                />
            </VStack>
            <VStack
                role="navigation"
                gap="16"
                className={cls.items}
            >
                {itemsList}
                {role && (
                    <SidebarItem
                        item={logoutButton}
                        collapsed={collapsed}
                        onClick={logout}
                        className={cls.logout}
                    />
                )}
            </VStack>
            {role && (
                <HStack
                    className={cls.userData}
                    justify="center"
                    align="center"
                    max
                >
                    <VStack className={cls.userNames}>
                        <Text
                            align={'center'}
                            text={fullName || 'Имя Фамилия'}
                            size={'md'}
                            weight={'semibold'}
                        />
                        <Text
                            align={'center'}
                            text={mapRoleToString[role]}
                            size={'md'}
                        />
                    </VStack>
                </HStack>
            )}
        </aside>
    );
});
