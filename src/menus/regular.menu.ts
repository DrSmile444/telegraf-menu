import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOptionPayload, RegularMenuConfig } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RegularMenu<TCtx extends DefaultCtx = DefaultCtx> extends GenericMenu<TCtx, string> {
    constructor(private config: RegularMenuConfig<TCtx>) {
        super(config);
    }

    stateToMenu() {
        return [];
    }

    menuToState(menu): string {
        return menu[0].value;
    }

    onActiveButton(ctx: TCtx, activeButton: MenuOptionPayload) {
        const activeButtons = [activeButton];
        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: TCtx, button: KeyboardButton<MenuOptionPayload>) {
        const {label} = super.getButtonLabelInfo(ctx, button);
        return label;
    }
}
