import { I18n, I18nContext, TemplateData } from '@edjopato/telegraf-i18n';
import { Context, NarrowedContext } from 'telegraf';

import { GenericMenu } from '../generic-menu';
import { KeyboardButton } from '../keyboard-button';
import { CheckboxMenu, RadioMenu, RangeMenu, RegularMenu } from '../menus';

export type PossibleFilters<Group> = MenuFilters | MenuFilters[] | MenuGroupFilters<Group> | MenuGroupFilters<Group>[];
export type GenericState = string[] | string | object;
export interface GenericConfig<
    Ctx extends DefaultCtx = DefaultCtx,
    State extends GenericState = GenericState,
    Group extends string = never,
    Menu extends GenericMenu = GenericMenu,
    Filters extends PossibleFilters<Group> = PossibleFilters<Group>,
> {
    action: string;
    message: string;
    submitMessage?: string;
    filters: Filters;
    state?: State;
    debug?: boolean;
    replaceable?: boolean;
    menuGetter?(menuCtx: Ctx): GenericMenu;
    menuSetter?(menuCtx: Ctx, menu: Menu): any;
    onChange?(changeCtx: MenuContextUpdate<Ctx, Group>, state: State): any;
    beforeChange?(changeCtx: MenuContextUpdate<Ctx, Group>, state: State): any;
    onSubmit?(submitCtx: MenuContextUpdate<Ctx, Group>, state: State): any;
    onSubmitUpdater?(submitCtx: MenuContextUpdate<Ctx, Group>, messageId: number, state: State): any;
}

export interface RegularMenuConfig<Ctx extends DefaultCtx = DefaultCtx> extends
    Omit<
        GenericConfig<Ctx, string, never, RegularMenu<Ctx>, MenuFilters | MenuFilters[]>,
        'state' | 'onSubmit' | 'beforeChange' | 'onSubmitUpdater' | 'submitMessage'
    > {}

export interface RadioConfig<Ctx extends DefaultCtx = DefaultCtx, State extends string = string> extends
    GenericConfig<Ctx, State, string, RadioMenu<Ctx, State>, MenuGroupFilters | MenuGroupFilters[]> {}

export interface RangeConfig<Ctx extends DefaultCtx = DefaultCtx, State extends RangeState = RangeState> extends
    GenericConfig<Ctx, State, never, RangeMenu<Ctx, State>, MenuFilters | MenuFilters[]> {}

export interface CheckboxConfig<Ctx extends DefaultCtx = DefaultCtx, State extends string[] = string[]> extends
    GenericConfig<Ctx, State, never, CheckboxMenu<Ctx, State>, MenuFilters | MenuFilters[]> {}

export type MenuFilters = KeyboardButton<MenuOptionPayload<never>>[];
export type MenuGroupFilters<Group extends any = string> = KeyboardButton<MenuOptionPayload<Group>>[];

export interface RangeState {
    from?: string;
    to?: string;
}

/**
 * Full types
 * */

export interface MenuOption<Group = string> {
    action: string;
    payload: MenuOptionPayload<Group>;
}

export interface MenuOptionPayload<Group extends any = string> {
    value: string;
    default?: boolean;
}

/**
 * Short types for callback data
 * */

export interface MenuOptionShort<Group = string> {
    a: string;
    p: MenuOptionPayloadShort<Group>;
}

export interface MenuOptionPayloadShort<Group extends any = string> {
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

export type MenuContextUpdate<Ctx extends DefaultCtx = DefaultCtx, Group extends any = string> = {
    state: {
        callbackData: MenuOption<Group>;
    };
} & Ctx;
