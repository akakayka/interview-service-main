import { classNames } from 'shared/lib/classNames/classNames.ts';
import { memo, useEffect } from 'react';
import cls from './MeetingsPage.module.scss';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader.tsx';
import { useInitialEffect } from 'shared/lib/hooks/useInitialEffect/useInitialEffect.ts';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch.ts';
import { useSelector } from 'react-redux';
import { sidebarActions } from 'widgets/Sidebar';
import { Page } from 'widgets/Page';
import { MeetingsList } from 'widgets/MeetingsList';
import { meetingsPageReducer } from '../../model/slice/meetingsPageSlice.ts';
import { fetchMeetingsList } from '../../model/services/fetchMeetingsList/fetchMeetingsList.ts';
import {
    getMeetingsPageError,
    getMeetingsPageMeetings,
} from '../../model/selectors/meetingsPageSelectors.ts';
import { MeetingInfo } from '../../model/types/meetings.ts';
import { toast } from 'react-toastify';

interface MeetingsPageProps {
    className?: string;
}

const reducers: ReducersList = {
    meetingsPage: meetingsPageReducer,
};

const MeetingsPage = memo((props: MeetingsPageProps) => {
    const { className } = props;
    const dispatch = useAppDispatch();
    const error = useSelector(getMeetingsPageError);

    useInitialEffect(() => {
        dispatch(sidebarActions.setVisible(true));
        dispatch(sidebarActions.setCollapsed(false));
        dispatch(fetchMeetingsList());
    });

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const meetings = useSelector(getMeetingsPageMeetings) as MeetingInfo[];

    return (
        <DynamicModuleLoader reducers={reducers}>
            <Page
                title="Встречи"
                className={classNames(cls.MeetingsPage, {}, [className])}
            >
                <div className={cls.content}>
                    <MeetingsList
                        items={meetings}
                        enableSearch
                    />
                </div>
            </Page>
        </DynamicModuleLoader>
    );
});

export default MeetingsPage;
