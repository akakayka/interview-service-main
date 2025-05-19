import { SelectOption } from 'shared/ui/Select/ui/SelectOption/SelectOption.tsx';
import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export const createTaskOptions: SelectOption[] = [
    {
        title: 'C#',
        value: ProgrammingLanguage.csharp,
    },
    {
        title: 'JavaScript',
        value: ProgrammingLanguage.javaScript,
    },
];
