import { CheckboxObjectMenu } from '../../src';
import { FRUITS_FILTERS } from '../const';
import { Basket, CurrentCtx, FruitsFilterType, MenuAction } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initBasketObjectMenu = (ctx: CurrentCtx) => {
    new CheckboxObjectMenu<CurrentCtx, Basket['fruit_object']>(
        {
            action: MenuAction.BASKET_OBJECT,
            message: 'menu.basket.start',
            submitMessage: 'menu.basket.submit',
            filters: FRUITS_FILTERS,
            state: ctx.session.basket?.[FruitsFilterType.FRUIT_OBJECT],
            debug: true,
            replaceable: true,
            invertedSelection: true,
            formatting: {
                disabled: '⛔️',
            },
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state) {
                changeCtx.session.basket[FruitsFilterType.FRUIT_OBJECT] = state;
                initStartMenu(changeCtx);
            },
        },
    ).sendMenu(ctx);
};
