// @ts-ignore
import * as deepEqual from 'deep-equal';
import { BehaviorSubject } from 'rxjs';
import { skip } from 'rxjs/operators';
import { Markup } from 'telegraf';

import {
    DefaultCtx,
    MenuConfig,
    MenuContextUpdate,
    MenuFilters,
    MenuFormatters,
    MenuOption,
    MenuOptionPayload,
    MenuOptionShort,
} from './interfaces';
import { KeyboardButton } from './keyboard-button';
import { getCtxInfo, reduceArray } from './utils';


export abstract class KeyboardMenu<Ctx extends DefaultCtx = DefaultCtx, Group extends string = any, State extends any = any> {
    /**
     * RXJS Observable with state changes
     * */
    get state$() {
        return this._state$
            .asObservable()
            .pipe(skip(1));
    }

    private get debugMessage() {
        return !!this.genericConfig.debug ?
            '\n\n• Debug: ' + JSON.stringify(this.state) + '\n• Message ID: ' + this.messageId :
            '';
    }

    messageId: number;
    state: State;
    replaced: boolean = false;

    protected readonly groups: string[];
    protected activeButtons: MenuOptionPayload<Group>[] = [];
    protected evenRange: boolean = false;
    private deleted: boolean = false;
    private readonly _state$: BehaviorSubject<State> = new BehaviorSubject<State>(null);

    static remapCompactToFull<SGroup>(options: MenuOptionShort<SGroup>): MenuOption<SGroup> {
        const newOption = {
            action: options.a,
            payload: {
                default: !!options.p.d,
                group: options.p.g,
                value: options.p.v,
            },
        };

        if (!options.p.d) {
            delete newOption.payload.default;
        }

        return newOption;
    }

    static remapFullToCompact<SGroup>(options: MenuOption<SGroup>): MenuOptionShort<SGroup> {
        const newOption = {
            a: options.action,
            p: {
                d: Number(!!options.payload.default) as 1 | 0,
                g: options.payload.group,
                v: options.payload.value,
            },
        };

        if (!options.payload.default) {
            delete newOption.p.d;
        }

        return newOption;
    }

    /**
     * Uses as action handler on callback query
     * */
    static onAction<Ctx extends DefaultCtx = DefaultCtx>(
        menuGetter: (ctx: Ctx) => KeyboardMenu,
        initMenu: (ctx: Ctx) => any,
    ) {
        return (ctx: MenuContextUpdate<Ctx>) => {
            const oldMenu = menuGetter(ctx);
            if (oldMenu?.onAction) {
                oldMenu.onAction(ctx);
            } else {
                if (oldMenu && !oldMenu.deleted) {
                    ctx.deleteMessage(oldMenu.messageId).catch(() => {});
                    oldMenu.deleted = true;
                }

                initMenu(ctx);
            }
        };
    }

    constructor(
        private genericConfig: MenuConfig<Group, State, Ctx>,
        private genericStateMappers: MenuFormatters<State, MenuFilters<Group>, Group>,
    ) {
        this.groups = this.genericConfig.filters.reduce(reduceArray).map((filter) => filter.value.group);
        if (genericConfig.state) {
            this.updateState(genericConfig.state);
        }
    }

