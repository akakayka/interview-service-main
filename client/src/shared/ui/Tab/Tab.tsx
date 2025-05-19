import { classNames } from 'shared/lib/classNames/classNames';
import { memo, ReactNode } from 'react';
import cls from './Tab.module.scss';

interface TabProps {
    className?: string;
    children: ReactNode;
}

export const Tab = memo((props: TabProps) => {
    const { className, children } = props;

    return <div className={classNames(cls.Tab, {}, [className])}>{children}</div>;
});
