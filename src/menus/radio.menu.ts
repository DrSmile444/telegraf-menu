import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOptionPayload, RadioConfig } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RadioMenu<
    Ctx extends DefaultCtx = DefaultCtx,
    State extends string = string,
> extends GenericMenu<Ctx, State> {
    constructor(private config: RadioConfig<Ctx, State>) {
        super(config as any);
    }

    stateToMenu(state: string) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<MenuOptionPayload<never>>[] = [];

        const currentButton = allButtons.find((button) => button.value.value === state);
        newButtons.push(currentButton);

        return newButtons.filter(Boolean);
    }

    menuToState(menu): string {
        return menu[0].value;
    }

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<never>) {
        const activeButtons = [activeButton];
        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<never>>) {
        const {RADIO_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isDefaultActiveButton, isActiveButton} = super.getButtonLabelInfo(ctx, button);

        return isActiveButton || isDefaultActiveButton ?
            RADIO_FORMATTING.active + ' ' + label :
            RADIO_FORMATTING.disabled + ' ' + label;
    }
}
