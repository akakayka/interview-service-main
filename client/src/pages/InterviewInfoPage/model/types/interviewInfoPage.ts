import { ReviewInfo } from 'pages/SyncReviewPage';

export interface InterviewInfoPageSchema {
    isLoading: boolean;
    error?: string;
    interviewInfo: ReviewInfo;
    comment: string;
}
