import { FORMATTING_EMOJIS } from '../const';
import { MenuConfig, MenuFilters, MenuFormatters, MenuOptionPayload } from '../interfaces';
import { KeyboardButton } from '../keyboard-button';
import { GenericMenu } from '../generic-menu';
import { reduceArray } from '../utils';


export class RangeMenu<Ctx, State, Group> extends GenericMenu<any> {
    constructor(
        private config: MenuConfig<any, any, any>,
        private stateMappers: MenuFormatters<State, MenuFilters<Group>, Group> = {},
    ) {
        super(config, stateMappers);
    }

    stateToMenu(state, filters, groups) {
        const allButtons = filters.reduce(reduceArray);
        const newButtons: KeyboardButton<any>[] = allButtons.filter((button) => {
            return state.from === button.value.value || state.to === button.value.value;
        });

        return newButtons.filter(Boolean);
    }

    menuToState(menu, groups) {
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

    onActiveButton(ctx: Ctx, activeButton: MenuOptionPayload<Group>) {
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

        console.log(activeButton);

        super.toggleActiveButton(ctx, activeButtons);
    }

    formatButtonLabel(ctx: Ctx, button: KeyboardButton<MenuOptionPayload<Group>>) {
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
    private getRangeButtonIndexes(currentButton: MenuOptionPayload<Group>) {
        const allButtons = this.config.filters.reduce(reduceArray);
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
