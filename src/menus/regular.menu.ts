// @ts-ignore
import * as deepEqual from 'deep-equal';

import { GenericMenu } from '../generic-menu';
import { MenuConfig, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RegularMenu<Ctx, State, Group> extends GenericMenu<any> {
    constructor(private config: MenuConfig<any, any, any>) {
        super(config);
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
