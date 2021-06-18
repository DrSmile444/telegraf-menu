import { DefaultCtx, I18nOverride, KeyboardMenu } from '../../src';

export enum MenuAction {
    BASKET = 'basket',
    VIDEO_FILTERS = 'video_filters',
}

export enum VideoFilterType {
    FROM = 'from',
    TO = 'to',
}

export enum FruitsFilterType {
    FRUIT = 'fruit',
}

export interface VideoFilters {
    [VideoFilterType.FROM]: string;
    [VideoFilterType.TO]: string;
}

export interface Basket {
    [FruitsFilterType.FRUIT]: string[];
}

export type CurrentCtx = DefaultCtx & {
    i18n: I18nOverride;
    session: {
        videoFilters: {
            from: string;
            to: string;
        },
        basket: Basket;
        keyboardMenu: KeyboardMenu,
    },
};
