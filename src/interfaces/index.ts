import { I18n, I18nContext, TemplateData } from '@edjopato/telegraf-i18n';
import { Context, NarrowedContext } from 'telegraf';

import { GenericMenu } from '../generic-menu';
import { KeyboardButton } from '../keyboard-button';
import { CheckboxMenu, RadioMenu, RangeMenu, RegularMenu } from '../menus';

export type GenericState = string[] | string | object;
export interface GenericConfig<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends GenericState = GenericState,
    TMenu extends GenericMenu = GenericMenu,
> {
    action: string;
    message: string;
    submitMessage?: string;
    filters: MenuFilters | MenuFilters[];
    state?: TState;
    debug?: boolean;
    replaceable?: boolean;
    menuGetter?(menuCtx: TCtx): GenericMenu;
    menuSetter?(menuCtx: TCtx, menu: TMenu): any;
    onChange?(changeCtx: MenuContextUpdate<TCtx>, state: TState): any;
    beforeChange?(changeCtx: MenuContextUpdate<TCtx>, state: TState): any;
    onSubmit?(submitCtx: MenuContextUpdate<TCtx>, state: TState): any;
    onSubmitUpdater?(submitCtx: MenuContextUpdate<TCtx>, messageId: number, state: TState): any;
}

export interface RegularMenuConfig<TCtx extends DefaultCtx = DefaultCtx> extends
    Omit<
        GenericConfig<TCtx, string, RegularMenu<TCtx>>,
        'state' | 'onSubmit' | 'beforeChange' | 'onSubmitUpdater' | 'submitMessage'
    > {}

export interface RadioConfig<TCtx extends DefaultCtx = DefaultCtx, TState extends string = string> extends
    GenericConfig<TCtx, TState, RadioMenu<TCtx, TState>> {}

export interface RangeConfig<TCtx extends DefaultCtx = DefaultCtx, TState extends RangeState = RangeState> extends
    GenericConfig<TCtx, TState, RangeMenu<TCtx, TState>> {}

export interface CheckboxConfig<TCtx extends DefaultCtx = DefaultCtx, TState extends string[] = string[]> extends
    GenericConfig<TCtx, TState, CheckboxMenu<TCtx, TState>> {}

export type MenuFilters = KeyboardButton<MenuOptionPayload>[];

export interface RangeState {
    from?: string;
    to?: string;
}

/**
 * Full types
 * */

export interface MenuOption {
    action: string;
    payload: MenuOptionPayload;
}

export interface MenuOptionPayload {
    value: string;
    default?: boolean;
}

/**
 * Short types for callback data
 * */

export interface MenuOptionShort {
    a: string;
    p: MenuOptionPayloadShort;
}

export interface MenuOptionPayloadShort {
    v: string;
    d?: 1 | 0;
}

export type I18nOverride = I18n & {
    locale(languageCode: string): void;
    t(resourceKey: string, templateData?: Readonly<TemplateData>): string;
};

export type DefaultCtx = NarrowedContext<Context<any> & { match: RegExpExecArray; }, any> & {
    i18n?: I18nContext;
};

export type MenuContextUpdate<TCtx extends DefaultCtx = DefaultCtx> = {
    state: {
        callbackData: MenuOption;
    };
} & TCtx;
