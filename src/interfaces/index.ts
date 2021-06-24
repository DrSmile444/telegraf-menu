import { I18n, I18nContext, TemplateData } from '@edjopato/telegraf-i18n';
import { Context, NarrowedContext } from 'telegraf';

import { GenericMenu } from '../generic-menu';
import { KeyboardButton } from '../keyboard-button';
import { CheckboxMenu, RadioMenu, RangeMenu, RegularMenu } from '../menus';

export type GenericState = string[] | string | object;
export interface GenericConfig<
    Ctx extends DefaultCtx = DefaultCtx,
    State extends GenericState = GenericState,
    Menu extends GenericMenu = GenericMenu,
> {
    action: string;
    message: string;
    submitMessage?: string;
    filters: MenuFilters | MenuFilters[];
    state?: State;
    debug?: boolean;
    replaceable?: boolean;
    menuGetter?(menuCtx: Ctx): GenericMenu;
    menuSetter?(menuCtx: Ctx, menu: Menu): any;
    onChange?(changeCtx: MenuContextUpdate<Ctx>, state: State): any;
    beforeChange?(changeCtx: MenuContextUpdate<Ctx>, state: State): any;
    onSubmit?(submitCtx: MenuContextUpdate<Ctx>, state: State): any;
    onSubmitUpdater?(submitCtx: MenuContextUpdate<Ctx>, messageId: number, state: State): any;
}

export interface RegularMenuConfig<Ctx extends DefaultCtx = DefaultCtx> extends
    Omit<
        GenericConfig<Ctx, string, RegularMenu<Ctx>>,
        'state' | 'onSubmit' | 'beforeChange' | 'onSubmitUpdater' | 'submitMessage'
    > {}

export interface RadioConfig<Ctx extends DefaultCtx = DefaultCtx, State extends string = string> extends
    GenericConfig<Ctx, State, RadioMenu<Ctx, State>> {}

export interface RangeConfig<Ctx extends DefaultCtx = DefaultCtx, State extends RangeState = RangeState> extends
    GenericConfig<Ctx, State, RangeMenu<Ctx, State>> {}

export interface CheckboxConfig<Ctx extends DefaultCtx = DefaultCtx, State extends string[] = string[]> extends
    GenericConfig<Ctx, State, CheckboxMenu<Ctx, State>> {}

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

export type MenuContextUpdate<Ctx extends DefaultCtx = DefaultCtx> = {
    state: {
        callbackData: MenuOption;
    };
} & Ctx;
