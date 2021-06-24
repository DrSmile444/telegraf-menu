import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOption, RangeConfig, RangeState } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RangeMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends RangeState<TValue> = RangeState<any>,
    TValue extends string = string,
> extends GenericMenu<TCtx, TState, TValue> {
    constructor(private config: RangeConfig<TCtx, TState, TValue>) {
        super(config);
    }

    stateToMenu(state: TState) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<any>[] = allButtons.filter((button) => {
            return state.from === button.value || state.to === button.value;
        });

        return newButtons.filter(Boolean);
    }

    menuToState(menu: TValue[]): RangeState {
        const newState: RangeState = {
            from: menu[0],
            to: menu[1],
        };

        if (!newState.from && +newState.from !== 0) {
            delete newState.from;
        }

        if (!newState.to && +newState.to !== 0) {
            delete newState.to;
        }

        Object.keys(newState).forEach((key) => {
            const value = newState[key];
            if (!value && value !== 0) {
                delete newState[key];
            }
        });

        return newState;
    }

    onActiveButton(ctx: TCtx, activeButton: MenuOption<TValue>) {
        const {
            activeButtonIndex,
            firstButtonIndex,
            lastButtonIndex,
            firstButton,
            lastButton,
        } = this.getRangeButtonIndexes(activeButton);

        let activeButtons: TValue[] = this.evenRange
            ? [firstButton, activeButton.value]
            : [activeButton.value, lastButton];
        activeButtons = activeButtons.filter(Boolean);

        if (this.evenRange && activeButtonIndex < firstButtonIndex || !this.evenRange && activeButtonIndex > lastButtonIndex) {
            activeButtons = activeButtons.reverse();
            this.evenRange = !this.evenRange;
        }

        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: TCtx, button: KeyboardButton<TValue>) {
        const {RANGE_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isDefaultActiveButton, isActiveButton} = this.getButtonLabelInfo(ctx, button);

        const { activeButtonIndex, firstButtonIndex, lastButtonIndex } = this.getRangeButtonIndexes(button);
        const isButtonInRange = activeButtonIndex >= firstButtonIndex && activeButtonIndex <= lastButtonIndex;
        const isCurrentButton = this.evenRange && activeButtonIndex === lastButtonIndex ||
            !this.evenRange && activeButtonIndex === firstButtonIndex;

        if (isCurrentButton) {
            return RANGE_FORMATTING.current + ' ' + label;
        }

        return isActiveButton || isButtonInRange || isDefaultActiveButton ?
            RANGE_FORMATTING.active + ' ' + label :
            RANGE_FORMATTING.disabled + ' ' + label;
    }

    /**
     * Returns active, first, and last button indexes and these buttons.
     * */
    private getRangeButtonIndexes(currentButton: KeyboardButton<TValue> | MenuOption<TValue>) {
        const allButtons = this.flatFilters;
        const firstButton = this.activeButtons[0];
        const lastButton = this.activeButtons[1];

        const firstDefault = allButtons.findIndex((button) => !!button.isDefault);

        const activeButtonIndex = allButtons
            .findIndex((button) => button.value === currentButton.value);

        const firstButtonIndex = allButtons
            .findIndex((button) => {
                return firstButton
                    ? button.value === firstButton
                    : !!button.isDefault;
            });

        const lastButtonIndex = allButtons
            .findIndex((button, index) => {
                return lastButton
                    ? button.value === lastButton
                    : !!button.isDefault && firstDefault !== index;
            });

        return {
            firstButton: firstButton || allButtons[firstButtonIndex].value,
            lastButton : lastButton || allButtons[lastButtonIndex].value,
            activeButtonIndex,
            firstButtonIndex,
            lastButtonIndex,
        };
    }
}
