// @ts-ignore
import * as deepEqual from 'deep-equal';

import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { MenuConfig, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { reduceArray } from '../utils';


export class CheckboxMenu<Ctx, State, Group> extends GenericMenu<any> {
    constructor(private config: MenuConfig<any, any, any>) {
        super(config);
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
        const activeButtons = this.stateToMenu(
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
