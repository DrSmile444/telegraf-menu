import { KeyboardButton, MenuFilters } from '../../src';
import { LanguageType, MenuAction } from '../interfaces';

export const VIDEO_FILTERS: MenuFilters = [
    new KeyboardButton('Start', 'start', true),
    new KeyboardButton('2 Year', '2 year'),
    new KeyboardButton('1 Year', '1 year'),
    new KeyboardButton('3 Month', '3 month'),
    new KeyboardButton('Now', 'now', true),
];

export const FRUITS_FILTERS: MenuFilters[] = [
    [
        new KeyboardButton('🍏 Apple', 'apple'),
        new KeyboardButton('🍐 Pears', 'pears'),
        new KeyboardButton('🟠 Oranges', 'oranges'),
    ],
    [
        new KeyboardButton('🍋 Limes', 'limes'),
        new KeyboardButton('🍌 Bananas', 'banana'),
        new KeyboardButton('🍓 Strawberries', 'strawberries'),
    ],
];

export const LANGUAGE_FILTERS: MenuFilters<LanguageType> = [
    new KeyboardButton(LanguageType.EN, LanguageType.EN, true),
    new KeyboardButton(LanguageType.RU, LanguageType.RU),
    new KeyboardButton(LanguageType.UA, LanguageType.UA),
];

export const START_MENU_FILTERS: MenuFilters<MenuAction>[] = [
    [
        new KeyboardButton('menu.start.button.basket', MenuAction.BASKET),
        new KeyboardButton('menu.start.button.basketObject', MenuAction.BASKET_OBJECT),
    ],
    [
        new KeyboardButton('menu.start.button.videoFilters', MenuAction.VIDEO_FILTERS),
        new KeyboardButton('menu.start.button.language', MenuAction.LANGUAGE),
    ],
];
