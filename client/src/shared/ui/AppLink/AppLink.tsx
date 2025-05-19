import { classNames, Mods } from 'shared/lib/classNames/classNames';
import { memo, ReactNode } from 'react';
import cls from './AppLink.module.scss';
import { Link, LinkProps } from 'react-router-dom';

export type AppLinkTheme = 'normal' | 'clear';

interface AppLinkProps extends LinkProps {
    className?: string;
    children?: ReactNode;
    max?: boolean;
    focused?: boolean;
    theme?: AppLinkTheme;
}

export const AppLink = memo((props: AppLinkProps) => {
    const {
        to,
        className,
        max = false,
        children,
        focused,
        theme = 'normal',
        ...otherProps
    } = props;

    const mods: Mods = {
        [cls.focused]: focused,
        [cls.max]: max,
    };

    return (
        <Link
            to={to}
            className={classNames(cls.AppLink, mods, [className, cls[theme]])}
            {...otherProps}
        >
            {children}
        </Link>
    );
});
