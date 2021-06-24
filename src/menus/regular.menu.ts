import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOption, RegularMenuConfig } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RegularMenu<TCtx extends DefaultCtx = DefaultCtx, TValue extends string = string> extends GenericMenu<TCtx, string, TValue> {
    constructor(private config: RegularMenuConfig<TCtx, TValue>) {
        super(config);
    }

    stateToMenu() {
        return [];
    }

    menuToState(menu: TValue[]): string {
        return menu[0];
    }

    onActiveButton(ctx: TCtx, activeButton: MenuOption<TValue>) {
        const activeButtons = [activeButton.value];
        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: TCtx, button: KeyboardButton<TValue>) {
        const {label} = super.getButtonLabelInfo(ctx, button);
        return label;
    }
}
