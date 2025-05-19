import { classNames, Mods } from 'shared/lib/classNames/classNames';
import { memo, useMemo } from 'react';
import cls from './SidebarItem.module.scss';
import { SidebarItemType } from '../../model/types/sidebar.ts';
import { AppLink } from 'shared/ui/AppLink/AppLink.tsx';
import { useLocation } from 'react-router-dom';
import { Text } from 'shared/ui/Text/Text.tsx';

interface SidebarItemProps {
    className?: string;
    item: SidebarItemType;
    collapsed: boolean;
    onClick?: () => void;
}

export const SidebarItem = memo((props: SidebarItemProps) => {
    const { className, item, collapsed, onClick } = props;

    const location = useLocation();

    const isCurrentLocation = useMemo(
        () => location.pathname.includes(item.path),
        [item.path, location.pathname],
    );

    const mods: Mods = {
        [cls.collapsed]: collapsed,
        [cls.focused]: isCurrentLocation,
    };

    return (
        <AppLink
            className={classNames(cls.SidebarItem, mods, [className])}
            to={item.path}
            max={!collapsed}
            onClick={onClick}
        >
            <item.Icon />
            {!isCurrentLocation && (
                <Text
                    text={item.text}
                    className={cls.link}
                    variant={'gray'}
                />
            )}
            {isCurrentLocation && (
                <Text
                    text={item.text}
                    className={cls.link}
                />
            )}
        </AppLink>
    );
});
