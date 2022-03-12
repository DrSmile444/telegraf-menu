import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { CheckboxConfig, DefaultCtx, MenuOption } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class CheckboxMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends string[] = string[],
    TValue extends string = string,
> extends GenericMenu<TCtx, TState, TValue> {
    constructor(private config: CheckboxConfig<TCtx, TState, TValue>) {
        super(config);
    }

    stateToMenu(state: TState) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<TValue>[] = [];

        const currentState: TValue[] = Array.isArray(state)
            // @ts-ignore
            ? state as TValue[]
            : [];

        if (currentState.length) {
            const checkboxButton = allButtons
                .filter((button) => currentState.includes(button.value));

            newButtons.push(...checkboxButton);
        }

        return newButtons.filter(Boolean);
    }

    menuToState(menu: TValue[]): TState {
        return menu.map((button: string) => button) as TState;
    }

    onActiveButton(ctx: TCtx, activeButton: MenuOption<TValue>) {
        const activeButtons: TValue[] = this.stateToMenu(this.state).map((button) => button.value);

        let buttonIndex = null;

        activeButtons.some((button, index) => {
            const isButtonInList = button === activeButton.value;

            if (isButtonInList) {
                buttonIndex = index;
                return true;
            }
        });

        if (buttonIndex || buttonIndex === 0) {
            activeButtons.splice(buttonIndex, 1);
        } else {
            activeButtons.push(activeButton.value);
        }

        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: TCtx, button: KeyboardButton<TValue>) {
        const {CHECKBOX_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isActiveButton} = super.getButtonLabelInfo(ctx, button);

        return isActiveButton ?
            CHECKBOX_FORMATTING.active + ' ' + label :
            CHECKBOX_FORMATTING.disabled + ' ' + label;
    }
}
