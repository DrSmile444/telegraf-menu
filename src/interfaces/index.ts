import { I18n, I18nContext, TemplateData } from '@edjopato/telegraf-i18n';
import { Context, NarrowedContext } from 'telegraf';

import { GenericMenu } from '../generic-menu';
import { KeyboardButton } from '../keyboard-button';

export type GenericState = string[] | string | object;
export interface GenericConfig<
    Group extends string = string,
    State extends GenericState = GenericState,
    Ctx extends DefaultCtx = DefaultCtx,
> {
    action: string;
    message: string;
    submitMessage?: string;
    filters: MenuFilters | MenuFilters[] | MenuGroupFilters<Group> | MenuGroupFilters<Group>[];
    state?: State;
    debug?: boolean;
    replaceWithNextMenu?: boolean;
    menuGetter?(menuCtx: Ctx): GenericMenu;
    menuSetter?(menuCtx: Ctx, menu: GenericMenu): any;
    onChange?(changeCtx: MenuContextUpdate<Ctx, Group>, state: State): any;
    beforeChange?(changeCtx: MenuContextUpdate<Ctx, Group>, state: State): any;
    onSubmit?(submitCtx: MenuContextUpdate<Ctx, Group>, state: State): any;
    onSubmitUpdater?(submitCtx: MenuContextUpdate<Ctx, Group>, messageId: number, state: State): any;
}

export interface RegularMenuConfig<Ctx extends DefaultCtx = DefaultCtx> extends
    Omit<GenericConfig<never, string, Ctx>, 'state' | 'onSubmit' | 'beforeChange' | 'onSubmitUpdater' | 'submitMessage'> {}

export interface RadioConfig<Ctx extends DefaultCtx = DefaultCtx, State extends object = object> extends
    GenericConfig<never, State, Ctx> {}

export interface RangeConfig<Ctx extends DefaultCtx = DefaultCtx, State extends RangeState = RangeState> extends
    GenericConfig<never, State, Ctx> {}

export interface CheckboxConfig<Ctx extends DefaultCtx = DefaultCtx, State extends string[] = string[]> extends
    GenericConfig<never, State, Ctx> {}

export type MenuFilters = KeyboardButton<MenuOptionPayload<never>>[];
export type MenuGroupFilters<Group extends any = string> = KeyboardButton<MenuOptionPayload<Group>>[];

export interface RangeState {
    from: string;
    to: string;
}

/**
 * Full types
 * */

export interface MenuOption<Group = string> {
    action: string;
    payload: MenuOptionPayload<Group>;
}

export interface MenuOptionPayload<Group extends any = string> {
    group?: Group;
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
    g: Group;
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

export type MenuContextUpdate<Ctx extends DefaultCtx = DefaultCtx, Group = string> = {
    state: {
        callbackData: MenuOption<Group>;
    };
} & Ctx;
