import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { MenuConfig, MenuFilters, MenuFormatters, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { reduceArray } from '../utils';


export class RadioMenu<Ctx, State, Group> extends GenericMenu<any> {
    constructor(
        private config: MenuConfig<any, any, any>,
        private stateMappers: MenuFormatters<State, MenuFilters<Group>, Group> = {},
    ) {
        super(config, stateMappers);
    }

    stateToMenu(state, filters, groups) {
        const allButtons = filters.reduce(reduceArray);
        const newButtons: KeyboardButton<any>[] = [];

        groups.forEach((group) => {
            const radioButton = allButtons.find((button) => {
                return button.value.group === group && button.value.value === state[group];
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
        const stateToMenu = this.stateMappers.stateToMenu || this.stateToMenu;
        let activeButtons = stateToMenu(
            this.state,
            this.config.filters,
            this.groups,
        ).map((button) => button.value);

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
