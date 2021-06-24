import { Markup, MiddlewareFn } from 'telegraf';

import {
    DefaultCtx,
    GenericConfig, GenericState,
    MenuContextUpdate,
    MenuFilters,
    MenuOption,
    MenuOptionShort,
} from './interfaces';
import { KeyboardButton } from './keyboard-button';
import { parseCallbackData } from './middlewares/parse-callback-data';
import { getCtxInfo, reduceArray } from './utils';


export abstract class GenericMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends GenericState = GenericState,
    TValue extends string = string,
> {
    private get debugMessage() {
        return !!this.genericConfig.debug ?
            '\n\n• Debug: ' + JSON.stringify(this.state) + '\n• Message ID: ' + this.messageId :
            '';
    }

    messageId: number;
    state: TState;
    replaced: boolean = false;

    protected activeButtons: TValue[] = [];
    protected evenRange: boolean = false;
    private deleted: boolean = false;

    static remapCompactToFull<SValue>(options: MenuOptionShort<SValue>): MenuOption<SValue> {
        const newOption: MenuOption<SValue> = {
            action: options.a,
            value: options.v,
            isDefault: !!options.d,
        };

        if (!options.d) {
            delete newOption.isDefault;
        }

        return newOption;
    }

    static remapFullToCompact<SValue>(options: MenuOption<SValue>): MenuOptionShort<SValue> {
        const newOption: MenuOptionShort<SValue> = {
            a: options.action,
            v: options?.value,
            d: Number(!!options?.isDefault) as 1 | 0,
        };

        if (!options?.isDefault) {
            delete newOption.d;
        }

        return newOption;
    }

    static middleware(): MiddlewareFn<DefaultCtx> {
        return parseCallbackData;
    }

    /**
     * Uses as action handler on callback query
     * */
    static onAction<TCtx extends DefaultCtx = DefaultCtx>(
        menuGetter: (ctx: TCtx) => GenericMenu,
        initMenu: (ctx: TCtx) => any,
    ) {
        return (ctx: MenuContextUpdate<TCtx>) => {
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
        private genericConfig: GenericConfig<TCtx, TState>,
    ) {
        if (genericConfig.state) {
            this.updateState(genericConfig.state);
        }
    }

    abstract onActiveButton(ctx: TCtx, activeButton: MenuOption<TValue>);
    abstract formatButtonLabel(ctx: TCtx, button: KeyboardButton<TValue>);
    abstract stateToMenu(state: TState): KeyboardButton<TValue>[];
    abstract menuToState(menu: TValue[]);

    get flatFilters(): MenuFilters<TValue> {
        return Array.isArray(this.genericConfig.filters[0])
            ? (this.genericConfig.filters as MenuFilters<TValue>[]).reduce(reduceArray)
            : this.genericConfig.filters as MenuFilters<TValue>;
    }

    /**
     * Updates and redraws the state
     * */
    updateState(state: TState, ctx?: TCtx) {
        this.activeButtons = this.stateToMenu(state).map((button) => button.value);
        this.state = state;

        if (ctx) {
            this.redrawMenu(ctx);
        }
    }

    /**
     * After creating the menu instance, send it.
     * Redraws the old menu
     * */
    async sendMenu(ctx: TCtx) {
        const { chatId } = getCtxInfo(ctx);
        ctx.telegram.sendChatAction(chatId, 'typing');

        const sendMessage = async () => {
            const sentMessage = await ctx.reply(this.getMessage(ctx), this.getKeyboard(ctx));
            this.messageId = sentMessage.message_id;
        };

        const oldMenu = this.genericConfig.menuGetter(ctx);
        let isReplacingMenu = false;

        if (oldMenu) {
            isReplacingMenu = oldMenu.genericConfig?.replaceable && !oldMenu.deleted && oldMenu.messageId !== this.messageId;
            oldMenu.replaced = true;
        }

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

    protected toggleActiveButton(ctx: TCtx, activeButtons: TValue[]) {
        const newState = this.menuToState(activeButtons);
        this.activeButtons = activeButtons;
        this.state = newState;
        this.evenRange = !this.evenRange;
        this.genericConfig.beforeChange?.(ctx as MenuContextUpdate<TCtx>, this.state);

        this.redrawMenu(ctx);
    }

    /**
     * Creates the label depending on button state and menu type.
     * */
    protected getButtonLabelInfo(ctx: TCtx, button: KeyboardButton<TValue>) {
        const isDefaultActiveButton = this.activeButtons
            .length === 0 && !!button.isDefault;

        const isActiveButton = this.activeButtons.some((activeButton) => {
            return activeButton === button.value;
        });

        const label = ctx.i18n?.t(button.label) || button.label;

        return {
            label,
            isActiveButton,
            isDefaultActiveButton,
        };
    }

    private getMessage(ctx: TCtx) {
        const message = ctx.i18n?.t(this.genericConfig.message) || this.genericConfig.message;
        return message + this.debugMessage;
    }

    private getSubmitMessage(ctx: TCtx) {
        return ctx.i18n?.t(this.genericConfig.submitMessage) || 'Submit';
    }

    private onAction(ctx: MenuContextUpdate<TCtx>) {
        if (!ctx.state.callbackData) {
            throw new Error('TelegrafMenu Error: You forgot to add middleware parser. Add following code to your bot:\n\n+++ bot.use(GenericMenu.middleware());\n');
        }

        const messageId = ctx.callbackQuery?.message?.message_id;
        /**
         * If clicked on old inactive keyboard
         * */
        if (!this.messageId) {
            ctx.deleteMessage(messageId).catch(() => {});
            this.sendMenu(ctx);
        } else if (this.messageId !== messageId) {
            ctx.deleteMessage(messageId).catch(() => {});
            return;
        }

        const payloadButton = ctx.state.callbackData as MenuOption<TValue>;
        if (payloadButton?.value === '_local_submit') {
            this.genericConfig.onSubmit?.(ctx, this.state);
            this.deleted = true;

            if (this.genericConfig.onSubmitUpdater) {
                this.genericConfig.onSubmitUpdater(ctx, messageId, this.state);
            } else if (!this.genericConfig.replaceable) {
                ctx.deleteMessage(messageId).catch(() => {});
            }
            return;
        }

        this.onActiveButton(ctx, ctx.state.callbackData as MenuOption<TValue>);
        this.genericConfig.onChange?.(ctx, this.state);
    }

    /**
     * Redraw current menu with new buttons.
     * Updates message and keyboard.
     * */
    private redrawMenu(ctx: TCtx) {
        const { chatId } = getCtxInfo(ctx);

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
    private getKeyboard(ctx: TCtx) {
        const filters: MenuFilters<TValue>[] = Array.isArray(this.genericConfig.filters[0])
            ? this.genericConfig.filters as MenuFilters<TValue>[] :
            [this.genericConfig.filters] as MenuFilters<TValue>[];

        const buttons = filters.map((row) => {
            return row.map((button) => {
                const shortButton = GenericMenu.remapFullToCompact({
                    action: this.genericConfig.action,
                    value: button.value,
                    isDefault: button.isDefault,
                });

                return Markup.button.callback(this.formatButtonLabel(ctx, button), JSON.stringify(shortButton));
            });
        });

        if (this.genericConfig.onSubmit || this.genericConfig.submitMessage || this.genericConfig.onSubmitUpdater) {
            const shortButton = GenericMenu.remapFullToCompact({
                action: this.genericConfig.action,
                value: '_local_submit',
            });

            const callbackButton = Markup.button.callback(this.getSubmitMessage(ctx), JSON.stringify(shortButton));

            buttons.push([callbackButton]);
        }

        return Markup.inlineKeyboard(buttons);
    }
}
