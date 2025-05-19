import { classNames } from 'shared/lib/classNames/classNames';
import { memo } from 'react';
import cls from './VacancyListItem.module.scss';
import { Tab } from 'shared/ui/Tab/Tab.tsx';
import { Text } from 'shared/ui/Text/Text.tsx';
import { HStack, VStack } from 'shared/ui/Stack';
import { InterviewInfo } from '/widgets/MeetingsList';
import { convertTimeMsToHours } from 'shared/lib/time/convertTimeMsToString.ts';
import { AppLink } from 'shared/ui/AppLink/AppLink.tsx';
import { RoutePath } from 'app/providers/router/routeConfig.tsx';

interface VacancyListItemProps {
    className?: string;
    item: InterviewInfo;
}

export const VacancyListItem = memo((props: VacancyListItemProps) => {
    const { className, item } = props;

    return (
        <AppLink
            to={`${RoutePath.vacancy_details}${item.id}`}
            theme={'clear'}
        >
            <Tab className={classNames(cls.VacancyListItem, {}, [className])}>
                <VStack
                    max
                    gap={'8'}
                >
                    <Text
                        text={item.vacancy}
                        variant={'accent'}
                        className={cls.title}
                        size={'lg'}
                        weight={'semibold'}
                    />
                    <HStack gap={'8'}>
                        <Text
                            text={'Длительность:'}
                            variant={'accent'}
                            size={'sm'}
                        />
                        <Text
                            text={convertTimeMsToHours(item.interviewDurationMs)}
                            variant={'accent'}
                            size={'sm'}
                        />
                    </HStack>
                </VStack>
            </Tab>
        </AppLink>
    );
});
