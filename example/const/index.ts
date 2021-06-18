import { KeyboardButton, MenuOptionPayload } from '../../src';
import { FruitsFilterType, VideoFilterType } from '../interfaces';

export const VIDEO_FILTERS: KeyboardButton<MenuOptionPayload<VideoFilterType>>[][] = [
    [
        new KeyboardButton('Start', { group: VideoFilterType.FROM, value: 'start', default: true }),
        new KeyboardButton('2 Year', { group: VideoFilterType.FROM, value: '2 year' }),
        new KeyboardButton('1 Year', { group: VideoFilterType.FROM, value: '1 year' }),
        new KeyboardButton('3 Month', { group: VideoFilterType.FROM, value: '3 month' }),
        new KeyboardButton('Now', { group: VideoFilterType.FROM, value: 'now', default: true }),
    ],
];

export const FRUITS_FILTERS: KeyboardButton<MenuOptionPayload<FruitsFilterType>>[][] = [
    [
        new KeyboardButton('🍏 Apple', { group: FruitsFilterType.FRUIT, value: 'apple' }),
        new KeyboardButton('🍐 Pears', { group: FruitsFilterType.FRUIT, value: 'pears' }),
        new KeyboardButton('🟠 Oranges', { group: FruitsFilterType.FRUIT, value: 'oranges' }),
    ],
    [
        new KeyboardButton('🍋 Limes', { group: FruitsFilterType.FRUIT, value: 'limes' }),
        new KeyboardButton('🍌 Bananas', { group: FruitsFilterType.FRUIT, value: 'banana' }),
        new KeyboardButton('🍓 Strawberries', { group: FruitsFilterType.FRUIT, value: 'strawberries' }),
    ],
];
