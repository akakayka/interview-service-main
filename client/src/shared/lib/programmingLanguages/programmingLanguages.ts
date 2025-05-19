import { ProgrammingLanguage } from 'shared/consts/ProgrammingLanguage.ts';

export function convertProgrammingLanguageToString(language: ProgrammingLanguage): string {
    switch (language) {
        case ProgrammingLanguage.csharp:
            return 'C#';
        case ProgrammingLanguage.javaScript:
            return 'JavaScript';
        default:
            return 'Не указан';
    }
}
