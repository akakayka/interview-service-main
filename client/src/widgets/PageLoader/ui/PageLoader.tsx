import cls from './PageLoader.module.scss';
import { Loader } from 'shared/ui/Loader/Loader.tsx';
import { classNames } from 'shared/lib/classNames/classNames.ts';

interface PageLoaderProps {
    className?: string;
}

export const PageLoader = ({ className }: PageLoaderProps) => (
    <div className={classNames(cls.PageLoader, {}, [className])}>
        <Loader />
    </div>
);