    abstract onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<Group>);
    abstract formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<Group>>);
    abstract stateToMenu(state: any, filters, groups);
    abstract menuToState(menu, groups);

    /**
     * Updates and redraws the state
     * */
    updateState(state: State, ctx?: Ctx) {
        const stateToMenu = this.genericStateMappers?.stateToMenu || this.stateToMenu;
        this.activeButtons = stateToMenu(
            state,
            this.genericConfig.filters,
            this.groups,
        ).map((button) => button.value);

        this._state$.next(state);
        this.state = state;

        if (ctx) {
            this.redrawMenu(ctx);
        }
    }

    /**
     * After creating the menu instance, send it.
     * Redraws the old menu
     * */
    async sendMenu(ctx: Ctx) {
        const { chatId } = getCtxInfo(ctx as any);
        ctx.telegram.sendChatAction(chatId, 'typing');

        const sendMessage = async () => {
            const sentMessage = await ctx.reply(this.getMessage(ctx), this.getKeyboard(ctx));
            this.messageId = sentMessage.message_id;
        };

        const oldMenu = this.genericConfig.menuGetter(ctx);
        const isReplacingMenu = oldMenu?.genericConfig?.replaceWithNextMenu && !oldMenu?.deleted && oldMenu?.messageId !== this.messageId;
        oldMenu.replaced = true;

        if (isReplacingMenu && oldMenu.onAction) {
            this.messageId = oldMenu.messageId;
                ctx.telegram.editMessageText(
                    chatId,
                    this.messageId,
                    null,
                    this.getMessage(ctx),
                    this.getKeyboard(ctx),
                )
                .then(() => {
                    if (this.genericConfig.debug) {
                        console.log('sendMenu', this.genericConfig.action);
                    }
                })
                .catch(async () => {
                    oldMenu.deleted = true;
                    await sendMessage();
                });
        } else {
            ctx.deleteMessage(this.messageId).catch(() => {});
            await sendMessage();
        }

        this.genericConfig.menuSetter?.(ctx, this);
    }

    protected toggleActiveButton(ctx: Ctx, activeButtons: MenuOptionPayload<Group>[]) {
        const menuToState = this.genericStateMappers.menuToState || this.menuToState;
        const newState = menuToState(activeButtons, this.groups);
        this.activeButtons = activeButtons;
        this._state$.next(newState);
        this.state = newState;
        this.evenRange = !this.evenRange;
        this.genericConfig.beforeChange?.(ctx as any, this.state);

        this.redrawMenu(ctx);
    }

    /**
     * Creates the label depending on button state and menu type.
     * */
    protected getButtonLabelInfo(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<Group>>) {
        const isDefaultActiveButton = this.activeButtons
            .filter((activeButton) => activeButton.group === button.value.group)
            .length === 0 && !!button.value.default;

        const isActiveButton = this.activeButtons.some((activeButton) => {
            return deepEqual(activeButton, button.value);
        });

        const label = ctx.i18n?.t(button.label) || button.label;

        return {
            label,
            isActiveButton,
            isDefaultActiveButton,
        };
    }

    private getMessage(ctx: Ctx) {
        const message = ctx.i18n?.t(this.genericConfig.message) || this.genericConfig.message;
        return message + this.debugMessage;
    }

    private getSubmitMessage(ctx: Ctx) {
        return ctx.i18n?.t(this.genericConfig.submitMessage) || 'Submit';
    }

    private onAction(ctx: MenuContextUpdate<Ctx, Group>) {
        const messageId = ctx.callbackQuery?.message?.message_id;
        /**
         * If clicked on old inactive keyboard
         * */
        if (!this.messageId) {
            ctx.deleteMessage(messageId).catch(() => {});
            this.sendMenu(ctx as any);
        } else if (this.messageId !== messageId) {
            ctx.deleteMessage(messageId).catch(() => {});
            return;
        }

        const payload = ctx.state.callbackData?.payload;
        if (payload?.group === '_local' && payload?.value === '_submit') {
            this.genericConfig.onSubmit?.(ctx, this.state);
            this.deleted = true;

            if (this.genericConfig.onSubmitUpdater) {
                this.genericConfig.onSubmitUpdater(ctx, messageId, this.state);
            } else if (!this.genericConfig.replaceWithNextMenu) {
                ctx.deleteMessage(messageId).catch(() => {});
            }
            return;
        }

        this.onActiveButton(ctx as any, ctx.state.callbackData.payload);
        this.genericConfig.onChange?.(ctx, this.state);
    }

    /**
     * Redraw current menu with new buttons.
     * Updates message and keyboard.
     * */
    private redrawMenu(ctx: Ctx) {
        const { chatId } = getCtxInfo(ctx as any);

        /**
         * Replaced flag sets after the call, so we need to delay it
         * */
        setTimeout(() => {
            if (this.replaced) {
                return;
            }

            if (this.messageId) {
                ctx.telegram
                    .editMessageText(chatId, this.messageId, null, this.getMessage(ctx), this.getKeyboard(ctx))
                    .then(() => {
                        if (this.genericConfig.debug) {
                            console.log('redraw', this.genericConfig.action);
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            }
        });
    }

    /**
     * Formats and creates keyboard buttons from the config
     * */
    private getKeyboard(ctx: Ctx) {
        const buttons = this.genericConfig.filters.map((row) => {
            return row.map((button) => {
                const shortButton = KeyboardMenu.remapFullToCompact({
                    action: this.genericConfig.action,
                    payload: button.value,
                });

                return Markup.button.callback(this.formatButtonLabel(ctx, button), JSON.stringify(shortButton));
            });
        });

        if (this.genericConfig.onSubmit || this.genericConfig.submitMessage || this.genericConfig.onSubmitUpdater) {
            const shortButton = KeyboardMenu.remapFullToCompact({
                action: this.genericConfig.action,
                payload: { group: '_local', value: '_submit' },
            });

            const callbackButton = Markup.button.callback(this.getSubmitMessage(ctx), JSON.stringify(shortButton));

            buttons.push([callbackButton]);
        }

        return Markup.inlineKeyboard(buttons);
    }
}
