import { classNames } from 'shared/lib/classNames/classNames.ts';
import { memo, ReactNode } from 'react';
import cls from './Page.module.scss';
import { FlexAlign, FlexJustify } from 'shared/ui/Stack/Flex/Flex.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { HStack } from 'shared/ui/Stack';
import ArrowBack from 'shared/assets/icons/arrowL.svg';
import { Button } from 'shared/ui/Button/Button.tsx';

interface PageProps {
    className?: string;
    children: ReactNode;
    align?: FlexAlign;
    justify?: FlexJustify;
    title?: string;
    withBackButton?: boolean;
    backButtonAction?: () => void;
}

export const Page = memo((props: PageProps) => {
    const { className, children, title, withBackButton = false, backButtonAction } = props;

    return (
        <main className={classNames(cls.Page, {}, [className])}>
            {title ? (
                <>
                    <HStack
                        gap={'16'}
                        className={cls.title}
                        align={'center'}
                    >
                        {withBackButton && (
                            <Button
                                variant={'clear'}
                                onClick={() => {
                                    if (backButtonAction) {
                                        backButtonAction();
                                    } else {
                                        window.history.back();
                                    }
                                }}
                            >
                                <ArrowBack />
                            </Button>
                        )}
                        <Text
                            text={title}
                            weight={'semibold'}
                            size={'display_md'}
                        />
                    </HStack>
                    <>{children}</>
                </>
            ) : (
                <>{children}</>
            )}
        </main>
    );
});
