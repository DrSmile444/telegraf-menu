import { DefaultCtx, KeyboardMenu } from '../../src';

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
    session: {
        videoFilters: {
            from: string;
            to: string;
        },
        basket: Basket;
        keyboardMenu: KeyboardMenu,
    },
};
