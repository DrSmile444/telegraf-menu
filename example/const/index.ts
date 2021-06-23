import { KeyboardButton, MenuFilters, MenuGroupFilters } from '../../src';
import { LanguageType, MenuAction } from '../interfaces';

export const VIDEO_FILTERS: MenuFilters = [
    new KeyboardButton('Start', { value: 'start', default: true }),
    new KeyboardButton('2 Year', { value: '2 year' }),
    new KeyboardButton('1 Year', { value: '1 year' }),
    new KeyboardButton('3 Month', { value: '3 month' }),
    new KeyboardButton('Now', { value: 'now', default: true }),
];

export const FRUITS_FILTERS: MenuFilters[] = [
    [
        new KeyboardButton('🍏 Apple', { value: 'apple' }),
        new KeyboardButton('🍐 Pears', { value: 'pears' }),
        new KeyboardButton('🟠 Oranges', { value: 'oranges' }),
    ],
    [
        new KeyboardButton('🍋 Limes', { value: 'limes' }),
        new KeyboardButton('🍌 Bananas', { value: 'banana' }),
        new KeyboardButton('🍓 Strawberries', { value: 'strawberries' }),
    ],
];

export const LANGUAGE_FILTERS: MenuGroupFilters<'language'> = [
    new KeyboardButton(LanguageType.EN, { value: LanguageType.EN, default: true }),
    new KeyboardButton(LanguageType.RU, { value: LanguageType.RU }),
    new KeyboardButton(LanguageType.UA, { value: LanguageType.UA }),
];

export const START_MENU_FILTERS: MenuFilters = [
    new KeyboardButton('menu.start.button.basket', { value: MenuAction.BASKET }),
    new KeyboardButton('menu.start.button.videoFilters', { value: MenuAction.VIDEO_FILTERS }),
    new KeyboardButton('menu.start.button.language', { value: MenuAction.LANGUAGE }),
];
