import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './RegisterPage.module.scss';
import { Page } from 'widgets/Page';
import { RegisterForm } from 'features/RegisterForm';
import { useParams } from 'react-router-dom';
import { VStack } from 'shared/ui/Stack';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { Text } from 'shared/ui/Text/Text.tsx';

interface RegisterPageProps {
    className?: string;
}

const RegisterPage = memo((props: RegisterPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(false));
        console.log('register page');
    });

    const { invite } = useParams<{ invite: string }>();

    return (
        <Page className={classNames(cls.RegisterPage, {}, [className])}>
            <VStack
                max
                justify={'center'}
                align={'center'}
            >
                <VStack
                    gap={'16'}
                    align={'center'}
                    className={cls.container}
                >
                    <Text
                        className={cls.title}
                        size={'display_md'}
                        weight={'semibold'}
                        text={'Заполните информацию о себе'}
                    />
                    <Text
                        className={cls.text}
                        size={'md'}
                        text={
                            'Похоже, Вы у нас впервые! Для того, чтобы начать проходить тестовые задания, нужно заполнить данные о себе'
                        }
                        align={'center'}
                    />
                    <RegisterForm
                        className={cls.form}
                        invite={invite}
                    />
                </VStack>
            </VStack>
        </Page>
    );
});

export default RegisterPage;
