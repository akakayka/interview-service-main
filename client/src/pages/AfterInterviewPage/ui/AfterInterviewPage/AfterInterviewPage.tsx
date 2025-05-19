import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useState } from 'react';
import cls from './AfterInterviewPage.module.scss';
import { Page } from 'widgets/Page';
import { Modal } from 'shared/ui/Modal/Modal.tsx';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { sidebarActions } from 'widgets/Sidebar';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';

interface AfterInterviewPageProps {
    className?: string;
}

const AfterInterviewPage = memo((props: AfterInterviewPageProps) => {
    const { className } = props;
    const [isOpen, setIsOpen] = useState(true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
    });

    const onClose = () => {
        setIsOpen(false);
        navigate('/my_interviews');
    };

    return (
        <Page className={classNames(cls.AfterInterviewPage, {}, [className])}>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
            >
                <VStack gap={'32'}>
                    <Text
                        text={'Спасибо за участие в тестовом задании!'}
                        size={'display_sm'}
                        weight={'semibold'}
                    />
                    <VStack gap={'16'}>
                        <Text
                            text={
                                'Ваше тестовое задание было успешно отправлено! Проверка решений займет некоторое время.'
                            }
                        />
                        <Text
                            text={
                                'Если у вас возникнут какие-либо вопросы, не стесняйтесь связаться с нами!'
                            }
                        />
                    </VStack>
                    <Button onClick={onClose}>
                        <Text
                            variant={'white'}
                            text={'Закрыть'}
                        />
                    </Button>
                </VStack>
            </Modal>
        </Page>
    );
});

export default AfterInterviewPage;
