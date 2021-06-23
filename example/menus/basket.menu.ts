import { CheckboxMenu } from '../../src';
import { FRUITS_FILTERS } from '../const';
import { Basket, CurrentCtx, FruitsFilterType, MenuAction } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initBasketMenu = (ctx: CurrentCtx) => {
    new CheckboxMenu<CurrentCtx, Basket['fruit']>(
        {
            action: MenuAction.BASKET,
            message: 'menu.basket.start',
            submitMessage: 'menu.basket.submit',
            filters: FRUITS_FILTERS,
            state: ctx.session.basket?.[FruitsFilterType.FRUIT],
            debug: true,
            replaceable: true,
            menuGetter: (menuCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx, menu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state): any {
                changeCtx.session.basket[FruitsFilterType.FRUIT] = state;
                initStartMenu(changeCtx);
            },
        },
    ).sendMenu(ctx);
};
