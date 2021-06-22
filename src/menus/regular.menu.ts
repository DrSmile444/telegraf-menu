// @ts-ignore
import * as deepEqual from 'deep-equal';

import { MenuConfig, MenuFilters, MenuFormatters, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { KeyboardMenu } from '../keyboard-menu';


export class RegularMenu<Ctx, State, Group> extends KeyboardMenu<any> {
    constructor(
        private config: MenuConfig<any, any, any>,
        private stateMappers: MenuFormatters<State, MenuFilters<Group>, Group> = {},
    ) {
        super(config, stateMappers);
    }

    stateToMenu() {
        return [];
    }

    menuToState(menu): string[] {
        return menu[0].value;
    }

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<Group>) {
        const activeButtons = [activeButton];
        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<Group>>) {
        const {label} = super.getButtonLabelInfo(ctx, button);
        return label;
    }
}
