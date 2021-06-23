// @ts-ignore
import * as deepEqual from 'deep-equal';

import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuConfig, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class CheckboxMenu<
    Ctx extends DefaultCtx = DefaultCtx,
    State extends string[] = string[],
> extends GenericMenu<Ctx, never, State> {
    constructor(private config: MenuConfig<never, State, Ctx>) {
        super(config);
    }

    stateToMenu(state) {
        const allButtons = this.flatFilters;
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

    menuToState(menu): string[] {
        return menu.map((button) => button.value);
    }

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload) {
        const activeButtons = this.stateToMenu(this.state).map((button) => button.value);

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

    formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<never>>) {
        const {CHECKBOX_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isActiveButton} = super.getButtonLabelInfo(ctx, button);

        return isActiveButton ?
            CHECKBOX_FORMATTING.active + ' ' + label :
            CHECKBOX_FORMATTING.disabled + ' ' + label;
    }
}
