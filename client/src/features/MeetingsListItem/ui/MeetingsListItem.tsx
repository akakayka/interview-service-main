import { classNames } from 'shared/lib/classNames/classNames';
import { memo, useCallback, useMemo } from 'react';
import cls from './MeetingsListItem.module.scss';
import { Text } from 'shared/ui/Text/Text.tsx';
import { convertProgrammingLanguageToString } from 'shared/lib/programmingLanguages/programmingLanguages.ts';
import { Button } from 'shared/ui/Button/Button.tsx';
import { useNavigate } from 'react-router-dom';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';
import { MeetingInfo } from 'pages/MeetingsPage';
import { startInterview } from 'pages/CandidateStartPage';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';

interface MeetingsListItemProps {
    className?: string;
    meeting: MeetingInfo;
    forCandidate?: boolean;
}

export const MeetingsListItem = memo((props: MeetingsListItemProps) => {
    const { className, meeting, forCandidate = false } = props;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const fullName = useMemo(
        () => `${meeting.surname} ${meeting.firstName}`,
        [meeting.firstName, meeting.surname],
    );

    const languages = useMemo(
        () => meeting.programmingLanguages.map((lang) => convertProgrammingLanguageToString(lang)),
        [meeting.programmingLanguages],
    );

    const navigateToMeeting = useCallback(async () => {
        const address = forCandidate
            ? `/interview/${meeting.interviewSolutionId}`
            : `${RoutePath.review_sync}/${meeting.interviewSolutionId}`;
        if (forCandidate) {
            await dispatch(startInterview(meeting.interviewSolutionId)).then((result) => {
                if (result.meta.requestStatus !== 'fulfilled') {
                    return;
                }
            });
        }
        navigate(address);
    }, [dispatch, forCandidate, meeting.interviewSolutionId, navigate]);

    return (
        <div className={classNames(cls.MeetingsListItem, {}, [className])}>
            <Text
                text={fullName}
                variant={'accent'}
                weight={'semibold'}
            />
            <Text
                text={meeting.vacancy}
                variant={'accent'}
            />
            <Text
                text={languages[0]}
                variant={'accent'}
                weight={'semibold'}
            />
            <Button
                variant={'green'}
                onClick={navigateToMeeting}
            >
                <Text
                    variant={'white'}
                    text={'Присоединиться'}
                    align={'center'}
                    weight={'medium'}
                />
            </Button>
        </div>
    );
});
