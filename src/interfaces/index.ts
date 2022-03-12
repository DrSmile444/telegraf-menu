import { I18n, I18nContext, TemplateData } from '@edjopato/telegraf-i18n';
import { Context, NarrowedContext } from 'telegraf';

import { GenericMenu } from '../generic-menu';
import { KeyboardButton } from '../keyboard-button';
import { CheckboxMenu, RadioMenu, RangeMenu, RegularMenu } from '../menus';

export type GenericState = string[] | string | Record<any, any>;
export interface GenericConfig<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends GenericState = GenericState,
    TMenu extends GenericMenu = GenericMenu,
    TValue extends string = string,
> {
    action: string;
    message: string;
    submitMessage?: string;
    filters: MenuFilters<TValue> | MenuFilters<TValue>[];
    state?: TState;
    debug?: boolean;
    replaceable?: boolean;
    type?: unknown;
    menuGetter?(menuCtx: TCtx): GenericMenu;
    menuSetter?(menuCtx: TCtx, menu: TMenu): any;
    onChange?(changeCtx: MenuContextUpdate<TCtx>, state: TState): any;
    beforeChange?(changeCtx: MenuContextUpdate<TCtx>, state: TState): any;
    onSubmit?(submitCtx: MenuContextUpdate<TCtx>, state: TState): any;
    onSubmitUpdater?(submitCtx: MenuContextUpdate<TCtx>, messageId: number, state: TState): any;
}

export interface RegularMenuConfig<TCtx extends DefaultCtx = DefaultCtx, TValue extends string = string> extends
    Omit<
        GenericConfig<TCtx, string, RegularMenu<TCtx, TValue>, TValue>,
        'state' | 'onSubmit' | 'beforeChange' | 'onSubmitUpdater' | 'submitMessage' | 'onChange'
    > {
    onChange?(changeCtx: MenuContextUpdate<TCtx>, state: TValue): any;
}

export interface RadioConfig<TCtx extends DefaultCtx = DefaultCtx, TState extends string = string, TValue extends string = string> extends
    GenericConfig<TCtx, TState, RadioMenu<TCtx, TState>, TValue> {}

export interface RangeConfig<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends RangeState<TValue> = RangeState<any>,
    TValue extends string = string,
> extends GenericConfig<TCtx, TState, RangeMenu<TCtx, TState>, TValue> {}

export interface CheckboxConfig<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends string[] | Record<any, any> = string[] | Record<any, any>,
    TValue extends string = string,
    // @ts-ignore
> extends GenericConfig<TCtx, TState, CheckboxMenu<TCtx, TState>, TValue> {
    invertedSelection?: boolean;
}

export type MenuFilters<TValue extends string = string> = KeyboardButton<TValue>[];

export interface RangeState<TValue extends string | number = string> {
    from?: TValue;
    to?: TValue;
}

/**
 * Full types
 * */

export interface MenuOption<TValue> {
    action: string;
    value: TValue;
    isDefault?: boolean;
}

/**
 * Short types for callback data
 * */

export interface MenuOptionShort<TValue> {
    a: string;
    v: TValue;
    d?: 1 | 0;
}

export type I18nOverride = I18n & {
    locale(languageCode: string): void;
    t(resourceKey: string, templateData?: Readonly<TemplateData>): string;
};

export type DefaultCtx = NarrowedContext<Context<any> & { match: RegExpExecArray; }, any> & {
    i18n?: I18nContext;
};

export type MenuContextUpdate<TCtx extends DefaultCtx = DefaultCtx, TValue extends string = string> = {
    state: {
        callbackData: MenuOption<TValue>;
    };
} & TCtx;
