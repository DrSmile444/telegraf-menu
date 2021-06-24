import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOptionPayload, RadioConfig } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RadioMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends string = string,
> extends GenericMenu<TCtx, TState> {
    constructor(private config: RadioConfig<TCtx, TState>) {
        super(config as any);
    }

    stateToMenu(state: string) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<MenuOptionPayload>[] = [];

        const currentButton = allButtons.find((button) => button.value.value === state);
        newButtons.push(currentButton);

        return newButtons.filter(Boolean);
    }

    menuToState(menu): string {
        return menu[0].value;
    }

    onActiveButton(ctx: TCtx, activeButton: MenuOptionPayload) {
        const activeButtons = [activeButton];
        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: TCtx, button: KeyboardButton<MenuOptionPayload>) {
        const {RADIO_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isDefaultActiveButton, isActiveButton} = super.getButtonLabelInfo(ctx, button);

        return isActiveButton || isDefaultActiveButton ?
            RADIO_FORMATTING.active + ' ' + label :
            RADIO_FORMATTING.disabled + ' ' + label;
    }
}
