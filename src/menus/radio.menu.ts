import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { MenuConfig, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RadioMenu<Ctx, State, Group> extends GenericMenu<any> {
    constructor(private config: MenuConfig<any, any, any>) {
        super(config);
    }

    stateToMenu() {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<any>[] = [];

        this.groups.forEach((group) => {
            const radioButton = allButtons.find((button) => {
                return button.value.group === group && button.value.value === this.state[group];
            });

            newButtons.push(radioButton);
        });

        return newButtons.filter(Boolean);
    }

    menuToState(menu, groups) {
        const newState: { [key: string]: any | any[] } = {};

        console.log({ menu, groups });

        groups.forEach((group) => {
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

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<Group>) {
        let activeButtons = this.stateToMenu().map((button) => button.value);

        activeButtons = activeButtons.filter((button) => button.group !== activeButton.group);
        activeButtons.push(activeButton);

        console.log(activeButton);

        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<Group>>) {
        const {RADIO_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isDefaultActiveButton, isActiveButton} = super.getButtonLabelInfo(ctx, button);

        return isActiveButton || isDefaultActiveButton ?
            RADIO_FORMATTING.active + ' ' + label :
            RADIO_FORMATTING.disabled + ' ' + label;
    }
}
