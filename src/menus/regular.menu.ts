// @ts-ignore
import * as deepEqual from 'deep-equal';

import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOptionPayload, RegularMenuConfig } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RegularMenu<Ctx extends DefaultCtx = DefaultCtx> extends GenericMenu<Ctx, never, string> {
    constructor(private config: RegularMenuConfig<Ctx>) {
        super(config);
    }

    stateToMenu() {
        return [];
    }

    menuToState(menu): string {
        return menu[0].value;
    }

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<never>) {
        const activeButtons = [activeButton];
        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<never>>) {
        const {label} = super.getButtonLabelInfo(ctx, button);
        return label;
    }
}
