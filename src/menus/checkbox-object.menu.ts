import { CheckboxConfig, DefaultCtx } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { CheckboxMenu } from './checkbox.menu';


export class CheckboxObjectMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends Record<TValue, boolean> = Record<string, boolean>,
    TValue extends string = string,
    // @ts-ignore
> extends CheckboxMenu<TCtx, TState, TValue> {
    constructor(config: CheckboxConfig<TCtx, TState, TValue>) {
        super(config);
    }

    stateToMenu(state: TState) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<TValue>[] = [];

        const currentState: Partial<TState> = state ?? {};
        const currentStateKeys = Object.keys(currentState);

        if (currentStateKeys.length) {
            const checkboxButton = allButtons
                .filter((button) => currentStateKeys.includes(button.value));

            newButtons.push(...checkboxButton);
        }

        return newButtons.filter(Boolean);
    }

    menuToState(menu: TValue[]): TState {
        const state = {} as TState;
        menu.forEach((button: string) => state[button] = true);
        return state;
    }
}
