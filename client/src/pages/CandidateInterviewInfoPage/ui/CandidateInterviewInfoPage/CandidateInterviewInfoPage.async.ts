import { lazy } from 'react';

export const CandidateInterviewInfoPageAsync = lazy(
    () => import('./CandidateInterviewInfoPage.tsx'),
);
