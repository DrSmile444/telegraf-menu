import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOption, RadioConfig } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RadioMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends string = string,
    TValue extends string = string,
    > extends GenericMenu<TCtx, TState, TValue> {
    constructor(private config: RadioConfig<TCtx, TState, TValue>) {
        super({
            ...config,
            formatting: Object.assign(FORMATTING_EMOJIS.RADIO_FORMATTING, config.formatting ?? {}),
        });
    }

    stateToMenu(state: string): KeyboardButton<TValue>[] {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<TValue>[] = [];

        const currentButton = allButtons.find((button) => button.value === state);
        newButtons.push(currentButton);

        return newButtons.filter(Boolean);
    }

    menuToState(menu: TValue[]): TValue {
        return menu[0];
    }

    onActiveButton(ctx: TCtx, activeButton: MenuOption<TValue>) {
        const activeButtons = [activeButton.value];
        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: TCtx, button: KeyboardButton<TValue>) {
        const {label, isDefaultActiveButton, isActiveButton} = super.getButtonLabelInfo(ctx, button);
        const activeButtonIndex = this.flatFilters.findIndex((allButton) => button.value === allButton.value);
        const firstButtonIndex = this.flatFilters.findIndex((allButton) => allButton.isDefault);

        const isFirstDefault = firstButtonIndex === activeButtonIndex;

        return isActiveButton || (isDefaultActiveButton && isFirstDefault) ?
            this.genericConfig.formatting.active + ' ' + label :
            this.genericConfig.formatting.disabled + ' ' + label;
    }
}
