import { GenericMenu } from '../../src';
import { CheckboxMenu } from '../../src/menus/checkbox.menu';
import { FRUITS_FILTERS } from '../const';
import { Basket, CurrentCtx, FruitsFilterType, MenuAction } from '../interfaces';
import { initStartMenu } from './start.menu';

export const initBasketMenu = (ctx: CurrentCtx) => {
    new CheckboxMenu<CurrentCtx, FruitsFilterType, Basket['fruit']>(
        {
            action: MenuAction.BASKET,
            message: 'menu.basket.start',
            submitMessage: 'menu.basket.submit',
            filters: FRUITS_FILTERS,
            state: ctx.session.basket?.[FruitsFilterType.FRUIT],
            debug: true,
            replaceWithNextMenu: true,
            menuGetter: (menuCtx: CurrentCtx) => menuCtx.session.keyboardMenu,
            menuSetter: (menuCtx: CurrentCtx, menu: GenericMenu) => menuCtx.session.keyboardMenu = menu,
            onSubmit(changeCtx, state): any {
                changeCtx.session.basket[FruitsFilterType.FRUIT] = state;
                initStartMenu(changeCtx);
            },
        },
    ).sendMenu(ctx);
};
