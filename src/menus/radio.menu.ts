import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOptionPayload, RadioConfig } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RadioMenu<
    Ctx extends DefaultCtx = DefaultCtx,
    State extends object = object,
> extends GenericMenu<Ctx, State> {
    constructor(private config: RadioConfig<Ctx, State>) {
        super(config);
    }

    stateToMenu(state) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<MenuOptionPayload<never>>[] = [];

        this.groups.forEach((group) => {
            const radioButton = allButtons.find((button) => {
                return button.value.group === group && button.value.value === state[group];
            });

            newButtons.push(radioButton);
        });

        return newButtons.filter(Boolean);
    }

    menuToState(menu) {
        const newState: { [key: string]: any | any[] } = {};

        this.groups.forEach((group) => {
            newState[group] = menu.find((button) => button.group === group)?.value;
        });

        Object.keys(newState).forEach((key) => {
            const value = newState[key];
            if (!value && value !== 0) {
                delete newState[key];
            }
        });

        return newState;
    }

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<never>) {
        let activeButtons = this.stateToMenu(this.state).map((button) => button.value);

        activeButtons = activeButtons.filter((button) => button.group !== activeButton.group);
        activeButtons.push(activeButton);

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
