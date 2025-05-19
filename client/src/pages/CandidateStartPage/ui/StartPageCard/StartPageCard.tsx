import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useEffect } from 'react';
import cls from './StartPageCard.module.scss';
import { Card, CardSize } from 'shared/ui/Card/Card.tsx';
import { VStack } from 'shared/ui/Stack';
import { Text } from 'shared/ui/Text/Text.tsx';
import { Button } from 'shared/ui/Button/Button.tsx';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import {
    getCandidateStartPageError,
    getCandidateStartPageIsLoading,
    getInterviewSolutionInfo,
} from '../../model/selectors/candidateStartPageSelectors.ts';
import { startInterview } from '../../model/services/startInterview/startInterview.ts';
import { useFormSubmitOnEnter } from 'shared/lib/hooks/useFormSubmitOnEnter/useFormSubmitOnEnter.ts';
import { convertTimeMsToString } from 'shared/lib/time/convertTimeMsToString.ts';
import { toast } from 'react-toastify';

interface StartPageCardProps {
    className?: string;
}

const subtitle = 'Предварительная информация';
const paragraphs = [
    'Вам будет предложено выполнить серию задач, которые помогут нам оценить ваше умение писать код, понимание основ языка и способность решать проблемы.',
    'После нажатия кнопки “Приступить к выполнению” Вам откроется тестовое задание, которое нужно решить до срока, указанного ниже.',
    'Желаем Вам удачи =)',
];

export const StartPageCard = memo((props: StartPageCardProps) => {
    const { className } = props;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector(getCandidateStartPageIsLoading);
    const error = useSelector(getCandidateStartPageError);

    useEffect(() => {
        if (error === 'Request failed with status code 409 ERR_BAD_REQUEST') {
            toast.info('У вас нет текущего интервью, ожидайте приглашения');
            navigate('/my_interviews');
        }
    }, [error, navigate]);

    const interview = useSelector(getInterviewSolutionInfo);

    useEffect(() => {
        if (!interview || isLoading) return;
        if (interview?.isSubmittedByCandidate) {
            navigate(RoutePath.after_interview);
            return;
        }
        if (interview?.isStarted) {
            navigate(`${RoutePath.interview}/${interview.id}`);
        }
    }, [
        interview,
        interview?.id,
        interview?.isStarted,
        interview?.isSubmittedByCandidate,
        isLoading,
        navigate,
    ]);

    const onClickHandler = useCallback(async () => {
        if (!interview) return;
        if (!interview.isStarted) {
            await dispatch(startInterview(interview.id)).then((result) => {
                if (result.meta.requestStatus !== 'fulfilled') {
                    return;
                }
            });
        }
        navigate(`${RoutePath.interview}/${interview.id}`);
    }, [dispatch, interview, navigate]);

    useFormSubmitOnEnter({
        inputsValid: true,
        callback: onClickHandler,
    });

    const content = (
        <>
            <VStack
                max
                gap="16"
                justify={'between'}
                className={cls.content}
            >
                <VStack
                    gap="16"
                    max
                >
                    <h2 className={cls.subtitle}>{subtitle}</h2>
                    {paragraphs.map((paragraph) => (
                        <Text
                            text={paragraph}
                            key={paragraph}
                        />
                    ))}
                    {interview?.interviewText && (
                        <>
                            <Text
                                size={'lg'}
                                weight={'semibold'}
                                text={'Дополнительная информация:'}
                            />
                            <Text text={interview.interviewText} />
                        </>
                    )}
                </VStack>
                <VStack
                    gap="16"
                    max
                >
                    {interview && (
                        <Text
                            variant={'dark_red'}
                            text={`Заканчивается: ${convertTimeMsToString(interview?.endTimeMs ?? 0)}`}
                        />
                    )}
                    <Button
                        disabled={isLoading}
                        onClick={onClickHandler}
                    >
                        <Text
                            variant={'white'}
                            text={'Приступить к выполнению'}
                        />
                    </Button>
                </VStack>
            </VStack>
        </>
    );

    return (
        <Card
            title={interview?.vacancy}
            className={classNames(cls.StartPageCard, {}, [className])}
            size={CardSize.L}
        >
            {content}
        </Card>
    );
});
