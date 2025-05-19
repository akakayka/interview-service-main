export type ErrorMessage =
    | 'Задача с таким именем уже есть'
    | 'email or phone number is already registered'
    | 'Интервью с таким именем уже есть';

export const mapErrorToString: Record<ErrorMessage, string> = {
    'Задача с таким именем уже есть': 'Задача с таким именем уже есть',
    'email or phone number is already registered':
        'Пользователь с таким телефоном или почтой уже существует',
    'Интервью с таким именем уже есть': 'Интервью с таким именем уже есть',
};
