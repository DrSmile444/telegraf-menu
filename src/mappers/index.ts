// @ts-ignore
import * as deepEqual from 'deep-equal';

import { MenuFilters, MenuFormatters, MenuType } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { reduceArray } from '../utils';

export const DEFAULT_STATE_MAPPERS: MenuFormatters<any, MenuFilters<any>, any> = {
    stateToMenu: (state = {}, filters, menuType, groups) => {
        const groupKeys = Object.values(groups || {});
        const allButtons = filters.reduce(reduceArray);

        const newButtons: KeyboardButton<any>[] = [];

        switch (menuType) {
            case MenuType.MENU:
                break;

            case MenuType.RANGE:
                const rangeButtons = allButtons.filter((button) => {
                    return state.from === button.value.value || state.to === button.value.value;
                });
                newButtons.push(...rangeButtons);
                break;

            case MenuType.CHECKBOX:
                const currentState = Array.isArray(state)
                    ? state
                    : [];

                if (currentState.length) {
                    const checkboxButton = allButtons
                        .filter((button) => currentState.includes(button.value.value));

                    newButtons.push(...checkboxButton);
                }
                break;

            case MenuType.RADIO:
                groupKeys.forEach((group) => {
                    const radioButton = allButtons.find((button) => {
                        return button.value.group === group && button.value.value === state[group];
                    });

                    newButtons.push(radioButton);
                });
        }

        return newButtons.filter(Boolean);
    },
    menuToState: (menu, menuType, groups ) => {
        const groupKeys = Object.values(groups);
        const newState: { [key: string]: any | any[] } = {};
        let newStateCheckbox: string[] = [];

        switch (menuType) {
            case MenuType.MENU:
                return menu[0].value;

            case MenuType.RANGE:
                newState.from = menu[0].value;
                newState.to = menu[1].value;
                break;

            case MenuType.CHECKBOX:
                newStateCheckbox = menu.map((button) => button.value);
                break;

            case MenuType.RADIO:
                groupKeys.forEach((group) => {
                    newState[group] = menu.find((button) => button.group === group)?.value;
                });
                break;
        }

        Object.keys(newState).forEach((key) => {
            const value = newState[key];
            if (!value && value !== 0) {
                delete newState[key];
            }
        });

        return menuType === MenuType.CHECKBOX
            ? newStateCheckbox
            : newState;
    },
};
