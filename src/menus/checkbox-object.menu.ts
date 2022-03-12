import { CheckboxConfig, DefaultCtx } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { CheckboxMenu } from './checkbox.menu';


// @ts-ignore
export class CheckboxObjectMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends Record<TValue, boolean> = Record<string, boolean>,
    TValue extends string = string,
    // @ts-ignore
> extends CheckboxMenu<TCtx, TState, TValue> {
    private genericConfig: CheckboxConfig<TCtx, TState, TValue>;

    constructor(config: CheckboxConfig<TCtx, TState, TValue>) {
        super(config);
    }

    stateToMenu(state: TState) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<TValue>[] = [];

        const currentState: Partial<TState> = state ?? {};
        const currentStateKeys = Object.keys(currentState);

        const checkboxButton = allButtons
            .filter((button) => {
                const isItemSelected = currentStateKeys.includes(button.value);
                return this.genericConfig.invertedSelection ? !isItemSelected : isItemSelected;
            });

        newButtons.push(...checkboxButton);

        return newButtons.filter(Boolean);
    }

    menuToState(menu: TValue[]): TState {
        const state = {} as TState;

        if (this.genericConfig.invertedSelection) {
            this.flatFilters
                .filter((button) => !menu.includes(button.value))
                .map((button) => button.value)
                .forEach((button: string) => state[button] = true);
        } else {
            menu.forEach((button: string) => state[button] = true);
        }

        return state;
    }
}
