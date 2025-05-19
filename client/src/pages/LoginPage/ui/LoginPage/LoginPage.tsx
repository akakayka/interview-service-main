import { classNames } from 'shared/lib/classNames/classNames.ts';
import { memo } from 'react';
import cls from './LoginPage.module.scss';
import { LoginForm } from 'features/LoginForm';
import { Page } from 'widgets/Page';
import { VStack } from 'shared/ui/Stack';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { Text } from 'shared/ui/Text/Text.tsx';
import { useSearchParams } from 'react-router-dom';

interface CandidateLoginPageProps {
    className?: string;
}

const LoginPage = memo((props: CandidateLoginPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const [params] = useSearchParams();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(false));
    });

    return (
        <Page className={classNames(cls.LoginPage, {}, [className])}>
            <VStack
                max
                justify={'center'}
                align={'center'}
                gap={'32'}
            >
                <VStack
                    gap={'16'}
                    align={'center'}
                >
                    <Text
                        size={'display_md'}
                        weight={'semibold'}
                        align={'center'}
                        text={'Авторизация'}
                    />
                    <LoginForm invite={params.get('invite')} />
                </VStack>
            </VStack>
        </Page>
    );
});

export default LoginPage;
