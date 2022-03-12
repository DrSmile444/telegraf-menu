import { I18nContext } from '@edjopato/telegraf-i18n';

import { DefaultCtx, GenericMenu } from '../../src';

export enum MenuAction {
    BASKET = 'basket',
    BASKET_OBJECT = 'basket_object',
    VIDEO_FILTERS = 'video_filters',
    LANGUAGE = 'language',
    START = 'start',
}

export enum VideoFilterType {
    FROM = 'from',
    TO = 'to',
}

export enum FruitsFilterType {
    FRUIT = 'fruit',
    FRUIT_OBJECT = 'fruit_object',
}

export enum LanguageType {
    EN = 'en',
    RU = 'ru',
    UA = 'ua',
}

export interface VideoFilters {
    [VideoFilterType.FROM]: string;
    [VideoFilterType.TO]: string;
}

export interface Basket {
    [FruitsFilterType.FRUIT]: string[];
    [FruitsFilterType.FRUIT_OBJECT]: Record<string, boolean>;
}

export type CurrentCtx = DefaultCtx & {
    i18n: I18nContext;
    session: {
        videoFilters: {
            from: string;
            to: string;
        },
        language: LanguageType,
        basket: Basket;
        keyboardMenu: GenericMenu,
    },
};
