import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export const mapLanguageToString: Record<ProgrammingLanguage, string> = {
    [ProgrammingLanguage.javaScript]: 'javascript',
    [ProgrammingLanguage.csharp]: 'csharp',
    [ProgrammingLanguage.unknown]: '',
};
