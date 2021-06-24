import { FORMATTING_EMOJIS } from '../const';
import { GenericMenu } from '../generic-menu';
import { DefaultCtx, MenuOptionPayload, RangeConfig, RangeState } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';


export class RangeMenu<
    TCtx extends DefaultCtx = DefaultCtx,
    TState extends RangeState = RangeState,
> extends GenericMenu<TCtx, TState> {
    constructor(private config: RangeConfig<TCtx, TState>) {
        super(config);
    }

    stateToMenu(state) {
        const allButtons = this.flatFilters;
        const newButtons: KeyboardButton<any>[] = allButtons.filter((button) => {
            return state.from === button.value.value || state.to === button.value.value;
        });

        return newButtons.filter(Boolean);
    }

    menuToState(menu): RangeState {
        const newState: { [key: string]: any | any[] } = {};

        newState.from = menu[0].value;
        newState.to = menu[1].value;

        Object.keys(newState).forEach((key) => {
            const value = newState[key];
            if (!value && value !== 0) {
                delete newState[key];
            }
        });

        return newState;
    }

    onActiveButton(ctx: TCtx, activeButton: MenuOptionPayload) {
        const {
            activeButtonIndex,
            firstButtonIndex,
            lastButtonIndex,
            firstButton,
            lastButton,
        } = this.getRangeButtonIndexes(activeButton);

        let activeButtons = this.evenRange
            ? [firstButton, activeButton]
            : [activeButton, lastButton];
        activeButtons = activeButtons.filter(Boolean);

        if (this.evenRange && activeButtonIndex < firstButtonIndex || !this.evenRange && activeButtonIndex > lastButtonIndex) {
            activeButtons = activeButtons.reverse();
            this.evenRange = !this.evenRange;
        }

        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: TCtx, button: KeyboardButton<MenuOptionPayload>) {
        const {RANGE_FORMATTING} = FORMATTING_EMOJIS;
        const {label, isDefaultActiveButton, isActiveButton} = this.getButtonLabelInfo(ctx, button);

        const { activeButtonIndex, firstButtonIndex, lastButtonIndex } = this.getRangeButtonIndexes(button.value);
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
    private getRangeButtonIndexes(currentButton: MenuOptionPayload) {
        const allButtons = this.flatFilters;
        const firstButton = this.activeButtons[0];
        const lastButton = this.activeButtons[1];

        const firstDefault = allButtons.findIndex((button) => !!button.value.default);

        const activeButtonIndex = allButtons
            .findIndex((button) => button.value.value === currentButton.value);

        const firstButtonIndex = allButtons
            .findIndex((button) => {
                return firstButton
                    ? button.value.value === firstButton.value
                    : !!button.value.default;
            });

        const lastButtonIndex = allButtons
            .findIndex((button, index) => {
                return lastButton
                    ? button.value.value === lastButton.value
                    : !!button.value.default && firstDefault !== index;
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
