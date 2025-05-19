import { ReviewInfo } from 'pages/SyncReviewPage';

export interface CandidateInterviewInfoSchema {
    isLoading: boolean;
    error?: string;
    interviewInfo?: ReviewInfo;
}
