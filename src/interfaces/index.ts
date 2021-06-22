import { I18n, I18nContext, TemplateData } from '@edjopato/telegraf-i18n';
import { Context, NarrowedContext } from 'telegraf';

import { KeyboardButton } from '../keyboard-button';
import { GenericMenu } from '../generic-menu';


export interface MenuConfig<Group extends string = string, State extends any = any, Ctx extends DefaultCtx = DefaultCtx> {
    action: string;
    message: string;
    submitMessage?: string;
    filters: MenuFilters<Group>;
    state?: State;
    debug?: boolean;
    replaceWithNextMenu?: boolean;
    menuGetter?(ctx: Ctx): GenericMenu;
    menuSetter?(ctx: Ctx, menu: GenericMenu): any;
    onChange?(ctx: MenuContextUpdate<Ctx, Group>, state: State): any;
    beforeChange?(changeCtx: MenuContextUpdate<Ctx, Group>, state: State): any;
    onSubmit?(ctx: MenuContextUpdate<Ctx, Group>, state: State): any;
    onSubmitUpdater?(ctx: MenuContextUpdate<Ctx, Group>, messageId: number, state: State): any;
}

export type MenuFilters<Group extends any = string> = KeyboardButton<MenuOptionPayload<Group>>[][];

export interface MenuFormatters<State extends any, Filters extends any[][], Group> {
    stateToMenu?(state: State, filters: Filters, groups: string[]): Filters[0];
    menuToState?(menu: MenuOptionPayload<Group>[], groups: string[]): State;
}

/**
 * Full types
 * */

export interface MenuOption<Group = string> {
    action: string;
    payload: MenuOptionPayload<Group>;
}

export interface MenuOptionPayload<Group extends any = string> {
    group: Group;
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
