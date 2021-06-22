// @ts-ignore
import * as deepEqual from 'deep-equal';

import { FORMATTING_EMOJIS } from '../const';
import { MenuConfig, MenuFilters, MenuFormatters, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { KeyboardMenu } from '../keyboard-menu';
import { reduceArray } from '../utils';


export class CheckboxMenu<Ctx, State, Group> extends KeyboardMenu<any> {
    constructor(
        private config: MenuConfig<any, any, any>,
        private stateMappers: MenuFormatters<State, MenuFilters<Group>, Group> = {},
    ) {
        super(config, stateMappers);
    }

    stateToMenu(state, filters, groups) {
        const allButtons = filters.reduce(reduceArray);
        const newButtons: KeyboardButton<any>[] = [];

        const currentState = Array.isArray(state)
            ? state
            : [];

        if (currentState.length) {
            const checkboxButton = allButtons
                .filter((button) => currentState.includes(button.value.value));

            newButtons.push(...checkboxButton);
        }

        return newButtons.filter(Boolean);
    }

    menuToState(menu, groups): string[] {
        return menu.map((button) => button.value);
    }

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<Group>) {
        const stateToMenu = this.stateMappers.stateToMenu || this.stateToMenu;
        const activeButtons = stateToMenu(
            this.state,
            this.config.filters,
            this.groups,
        ).map((button) => button.value);


        let buttonIndex = null;

        activeButtons.some((button, index) => {
            const isButtonInList = deepEqual(button, activeButton);

            if (isButtonInList) {
                buttonIndex = index;
                return true;
            }
        });

        if (buttonIndex || buttonIndex === 0) {
            activeButtons.splice(buttonIndex, 1);
        } else {
            activeButtons.push(activeButton);
        }

        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<Group>>) {
        const {CHECKBOX_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isActiveButton} = super.getButtonLabelInfo(ctx, button);

        return isActiveButton ?
            CHECKBOX_FORMATTING.active + ' ' + label :
            CHECKBOX_FORMATTING.disabled + ' ' + label;
    }
}
