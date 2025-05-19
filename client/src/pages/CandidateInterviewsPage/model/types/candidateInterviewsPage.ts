import { CandidateInfo } from 'pages/InterviewsPage';
import { MeetingInfo } from 'pages/MeetingsPage';

export interface CandidateInterviewsPageSchema {
    isLoading: boolean;
    error?: string;
    cards?: CandidateInfo[];
    meets?: MeetingInfo[];
}
